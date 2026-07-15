import React from 'react';

export interface EssayListItemProps {
  title: string;
  date: string;
  href: string;
}

/** One row of the essay index: EB Garamond title link + mono date, hairline bottom border. */
export function EssayListItem({ title, date, href }: EssayListItemProps) {
  return (
    <li className="jaq-essay-list-item">
      <a className="jaq-title" href={href}>{title}</a>
      <span className="jaq-date">— {date}</span>
    </li>
  );
}
