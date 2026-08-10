import React from 'react';

export interface VolumeBarProps {
  volume?: string;
  date?: string;
  status?: string;
}

/** The volume bar: a slim tracked-mono strip at the very top of the page. Hidden below 900px in the site's own CSS. */
export function VolumeBar({ volume = 'Vol. I — Austin', date = 'July 12, 2026', status = 'Independent' }: VolumeBarProps) {
  return (
    <div className="tas-volume-bar">
      <span>{volume}</span>
      <span>{date}</span>
      <span>{status}</span>
    </div>
  );
}
