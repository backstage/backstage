import React from 'react';
import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';

const SvgCounter = (props: SvgIconProps) =>
  React.createElement(
    SvgIcon,
    props,
    <path d="M2 6v12h6V6zm7 0v12h6V6zm7 0v12h6V6zM4 8h2c.55 0 1 .45 1 1v6c0 .55-.45 1-1 1H4c-.55 0-1-.45-1-1V9c0-.55.45-1 1-1zm7 0h2c.55 0 1 .45 1 1v6c0 .55-.45 1-1 1h-2c-.55 0-1-.45-1-1V9c0-.55.45-1 1-1zm6 0h1c0 .55.45 1 1 1s1-.45 1-1h1a2 2 0 11-4 0zM5 9c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1s1-.45 1-1v-4c0-.55-.45-1-1-1zm7 0c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1s1-.45 1-1v-4c0-.55-.45-1-1-1zm5 3h4v1l-1.719 3H18l1.688-3H17z" />,
  );

export default SvgCounter;
