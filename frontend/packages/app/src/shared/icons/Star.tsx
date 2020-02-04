import React from 'react';
import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';

const SvgStar = (props: SvgIconProps) =>
  React.createElement(
    SvgIcon,
    props,
    <path d="M23.04 9.021l-8.27-.225L12 1 9.23 8.796l-8.27.225 6.559 5.043L5.177 22 12 17.321 18.823 22l-2.342-7.935 6.559-5.044zM12 14.896l-3.312 2.271 1.137-3.851-3.183-2.448 4.014-.109L12 6.974l1.344 3.784 4.014.109-3.183 2.448 1.137 3.851L12 14.896z" />,
  );

export default SvgStar;
