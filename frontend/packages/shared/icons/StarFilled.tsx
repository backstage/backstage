import React from 'react';
import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';

const SvgStarFilled = (props: SvgIconProps) =>
  React.createElement(
    SvgIcon,
    props,
    <path d="M23.04 9h-8.27L12 1 9.23 9l-8.27.021 6.559 5.043L5.177 22 12 17.321 18.823 22l-2.342-7.935L23.04 9z" />,
  );

export default SvgStarFilled;
