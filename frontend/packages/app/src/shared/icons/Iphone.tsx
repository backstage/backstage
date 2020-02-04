import React from 'react';
import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';

const SvgIphone = (props: SvgIconProps) =>
  React.createElement(
    SvgIcon,
    props,
    <path d="M16.5 1h-9A2.5 2.5 0 005 3.5v17A2.5 2.5 0 007.5 23h9a2.5 2.5 0 002.5-2.5v-17A2.5 2.5 0 0016.5 1zM12 21.125a1.124 1.124 0 11-.002-2.248A1.124 1.124 0 0112 21.125zM17 18H7V4h10v14z" />,
  );

export default SvgIphone;
