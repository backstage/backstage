import React from 'react';
import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';

const SvgAvailableUpdates = (props: SvgIconProps) =>
  React.createElement(
    SvgIcon,
    props,
    <path d="M12 3c-4.963 0-9 4.038-9 9h2c0-3.86 3.141-7 7-7 2.185 0 4.125 1.017 5.408 2.592L15 10h6V4l-2.166 2.166A8.96 8.96 0 0012 3zm7 9c0 3.859-3.141 7-7 7-2.185 0-4.125-1.017-5.408-2.592L9 14H3v6l2.166-2.166A8.96 8.96 0 0012 21c4.963 0 9-4.037 9-9h-2z" />,
  );

export default SvgAvailableUpdates;
