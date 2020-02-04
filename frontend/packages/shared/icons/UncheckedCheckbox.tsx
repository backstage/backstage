import React from 'react';
import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';

const SvgUncheckedCheckbox = (props: SvgIconProps) =>
  React.createElement(SvgIcon, props, <path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2z" />);

export default SvgUncheckedCheckbox;
