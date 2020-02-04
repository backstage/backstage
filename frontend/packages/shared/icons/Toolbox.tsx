import React from 'react';
import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';

const SvgToolbox = (props: SvgIconProps) =>
  React.createElement(
    SvgIcon,
    props,
    <path d="M9 3v1H4a2 2 0 00-2 2v2h20V6a2 2 0 00-2-2h-5V3H9zm-7 7v8c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2v-8h-3v1h-4v-1H9v1H5v-1H2z" />,
  );

export default SvgToolbox;
