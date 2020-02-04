import React from 'react';
import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';

const SvgImportantMail = (props: SvgIconProps) =>
  React.createElement(
    SvgIcon,
    props,
    <path d="M4 4a2 2 0 00-1.93 1.504L12 11.727l9.936-6.206A2 2 0 0020 4H4zM2 7.734V18c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V7.756L12 14 2 7.734z" />,
  );

export default SvgImportantMail;
