import React from 'react';
import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';

const SvgTopic = (props: SvgIconProps) =>
  React.createElement(
    SvgIcon,
    props,
    <path d="M4 3c-1.1 0-1.99.9-1.99 2l-.008 11.998c0 1.105.895 2.002 2 2.002H6v4l4-4h10c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2H4z" />,
  );

export default SvgTopic;
