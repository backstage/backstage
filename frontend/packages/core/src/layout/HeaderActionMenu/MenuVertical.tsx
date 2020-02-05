import React from 'react';
import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';

const SvgMenuVertical = (props: SvgIconProps) =>
  React.createElement(
    SvgIcon,
    props,
    <path d="M11 3a1 1 0 00-1 1v2a1 1 0 001 1h2a1 1 0 001-1V4a1 1 0 00-1-1h-2zm0 7a1 1 0 00-1 1v2a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 00-1-1h-2zm0 7a1 1 0 00-1 1v2a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 00-1-1h-2z" />,
  );

export default SvgMenuVertical;
