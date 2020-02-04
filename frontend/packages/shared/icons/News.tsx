import React from 'react';
import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';

const SvgNews = (props: SvgIconProps) =>
  React.createElement(
    SvgIcon,
    props,
    <path d="M2 3v15c0 1.645 1.355 3 3 3h14c1.645 0 3-1.355 3-3V7h-2v11c0 .565-.435 1-1 1s-1-.435-1-1V3H2zm2 2h12v13c0 .388.279.658.416 1H5c-.565 0-1-.435-1-1V5zm2 2v3h8V7H6zm0 5v2h8v-2H6zm0 4v2h8v-2H6z" />,
  );

export default SvgNews;
