import React, { Fragment } from 'react';

const TOKEN = '<wbr>';

/**
 * Return a component with <wbr /> React tags in strategic places in the given string body,
 * which gives the browser hints about where to break lines. This is useful for long-running
 * things like IDs that are to be displayed.
 */
const BreakHints = ({ body }) => {
  const parts = body
    .replace(/([-_./])/g, (...match) => `${TOKEN}${match[1]}`)
    .replace(/([a-z])([A-Z])/g, (...match) => `${match[1]}${TOKEN}${match[2]}`)
    .split(TOKEN);
  let n = 0;
  const children = parts.reduce((comps, next) => {
    return [...comps, next, <wbr key={n++} />];
  }, []);
  // Remove unnecessary trailing <wbr> tag
  children.pop();
  return <Fragment>{children}</Fragment>;
};

export default BreakHints;
