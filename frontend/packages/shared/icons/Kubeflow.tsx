import React from 'react';
import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';

const SvgKubeflow = (props: SvgIconProps) =>
  React.createElement(
    SvgIcon,
    props,
    <g fill="#2e77d0" fillRule="evenodd">
      <path d="M5.58 6.73l.438 10.98 7.93-10.121a.73.73 0 011.033-.12l4.947 3.97-1.61-7.055L5.58 6.731" />
      <path d="M6.295 19.724h7.035l-4.32-3.466-2.715 3.466M14.643 9.072l-4.731 6.036 5.04 4.044 4.782-5.995-5.091-4.085M4.254 5.671h.001L8.415.453l-6.709 3.23-1.657 7.26 4.205-5.273M.142 13.171l4.456 5.588-.424-10.643L.142 13.17M17.022 3.138L10.607.048 6.615 5.055l10.407-1.917" />
    </g>,
  );

export default SvgKubeflow;
