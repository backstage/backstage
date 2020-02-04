import React from 'react';
import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';

const SvgItinerary = (props: SvgIconProps) =>
  React.createElement(
    SvgIcon,
    props,
    <path
      d="M4.5 2C2.57 2 1 3.57 1 5.5c0 1.701 2.21 5.32 2.652 6.03l.848 1.357.848-1.358C5.79 10.82 8 7.201 8 5.5 8 3.57 6.43 2 4.5 2zm15 10c-1.93 0-3.5 1.57-3.5 3.5 0 1.701 2.21 5.32 2.652 6.03l.848 1.357.848-1.358C20.79 20.82 23 17.201 23 15.5c0-1.93-1.57-3.5-3.5-3.5zM4 15v2h2v-2H4zm4 0v2h2v-2H8zm4 0v2h2v-2h-2z"
      fontWeight={400}
      fontFamily="sans-serif"
      overflow="visible"
    />,
  );

export default SvgItinerary;
