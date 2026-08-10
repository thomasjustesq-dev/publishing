import React from 'react';

export interface PercontationMarkProps {
  /** Ringed (circled) or bare. Ringed is used in the masthead lockup; bare in the footer and section breaks. */
  variant?: 'ring' | 'bare';
  /** Diameter in px for the ring variant, or font-size in px for bare. */
  size?: number;
}

/** The Just Asking Questions mark: a reversed question mark (percontation point) in EB Garamond, oxblood. */
export function PercontationMark({ variant = 'bare', size = 44 }: PercontationMarkProps) {
  if (variant === 'ring') {
    return (
      <span className="jaq-mark--ring" style={{ width: size, height: size }}>
        <span className="jaq-mark-glyph" style={{ fontSize: size * 0.5 }}>?</span>
      </span>
    );
  }
  return <span className="jaq-mark" style={{ fontSize: size }}>?</span>;
}
