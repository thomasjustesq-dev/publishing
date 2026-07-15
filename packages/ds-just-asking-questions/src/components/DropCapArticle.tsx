import React from 'react';

export interface DropCapArticleProps {
  children: React.ReactNode;
}

/** Wraps essay body copy so the first letter of the first paragraph renders as a large oxblood drop cap. */
export function DropCapArticle({ children }: DropCapArticleProps) {
  return <div className="jaq-drop-cap">{children}</div>;
}
