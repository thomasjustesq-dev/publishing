import React from 'react';

export interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
}

/** Mono-uppercase button. Primary is solid oxblood fill; secondary is an outlined oxblood border. Zero border-radius. */
export function Button({ children, href, variant = 'primary', onClick }: ButtonProps) {
  const className = `jaq-btn${variant === 'primary' ? ' jaq-btn--primary' : ''}`;
  if (href) return <a className={className} href={href}>{children}</a>;
  return <button type="button" className={className} onClick={onClick}>{children}</button>;
}
