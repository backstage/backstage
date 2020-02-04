import React from 'react';
import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';

const SvgPlatforms = (props: SvgIconProps) =>
  React.createElement(
    SvgIcon,
    props,
    <path d="M11.5 0L0 5.816l2.012 1.016L5.617 8.66 0 11.5l5.617 2.84L0 17.184 11.5 23 23 17.184l-5.617-2.844L23 11.5l-5.617-2.84L23 5.816zm0 2.54l6.477 3.276L11.5 9.094 5.023 5.816zM8.129 9.93l3.371 1.703 3.371-1.703 3.106 1.57-6.477 3.277L5.023 11.5zm0 0" />,
  );

export default SvgPlatforms;
