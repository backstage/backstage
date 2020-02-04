import React from 'react';
import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';

const SvgPin = (props: SvgIconProps) =>
  React.createElement(
    SvgIcon,
    props,
    <path d="M14.707 2.293l-1.414 1.414 1.096 1.096-6.2 4.972-1.482-1.482-1.414 1.414 3.8 3.8L3 19.6V21h1.4l6.092-6.094 3.801 3.801 1.414-1.414-1.396-1.397 4.904-6.267 1.078 1.078 1.414-1.414-7-7z" />,
  );

export default SvgPin;
