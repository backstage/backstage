import React from 'react';
import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';

const SvgAreaChart = (props: SvgIconProps) =>
  React.createElement(
    SvgIcon,
    props,
    <path d="M16.017 15.387l-3.932-3.933-5.022 5.022L5 14.414v-2.828l2.063 2.063 5.022-5.022 3.932 3.933L21 7.576V3.67l-5 5-3.646-3.646-5.108 5.108L5 7.886V3H3v16c0 1.103.897 2 2 2h16V10.404l-4.983 4.983z" />,
  );

export default SvgAreaChart;
