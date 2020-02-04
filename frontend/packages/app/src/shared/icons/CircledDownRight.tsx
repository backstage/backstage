import React from 'react';
import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';

const SvgCircledDownRight = (props: SvgIconProps) =>
  React.createElement(
    SvgIcon,
    props,
    <path d="M4.929 19.071c3.905 3.905 10.237 3.905 14.142 0s3.905-10.237 0-14.142-10.237-3.905-14.142 0-3.905 10.237 0 14.142zM9.414 8L14 12.586V9h2v7H9v-2h3.586L8 9.414 9.414 8z" />,
  );

export default SvgCircledDownRight;
