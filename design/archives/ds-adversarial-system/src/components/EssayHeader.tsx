import React from 'react';
import { Kicker } from './Kicker';

export interface EssayHeaderProps {
  kicker: string;
  title: string;
  dek?: string;
  byline: string;
}

/** Essay masthead block: kicker, Instrument Serif display title, italic dek, mono byline. */
export function EssayHeader({ kicker, title, dek, byline }: EssayHeaderProps) {
  return (
    <div className="tas-essay-header">
      <Kicker>{kicker}</Kicker>
      <h1>{title}</h1>
      {dek && <p className="tas-dek">{dek}</p>}
      <p className="tas-byline">{byline}</p>
    </div>
  );
}
