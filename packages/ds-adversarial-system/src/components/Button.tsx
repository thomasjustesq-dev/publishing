import React from 'react';

export interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
}

/** Rectangular, mono-uppercase button. Primary is solid accent fill; secondary is a 1px accent outline. Zero border-radius, per system rule. */
export function Button({ children, href, variant = 'primary', onClick }: ButtonProps) {
  const className = `tas-btn tas-btn--${variant}`;
  if (href) return <a className={className} href={href}>{children}</a>;
  return <button type="button" className={className} onClick={onClick}>{children}</button>;
}
