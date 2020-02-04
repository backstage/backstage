import React from 'react';
import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';

const SvgCompass = (props: SvgIconProps) =>
  React.createElement(
    SvgIcon,
    props,
    <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 2a8 8 0 110 16 8 8 0 010-16zm5 3l-6.824 3.176L7 17l6.824-3.176L17 7zm-5 3.9c.61 0 1.1.49 1.1 1.1 0 .61-.49 1.1-1.1 1.1-.61 0-1.1-.49-1.1-1.1 0-.61.49-1.1 1.1-1.1z" />,
  );

export default SvgCompass;
