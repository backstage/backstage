import React from 'react';
import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';

const SvgAttendance = (props: SvgIconProps) =>
  React.createElement(
    SvgIcon,
    props,
    <path d="M14.707 3.293l-1.414 1.414L15.586 7l-2.293 2.293 1.414 1.414L17 8.414l2.293 2.293 1.414-1.414L18.414 7l2.293-2.293-1.414-1.414L17 5.586l-2.293-2.293zM4 6v2h6V6H4zm16.293 8.293L17 17.586l-2.293-2.293-1.414 1.414L17 20.414l4.707-4.707-1.414-1.414zM4 17v2h6v-2H4z" />,
  );

export default SvgAttendance;
