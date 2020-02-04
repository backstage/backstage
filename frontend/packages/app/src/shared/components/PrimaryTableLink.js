import React from 'react';
import BreakHints from 'shared/components/BreakHints';
import Link from 'shared/components/Link';

const PrimaryTableLink = ({ to, text }) => {
  return (
    <Link to={to}>
      <BreakHints body={text} />
    </Link>
  );
};

export default PrimaryTableLink;
