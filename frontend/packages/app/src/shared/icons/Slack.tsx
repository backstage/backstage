import React from 'react';
import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';

const SvgSlack = (props: SvgIconProps) =>
  React.createElement(
    SvgIcon,
    props,
    <path d="M9 7H4a2 2 0 100 4h5a2 2 0 100-4zm2-3v2H9a2 2 0 112-2zM7 14v5a2 2 0 104 0v-5a2 2 0 10-4 0zm-3-2h2v2a2 2 0 11-2-2zm10 4h5a2 2 0 100-4h-5a2 2 0 100 4zm-2 3v-2h2a2 2 0 11-2 2zm4-10V4a2 2 0 10-4 0v5a2 2 0 104 0zm3 2h-2V9a2 2 0 112 2z" />,
  );

export default SvgSlack;
