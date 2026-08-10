import React from 'react';

export interface KickerProps {
  children: React.ReactNode;
}

/** Small tracked-mono accent-colored label used ahead of headings, e.g. "№ 001 · AI & Evidence · Essay". */
export function Kicker({ children }: KickerProps) {
  return <span className="tas-kicker">{children}</span>;
}
