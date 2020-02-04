import React from 'react';
import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';

const SvgMegaphone = (props: SvgIconProps) =>
  React.createElement(
    SvgIcon,
    props,
    <path d="M20 3l-1 1.285L6 9v6l2.451.889-.283.8c-.213.601.101 1.26.703 1.473l2.178.772a1.156 1.156 0 001.474-.705l.27-.764L19 19.715 20 21h2V3h-2zM2 9v6h2V9H2z" />,
  );

export default SvgMegaphone;
