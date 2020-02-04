import React from 'react';
import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';

const SvgHeartWithPulse = (props: SvgIconProps) =>
  React.createElement(
    SvgIcon,
    props,
    <path d="M16.5 3C13.605 3 12 5.09 12 5.09S10.395 3 7.5 3A5.5 5.5 0 002 8.5c0 .503.075 1.005.203 1.5h3.464l2.579-1.934 2 3L11.667 10h1.611c.346-.595.984-1 1.722-1a2 2 0 110 4 1.994 1.994 0 01-1.723-1h-.944l-2.579 1.934-2-3L6.333 12h-3.31c1.514 2.764 4.282 5.08 5.257 5.99C9.858 19.46 12 21.35 12 21.35s2.142-1.89 3.719-3.36C17.088 16.713 22 12.671 22 8.5A5.5 5.5 0 0016.5 3z" />,
  );

export default SvgHeartWithPulse;
