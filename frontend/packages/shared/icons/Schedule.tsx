import React from 'react';
import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';

const SvgSchedule = (props: SvgIconProps) =>
  React.createElement(
    SvgIcon,
    props,
    <path d="M6 0C2.7 0 0 2.7 0 6s2.7 6 6 6 6-2.7 6-6-2.7-6-6-6zm0 2c2.2 0 4 1.8 4 4s-1.8 4-4 4-4-1.8-4-4 1.8-4 4-4zm10 0v2h-2.262c.165.64.262 1.308.262 2a7.96 7.96 0 01-.588 3H19l.002 11H5v-6.068a7.911 7.911 0 01-2-.52V20c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2h-1V2h-2zM6.9 3.2L5.2 6.1l2.2 2.2.9-1-1.5-1.4L8 3.8l-1.1-.6z" />,
  );

export default SvgSchedule;
