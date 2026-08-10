import React from 'react';

export interface DocketRowProps {
  no: string;
  title: string;
  date: string;
  href: string;
}

/** One row of the docket (essay index): № label, Instrument Serif title, mono date, hairline bottom border. */
export function DocketRow({ no, title, date, href }: DocketRowProps) {
  return (
    <a className="tas-docket-row" href={href}>
      <span className="tas-docket-no">{no}</span>
      <span className="tas-docket-title">{title}</span>
      <span className="tas-docket-date">{date}</span>
    </a>
  );
}
