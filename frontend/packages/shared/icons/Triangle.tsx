import React from 'react';
import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';

const SvgTriangle = (props: SvgIconProps) =>
  React.createElement(
    SvgIcon,
    props,
    <path
      d="M21.777 21.017a1.933 1.933 0 01-1.703.983H1.926a1.933 1.933 0 01-1.703-.983 1.761 1.761 0 01.058-1.815L9.355 4.887A1.926 1.926 0 0111 4a1.93 1.93 0 011.646.886l9.074 14.315c.353.559.375 1.238.057 1.816z"
      fill="#000"
      fillRule="nonzero"
    />,
  );

export default SvgTriangle;
