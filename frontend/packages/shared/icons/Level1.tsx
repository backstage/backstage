import React from 'react';
import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';

const SvgLevel1 = (props: SvgIconProps) =>
  React.createElement(
    SvgIcon,
    props,
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm1.3 14.6h-1.8V9.5l-2.2.7V8.7l3.8-1.4h.2v9.3z" />,
  );

export default SvgLevel1;
