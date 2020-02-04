import React from 'react';
import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';

const SvgList = (props: SvgIconProps) =>
  React.createElement(
    SvgIcon,
    props,
    <path d="M3 4.5A1.5 1.5 0 001.5 6 1.5 1.5 0 003 7.5 1.5 1.5 0 004.5 6 1.5 1.5 0 003 4.5zM7 5v2h15V5H7zm-4 5.5A1.5 1.5 0 001.5 12 1.5 1.5 0 003 13.5 1.5 1.5 0 004.5 12 1.5 1.5 0 003 10.5zm4 .5v2h15v-2H7zm-4 5.5A1.5 1.5 0 001.5 18 1.5 1.5 0 003 19.5 1.5 1.5 0 004.5 18 1.5 1.5 0 003 16.5zm4 .5v2h15v-2H7z" />,
  );

export default SvgList;
