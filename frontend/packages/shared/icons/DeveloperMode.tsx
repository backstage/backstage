import React from 'react';
import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';

const SvgDeveloperMode = (props: SvgIconProps) =>
  React.createElement(
    SvgIcon,
    props,
    <path d="M7.5 1A2.5 2.5 0 005 3.5v2.258L6.758 4h10.484L19 5.758V3.5A2.5 2.5 0 0016.5 1h-9zm-.207 5.293L2.586 11l4.707 4.707 1.414-1.414L5.414 11l3.293-3.293-1.414-1.414zm9.414 0l-1.414 1.414L18.586 11l-3.293 3.293 1.414 1.414L21.414 11l-4.707-4.707zM5 16.243V20.5A2.5 2.5 0 007.5 23h9a2.5 2.5 0 002.5-2.5v-4.258L17.242 18H6.758L5 16.242zm7 2.632a1.124 1.124 0 11.002 2.248A1.124 1.124 0 0112 18.875z" />,
  );

export default SvgDeveloperMode;
