import React from 'react';
import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';

const SvgPassword = (props: SvgIconProps) =>
  React.createElement(
    SvgIcon,
    props,
    <path d="M7 5a7 7 0 106.707 9H18v3h4v-3h2v-4H13.707A7 7 0 007 5zm0 4a3 3 0 110 6 3 3 0 010-6z" />,
  );

export default SvgPassword;
