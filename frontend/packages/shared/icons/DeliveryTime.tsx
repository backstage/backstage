import React from 'react';
import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';

const SvgDeliveryTime = (props: SvgIconProps) =>
  React.createElement(
    SvgIcon,
    props,
    <path d="M12 2C6.489 2 2 6.489 2 12s4.489 10 10 10a9.967 9.967 0 006-2l2 2v-5h-5l1.563 1.563A7.942 7.942 0 0112 20c-4.43 0-8-3.57-8-8s3.57-8 8-8 8 3.57 8 8h2c0-5.511-4.489-10-10-10zm-1 4v7h5v-2h-3V6h-2z" />,
  );

export default SvgDeliveryTime;
