import React from 'react';

export interface PullQuoteProps {
  children: React.ReactNode;
}

/** Italic Instrument Serif pull-quote with a 2px accent left border. */
export function PullQuote({ children }: PullQuoteProps) {
  return <blockquote className="tas-pull-quote">{children}</blockquote>;
}
