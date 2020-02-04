import React from 'react';
import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';

const SvgManage = (props: SvgIconProps) =>
  React.createElement(
    SvgIcon,
    props,
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6.5 11L12 2l5.5 9h-11zm7.43-2L12 5.84 10.06 9h3.87zm3.57 4c-2.49 0-4.5 2.01-4.5 4.5s2.01 4.5 4.5 4.5 4.5-2.01 4.5-4.5-2.01-4.5-4.5-4.5zM15 17.5a2.5 2.5 0 005 0 2.5 2.5 0 00-5 0zm-12 4h8v-8H3v8zm6-6H5v4h4v-4z"
      fill="#BDBDBD"
    />,
  );

export default SvgManage;
