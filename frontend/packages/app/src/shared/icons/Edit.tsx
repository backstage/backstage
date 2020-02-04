import React from 'react';
import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';

const SvgEdit = (props: SvgIconProps) =>
  React.createElement(
    SvgIcon,
    props,
    <path d="M18.414 2a.995.995 0 00-.707.293L16 4l4 4 1.707-1.707a.999.999 0 000-1.414l-2.586-2.586A.996.996 0 0018.414 2zM14.5 5.5L3 17v4h4L18.5 9.5l-4-4z" />,
  );

export default SvgEdit;
