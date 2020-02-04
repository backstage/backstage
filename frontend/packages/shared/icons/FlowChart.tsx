import React from 'react';
import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';

const SvgFlowChart = (props: SvgIconProps) =>
  React.createElement(
    SvgIcon,
    props,
    <path d="M10 3a1 1 0 00-1 1v4a1 1 0 001 1h1v2H4a1 1 0 00-1 1v3H2a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1v-4a1 1 0 00-1-1H5v-2h6v2h-1a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1v-4a1 1 0 00-1-1h-1v-2h6v2h-1a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1v-4a1 1 0 00-1-1h-1v-3a1 1 0 00-1-1h-7V9h1a1 1 0 001-1V4a1 1 0 00-1-1h-4z" />,
  );

export default SvgFlowChart;
