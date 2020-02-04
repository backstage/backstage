import React from 'react';
import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';

const SvgMultiply = (props: SvgIconProps) =>
  React.createElement(
    SvgIcon,
    props,
    <path d="M5.707 4.293L4.293 5.707 10.586 12l-6.293 6.293 1.414 1.414L12 13.414l6.293 6.293 1.414-1.414L13.414 12l6.293-6.293-1.414-1.414L12 10.586 5.707 4.293z" />,
  );

export default SvgMultiply;
