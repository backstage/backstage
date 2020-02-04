import React from 'react';
import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';

const SvgCopy = (props: SvgIconProps) =>
  React.createElement(
    SvgIcon,
    props,
    <path d="M4 2a2 2 0 00-2 2v14h2V4h14V2H4zm4 4a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V8a2 2 0 00-2-2H8zm0 2h12v12H8V8z" />,
  );

export default SvgCopy;
