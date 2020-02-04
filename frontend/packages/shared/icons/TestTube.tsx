import React from 'react';
import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';

const SvgTestTube = (props: SvgIconProps) =>
  React.createElement(
    SvgIcon,
    props,
    <path d="M8 3v2h1v5l-5.572 7.773h.004A1.98 1.98 0 003 19a2 2 0 002 2h14a2 2 0 002-2 1.98 1.98 0 00-.432-1.227h.004L15 10V5h1V3H8zm3 2h2v5h-2V5zm2 8a1 1 0 110 2 1 1 0 010-2zm-3.5 3a1.5 1.5 0 11-.001 3.001A1.5 1.5 0 019.5 16z" />,
  );

export default SvgTestTube;
