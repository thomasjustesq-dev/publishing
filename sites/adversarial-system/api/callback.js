/**
 * Decap CMS — complete GitHub OAuth (TAS host mirror).
 * Env: OAUTH_GITHUB_CLIENT_ID, OAUTH_GITHUB_CLIENT_SECRET, OAUTH_ORIGINS
 */
const DEFAULT_ORIGINS = [
  'https://www.just-asking-questions.com',
  'https://www.theadversarialsystem.com',
  'https://just-asking-questions.com',
  'https://theadversarialsystem.com',
];

function allowedOrigins() {
  const raw = process.env.OAUTH_ORIGINS;
  if (!raw || !raw.trim()) return DEFAULT_ORIGINS;
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function htmlPage(body) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"/><title>Authorizing…</title></head><body>${body}</body></html>`;
}

function successScript(token, origins) {
  const content = JSON.stringify({ token, provider: 'github' });
  const originsJson = JSON.stringify(origins);
  return htmlPage(`
<script>
(function () {
  var origins = ${originsJson};
  function ok(origin) {
    for (var i = 0; i < origins.length; i++) {
      if (origins[i] === '*' || origins[i] === origin) return true;
    }
    return false;
  }
  function onMessage(e) {
    if (!ok(e.origin)) return;
    window.opener.postMessage(
      'authorization:github:success:' + ${JSON.stringify(content)},
      e.origin
    );
  }
  window.addEventListener('message', onMessage, false);
  window.opener.postMessage('authorizing:github', '*');
})();
</script>
<p>Completing GitHub login… you can close this window if it does not close itself.</p>
`);
}

function errorScript(message, origins) {
  const content = JSON.stringify(message);
  const originsJson = JSON.stringify(origins);
  return htmlPage(`
<script>
(function () {
  var origins = ${originsJson};
  function ok(origin) {
    for (var i = 0; i < origins.length; i++) {
      if (origins[i] === '*' || origins[i] === origin) return true;
    }
    return false;
  }
  function onMessage(e) {
    if (!ok(e.origin)) return;
    window.opener.postMessage(
      'authorization:github:error:' + ${JSON.stringify(content)},
      e.origin
    );
  }
  window.addEventListener('message', onMessage, false);
  window.opener.postMessage('authorizing:github', '*');
})();
</script>
<p>Authorization failed: ${String(message).replace(/[<>&]/g, '')}</p>
`);
}

export default async function handler(req, res) {
  const origins = allowedOrigins();
  const clientId = process.env.OAUTH_GITHUB_CLIENT_ID;
  const clientSecret = process.env.OAUTH_GITHUB_CLIENT_SECRET;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');

  if (!clientId || !clientSecret) {
    res.statusCode = 500;
    res.end(
      errorScript(
        'OAuth client id/secret not configured on this deployment.',
        origins,
      ),
    );
    return;
  }

  const url = new URL(req.url || '/', 'https://localhost');
  const code = url.searchParams.get('code');
  if (!code) {
    res.statusCode = 400;
    res.end(errorScript('Missing authorization code.', origins));
    return;
  }

  try {
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    });

    if (!tokenRes.ok) {
      res.statusCode = 502;
      res.end(errorScript(`GitHub token exchange failed (${tokenRes.status}).`, origins));
      return;
    }

    const data = await tokenRes.json();
    if (data.error || !data.access_token) {
      res.statusCode = 400;
      res.end(
        errorScript(data.error_description || data.error || 'No access token.', origins),
      );
      return;
    }

    res.statusCode = 200;
    res.end(successScript(data.access_token, origins));
  } catch (err) {
    res.statusCode = 500;
    res.end(errorScript(err?.message || 'Token exchange error.', origins));
  }
}
