import React from 'react';
import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';

const SvgShippingContainer = (props: SvgIconProps) =>
  React.createElement(
    SvgIcon,
    props,
    <path d="M18.586 3l-1 1H6.414l-1-1H4a2 2 0 00-2 2v13a2 2 0 002 2h16a2 2 0 002-2V5a2 2 0 00-2-2h-1.414zM7 16H5V8h2v8zm4 0H9V8h2v8zm4 0h-2V8h2v8zm4 0h-2V8h2v8z" />,
  );

export default SvgShippingContainer;
