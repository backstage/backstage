import React from 'react';
import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';

const SvgAdd = (props: SvgIconProps) =>
  React.createElement(
    SvgIcon,
    props,
    <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4 11h-3v3h-2v-3H8v-2h3V8h2v3h3v2z" />,
  );

export default SvgAdd;
