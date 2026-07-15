import React from 'react';

export interface FooterProps {
  tagline?: string;
  year?: number;
  substackHref?: string;
}

/** Site footer: double-rule motif, italic tagline, copyright + Substack link. */
export function Footer({ tagline = 'Writing from the edge of AI, security, and liberty', year = 2026, substackHref = '#' }: FooterProps) {
  return (
    <footer className="tas-footer">
      <div className="tas-rule-double" />
      <p className="tas-tagline">{tagline}</p>
      <p>&copy; {year} Thomas M. Just · <a href={substackHref}>Subscribe on Substack</a></p>
    </footer>
  );
}
