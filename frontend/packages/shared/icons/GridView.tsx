import React from 'react';
import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';

const SvgGridView = (props: SvgIconProps) =>
  React.createElement(
    SvgIcon,
    props,
    <path d="M1 4v4h6V4H1zm8 0v4h6V4H9zm8 0v4h6V4h-6zM1 10v4h6v-4H1zm8 0v4h6v-4H9zm8 0v4h6v-4h-6zM1 16v4h6v-4H1zm8 0v4h6v-4H9zm8 0v4h6v-4h-6z" />,
  );

export default SvgGridView;
