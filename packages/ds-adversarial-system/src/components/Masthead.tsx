import React from 'react';

export interface MastheadProps {
  /** Wordmark image src (the primary wordmark asset). */
  wordmarkSrc: string;
  /** URL the wordmark links to. */
  homeHref?: string;
  /** Called when the theme toggle is clicked. */
  onToggleTheme?: () => void;
  /** Current theme, controls the toggle icon. */
  theme?: 'light' | 'dark';
  /** Subscribe button href (Substack subscribe link). */
  subscribeHref?: string;
}

/** The Adversarial System masthead: wordmark, nav, theme toggle, subscribe CTA. Sticky, blurred-glass background. */
export function Masthead({ wordmarkSrc, homeHref = '/', onToggleTheme, theme = 'light', subscribeHref = '#' }: MastheadProps) {
  return (
    <header className="tas-masthead">
      <a href={homeHref} style={{ lineHeight: 0 }}>
        <img src={wordmarkSrc} alt="The Adversarial System" style={{ height: 28, width: 'auto' }} />
      </a>
      <nav>
        <a href="/">Docket</a>
        <button type="button" className="tas-theme-toggle" onClick={onToggleTheme} aria-label="Toggle theme">
          {theme === 'dark' ? '☀' : '☾'}
        </button>
        <a className="tas-btn tas-btn--primary" href={subscribeHref}>Subscribe</a>
      </nav>
    </header>
  );
}
