import React from 'react';
import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';

const SvgServer = (props: SvgIconProps) =>
  React.createElement(
    SvgIcon,
    props,
    <path d="M7 1a2 2 0 00-2 2v18a2 2 0 002 2h10a2 2 0 002-2V3a2 2 0 00-2-2H7zm0 2h10v10H7V3zm2 2v2h6V5H9zm0 4v2h6V9H9zm3 7.5a1.5 1.5 0 11-.001 3.001A1.5 1.5 0 0112 16.5z" />,
  );

export default SvgServer;
