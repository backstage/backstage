import React from 'react';
import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';

const SvgPullRequest = (props: SvgIconProps) =>
  React.createElement(
    SvgIcon,
    props,
    <path d="M6 2C4.346 2 3 3.346 3 5c0 1.302.839 2.402 2 2.816v8.368A2.997 2.997 0 003 19c0 1.654 1.346 3 3 3s3-1.346 3-3a2.997 2.997 0 00-2-2.816V7.816A2.997 2.997 0 009 5c0-1.654-1.346-3-3-3zm7 0l-3 3 3 3V6h1c1.668 0 3 1.332 3 3v7.184A2.997 2.997 0 0015 19c0 1.654 1.346 3 3 3s3-1.346 3-3a2.997 2.997 0 00-2-2.816V9c0-2.75-2.25-5-5-5h-1V2z" />,
  );

export default SvgPullRequest;
