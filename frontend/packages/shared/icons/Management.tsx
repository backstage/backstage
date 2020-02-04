import React from 'react';
import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';

const SvgManagement = (props: SvgIconProps) =>
  React.createElement(
    SvgIcon,
    props,
    <path d="M5 5C3.318 5 2 6.317 2 8s1.318 3 3 3 3-1.317 3-3-1.318-3-3-3zm7 0c-1.682 0-3 1.317-3 3s1.318 3 3 3 3-1.317 3-3-1.318-3-3-3zm7 0c-1.682 0-3 1.317-3 3s1.318 3 3 3 3-1.317 3-3-1.318-3-3-3zm-7 8c-3.533 0-6 1.324-6 3.219V19h12v-2.781C18 14.324 15.533 13 12 13zm6.527.012c.94.856 1.473 1.946 1.473 3.207V19h4v-2.781c0-1.8-2.226-3.081-5.473-3.207zm-13.054.002C2.226 13.139 0 14.42 0 16.219V19h4v-2.781c0-1.26.533-2.35 1.473-3.205z" />,
  );

export default SvgManagement;
