/**
 * Decap CMS — begin GitHub OAuth.
 * Env: OAUTH_GITHUB_CLIENT_ID, OAUTH_REDIRECT_URL (optional; defaults to this host /api/callback)
 */
export default function handler(req, res) {
  const clientId = process.env.OAUTH_GITHUB_CLIENT_ID;
  if (!clientId) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end('OAUTH_GITHUB_CLIENT_ID is not configured on this deployment.');
    return;
  }

  const host = req.headers['x-forwarded-host'] || req.headers.host || 'www.just-asking-questions.com';
  const proto = (req.headers['x-forwarded-proto'] || 'https').split(',')[0].trim();
  const redirectUri =
    process.env.OAUTH_REDIRECT_URL || `${proto}://${host}/api/callback`;

  const authorize = new URL('https://github.com/login/oauth/authorize');
  authorize.searchParams.set('client_id', clientId);
  authorize.searchParams.set('scope', process.env.OAUTH_SCOPES || 'repo,user');
  authorize.searchParams.set('redirect_uri', redirectUri);

  res.statusCode = 302;
  res.setHeader('Location', authorize.toString());
  res.setHeader('Cache-Control', 'no-store');
  res.end();
}
