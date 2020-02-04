import React from 'react';
import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';

const SvgProcess = (props: SvgIconProps) =>
  React.createElement(
    SvgIcon,
    props,
    <path d="M11 0v2.057A10 10 0 002.838 8h2.24A8 8 0 0111 4.068V6l1.936-1.936c.02.003.043.002.064.004V4l1-1-3-3zm5 2.838v2.24A8 8 0 0119.932 11H18l1.936 1.936c-.003.02-.002.043-.004.064H20l1 1 3-3h-2.057A10 10 0 0016 2.838zM3 10l-3 3h2.057A10 10 0 008 21.162v-2.24A8 8 0 014.068 13H6l-1.936-1.936c.003-.02.002-.043.004-.064H4l-1-1zm15.922 6A8 8 0 0113 19.932V18l-1.936 1.936c-.02-.003-.043-.002-.064-.004V20l-1 1 3 3v-2.057A10 10 0 0021.162 16h-2.24z" />,
  );

export default SvgProcess;
