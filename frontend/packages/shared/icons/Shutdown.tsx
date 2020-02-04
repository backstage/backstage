import React from 'react';
import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';

const SvgShutdown = (props: SvgIconProps) =>
  React.createElement(
    SvgIcon,
    props,
    <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1 2h2v8h-2V4zm1 16c-4.411 0-8-3.589-8-8 0-3.35 2.072-6.221 5-7.411v2.223A5.999 5.999 0 006 12c0 3.309 2.691 6 6 6s6-2.691 6-6a5.999 5.999 0 00-3-5.188V4.589c2.928 1.19 5 4.061 5 7.411 0 4.411-3.589 8-8 8z" />,
  );

export default SvgShutdown;
