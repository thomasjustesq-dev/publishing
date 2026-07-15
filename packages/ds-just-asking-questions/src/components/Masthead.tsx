import React from 'react';
import { PercontationMark } from './PercontationMark';

export interface MastheadProps {
  homeHref?: string;
  onToggleTheme?: () => void;
  theme?: 'light' | 'dark';
  subscribeHref?: string;
}

/** Just Asking Questions masthead: ringed percontation-mark lockup + wordmark, theme toggle, subscribe CTA. */
export function Masthead({ homeHref = '/', onToggleTheme, theme = 'light', subscribeHref = '#' }: MastheadProps) {
  return (
    <header className="jaq-masthead">
      <a href={homeHref} className="jaq-lockup">
        <PercontationMark variant="ring" size={44} />
        <span className="jaq-wordmark">Just Asking Questions</span>
      </a>
      <nav className="jaq-nav">
        <button type="button" className="jaq-theme-toggle" onClick={onToggleTheme} aria-label="Toggle theme">
          {theme === 'dark' ? '☀' : '☾'}
        </button>
        <a className="jaq-btn jaq-btn--primary" href={subscribeHref}>Subscribe</a>
      </nav>
    </header>
  );
}
