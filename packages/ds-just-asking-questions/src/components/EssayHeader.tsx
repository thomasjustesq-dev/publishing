import React from 'react';

export interface EssayHeaderProps {
  title: string;
  dek?: string;
  byline: string;
}

/** Essay masthead block: EB Garamond display title, italic Newsreader dek, mono byline. */
export function EssayHeader({ title, dek, byline }: EssayHeaderProps) {
  return (
    <div className="jaq-essay-header">
      <h1>{title}</h1>
      {dek && <p className="jaq-dek">{dek}</p>}
      <p className="jaq-byline">{byline}</p>
    </div>
  );
}
