import React from 'react';
import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';

const SvgInfoSquared = (props: SvgIconProps) =>
  React.createElement(
    SvgIcon,
    props,
    <path d="M21 19V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2zM11 9V7h2v2h-2zm0 8v-6h2v6h-2z" />,
  );

export default SvgInfoSquared;
