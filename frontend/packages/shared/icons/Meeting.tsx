import React from 'react';
import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';

const SvgMeeting = (props: SvgIconProps) =>
  React.createElement(
    SvgIcon,
    props,
    <path d="M6 2a2 2 0 00-2 2 2 2 0 002 2 2 2 0 002-2 2 2 0 00-2-2zm12 0a2 2 0 00-2 2 2 2 0 002 2 2 2 0 002-2 2 2 0 00-2-2zM5 8a2 2 0 00-2 2v12h2v-6h2v6h2v-9.83l3 3.002 3-3.002V22h2v-6h2v6h2V10a2 2 0 00-2-2h-2c-.556 0-1.058.228-1.42.594l-.002-.002L12 12.172 8.414 8.586l-.025-.027-.004.004A1.99 1.99 0 007 8H5z" />,
  );

export default SvgMeeting;
