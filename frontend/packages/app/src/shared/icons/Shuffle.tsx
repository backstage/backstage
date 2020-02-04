import React from 'react';
import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';

const SvgShuffle = (props: SvgIconProps) =>
  React.createElement(
    SvgIcon,
    props,
    <path d="M18 2v3h-3.426c-.71 0-1.369.379-1.726.992L10.5 10.016 8.152 5.992A2.001 2.001 0 006.426 5H2v2h4.426l2.916 5-2.916 5H2v2h4.426c.71 0 1.37-.379 1.728-.992l2.346-4.024 2.348 4.026c.358.61 1.016.99 1.726.99H18v3l4-4-4-4v3h-3.426l-.002-.002-2.914-4.996L14.574 7H18v3l4-4-4-4z" />,
  );

export default SvgShuffle;
