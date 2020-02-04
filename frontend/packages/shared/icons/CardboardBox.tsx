import React from 'react';
import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';

const SvgCardboardBox = (props: SvgIconProps) =>
  React.createElement(
    SvgIcon,
    props,
    <path d="M5.75 3a1 1 0 00-.863.496l-1.75 3A1 1 0 003 7v12c0 1.093.907 2 2 2h14c1.093 0 2-.907 2-2V7a1 1 0 00-.137-.504l-1.75-3A1 1 0 0018.25 3H5.75zm.574 2H11v2H5.158l1.166-2zM13 5h4.676l1.166 2H13V5zm-4 5h6v2H9v-2z" />,
  );

export default SvgCardboardBox;
