import React from 'react';
import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';

const SvgExternalLink = (props: SvgIconProps) =>
  React.createElement(
    SvgIcon,
    props,
    <path d="M5 3c-1.093 0-2 .907-2 2v14c0 1.093.907 2 2 2h14c1.093 0 2-.907 2-2v-7h-2v7H5V5h7V3H5zm9 0v2h3.586l-9.293 9.293 1.414 1.414L19 6.414V10h2V3h-7z" />,
  );

export default SvgExternalLink;
