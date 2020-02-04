import React from 'react';
import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';

const SvgHexagon = (props: SvgIconProps) =>
  React.createElement(
    SvgIcon,
    props,
    <path d="M6.85 3l-5.145 9 5.145 9h10.3l5.145-9-5.145-9H6.85zm1.16 2h7.98l4.002 7-4.002 7H8.01l-4.002-7L8.01 5z" />,
  );

export default SvgHexagon;
