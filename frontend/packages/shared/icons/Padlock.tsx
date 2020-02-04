import React from 'react';
import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';

const SvgPadlock = (props: SvgIconProps) =>
  React.createElement(
    SvgIcon,
    props,
    <path d="M12 1C9.128 1 6.719 3.046 6.123 5.787l1.955.426C8.482 4.353 10.072 3 12 3c2.276 0 4 1.724 4 4v1H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2V7c0-3.324-2.676-6-6-6zm0 12c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z" />,
  );

export default SvgPadlock;
