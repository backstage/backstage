import React from 'react';
import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';

const SvgPlanner = (props: SvgIconProps) =>
  React.createElement(
    SvgIcon,
    props,
    <path d="M6 2v2H5c-1.093 0-2 .907-2 2v14c0 1.093.907 2 2 2h14c1.093 0 2-.907 2-2V6c0-1.093-.907-2-2-2h-1V2h-2v2H8V2H6zM5 9h14v11H5V9zm7 4v5h5v-5h-5z" />,
  );

export default SvgPlanner;
