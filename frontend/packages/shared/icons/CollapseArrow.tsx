import React from 'react';
import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';

const SvgCollapseArrow = (props: SvgIconProps) =>
  React.createElement(SvgIcon, props, <path d="M12 6.93L5.93 13l1.5 1.5L12 9.93l4.57 4.57 1.5-1.5L12 6.93z" />);

export default SvgCollapseArrow;
