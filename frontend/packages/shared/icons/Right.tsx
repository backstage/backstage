import React from 'react';
import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';

const SvgRight = (props: SvgIconProps) =>
  React.createElement(
    SvgIcon,
    props,
    <path d="M14 4.93l-1.5 1.5L17.07 11H3v2h14.07l-4.57 4.57 1.5 1.5L21.07 12 14 4.93z" />,
  );

export default SvgRight;
