import React from 'react';
import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';

const SvgCircledUpRight = (props: SvgIconProps) =>
  React.createElement(
    SvgIcon,
    props,
    <path d="M19.071 4.929c-3.905-3.905-10.237-3.905-14.142 0-3.905 3.905-3.905 10.237 0 14.142 3.905 3.905 10.237 3.905 14.142 0 3.905-3.905 3.905-10.237 0-14.142zM16 15h-2v-3.586L9.414 16 8 14.586 12.586 10H9V8h7v7z" />,
  );

export default SvgCircledUpRight;
