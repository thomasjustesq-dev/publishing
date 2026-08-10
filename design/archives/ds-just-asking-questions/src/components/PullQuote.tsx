import React from 'react';

export interface PullQuoteProps {
  children: React.ReactNode;
}

/** Italic EB Garamond 500 pull-quote with a 2px oxblood left border. */
export function PullQuote({ children }: PullQuoteProps) {
  return <blockquote className="jaq-pull-quote">{children}</blockquote>;
}
