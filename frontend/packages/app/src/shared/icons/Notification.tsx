import React from 'react';
import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';

const SvgNotification = (props: SvgIconProps) =>
  React.createElement(
    SvgIcon,
    props,
    <path d="M12 2a1.5 1.5 0 00-1.5 1.5v.695A5.997 5.997 0 006 10v6l-1.535 1.156h-.002A1 1 0 004 18a1 1 0 001 1h14a1 1 0 001-1 1 1 0 00-.463-.844L18 16v-6a5.997 5.997 0 00-4.5-5.805V3.5A1.5 1.5 0 0012 2zm-2 18c0 1.1.9 2 2 2s2-.9 2-2h-4z" />,
  );

export default SvgNotification;
