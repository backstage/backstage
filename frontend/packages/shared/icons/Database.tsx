import React from 'react';
import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';

const SvgDatabase = (props: SvgIconProps) =>
  React.createElement(
    SvgIcon,
    props,
    <path d="M6 2a2 2 0 00-2 2v3h16V4a2 2 0 00-2-2H6zM4 9v6h16V9H4zm0 8v3a2 2 0 002 2h12a2 2 0 002-2v-3H4z" />,
  );

export default SvgDatabase;
