import React from 'react';
import { PercontationMark } from './PercontationMark';

export interface FooterProps {
  year?: number;
  substackHref?: string;
}

/** Site footer: bare percontation mark, mono byline tagline, copyright + Substack link. */
export function Footer({ year = 2026, substackHref = '#' }: FooterProps) {
  return (
    <footer className="jaq-footer">
      <PercontationMark variant="bare" size={32} />
      <p className="jaq-byline">THOMAS M. JUST · NO VERDICTS WITHHELD</p>
      <p className="jaq-copyright">&copy; {year} · <a href={substackHref}>Subscribe on Substack</a></p>
    </footer>
  );
}
