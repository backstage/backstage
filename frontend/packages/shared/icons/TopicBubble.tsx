import React from 'react';
import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';

const SvgTopicBubble = (props: SvgIconProps) =>
  React.createElement(
    SvgIcon,
    props,
    <path d="M18 22.091c-1.922 0-4.612-.981-6.268-2.816l-2.686 1.428-1.673-2.801-3.414-.63.942-3.498-2.859-2.295 2.854-2.291-.94-3.366 3.406-.71 1.721-2.935L12 4.062l2.917-1.885 1.721 2.935 3.406.71-.941 3.366 2.854 2.291-2.859 2.295.942 3.498-3.001.554C17 21 19 22 19 22l-1 .091z" />,
  );

export default SvgTopicBubble;
