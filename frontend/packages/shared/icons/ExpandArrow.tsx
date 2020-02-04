import React from 'react';
import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';

const SvgExpandArrow = (props: SvgIconProps) =>
  React.createElement(SvgIcon, props, <path d="M7.43 9.5L5.93 11 12 17.07 18.07 11l-1.5-1.5L12 14.07 7.43 9.5z" />);

export default SvgExpandArrow;
