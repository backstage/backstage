import React from 'react';
import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';

const SvgRemoteControl = (props: SvgIconProps) =>
  React.createElement(
    SvgIcon,
    props,
    <path d="M16 2v2c2.276 0 4 1.724 4 4h2c0-3.324-2.676-6-6-6zm0 3v2c.555 0 1 .445 1 1h2c0-1.645-1.355-3-3-3zm-4.15 1c-.525 0-1.05.2-1.45.6l-7.8 7.8c-.8.8-.8 2.1 0 2.9l4.1 4.1c.8.8 2.1.8 2.9 0l7.8-7.8c.8-.7.8-2.1 0-2.9l-4.1-4.1c-.4-.4-.925-.6-1.45-.6zM12 9c1.7 0 3 1.3 3 3s-1.3 3-3 3-3-1.3-3-3 1.3-3 3-3zm0 2a1 1 0 00-1 1 1 1 0 001 1 1 1 0 001-1 1 1 0 00-1-1zm-6 3c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1zm3 3c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1z" />,
  );

export default SvgRemoteControl;
