import React from 'react';
import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';

const SvgNetworkCable = (props: SvgIconProps) =>
  React.createElement(
    SvgIcon,
    props,
    <path d="M14.555 2.168l-1.11 1.664L16.697 6H13v2H8c-2.75 0-5 2.25-5 5v1h.203c.48 2.258 2.402 4 4.797 4h4c.565 0 1 .435 1 1v3h2v-3c0-1.645-1.355-3-3-3H8c-1.668 0-3-1.332-3-3s1.332-3 3-3h5v2h8V6.465l-6.445-4.297z" />,
  );

export default SvgNetworkCable;
