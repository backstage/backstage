import React from 'react';
import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';

const SvgFilledCircle = (props: SvgIconProps) =>
  React.createElement(
    SvgIcon,
    props,
    <path d="M12 2A10 10 0 002 12a10 10 0 0010 10 10 10 0 0010-10A10 10 0 0012 2z" />,
  );

export default SvgFilledCircle;
