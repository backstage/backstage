import React from 'react';
import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';

const SvgDownload = (props: SvgIconProps) =>
  React.createElement(
    SvgIcon,
    props,
    <path d="M11 2a1 1 0 00-1 1v8H6l6 6 6-6h-4V3a1 1 0 00-1-1h-2zM2 20v2h20v-2H2z" />,
  );

export default SvgDownload;
