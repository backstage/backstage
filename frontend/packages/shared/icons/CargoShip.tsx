import React from 'react';
import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';

const SvgCargoShip = (props: SvgIconProps) =>
  React.createElement(
    SvgIcon,
    props,
    <path d="M6 1v3H4a1 1 0 00-1 1v6H2c-.55 0-1 .45-1 1v7c0 .55.45 1 1 1h11.93c4.53 0 8.42-3.38 9.06-7.86.01-.05.01-.09.01-.14V9c0-.55-.45-1-1-1h-7c-.33 0-.65.17-.83.45L12.46 11H11V7.236l.895-1.789A1 1 0 0011 4H8V1H6zM5 6h4.383l-.278.553A1 1 0 009 7v4H5V6zm12 5h2v2h-2v-2z" />,
  );

export default SvgCargoShip;
