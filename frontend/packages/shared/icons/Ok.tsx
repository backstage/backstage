import React from 'react';
import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';

const SvgOk = (props: SvgIconProps) =>
  React.createElement(
    SvgIcon,
    props,
    <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-2 15.414l-4.707-4.707 1.414-1.414L10 14.586l7.293-7.293 1.414 1.414L10 17.414z" />,
  );

export default SvgOk;
