import React from 'react';
import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';

const SvgPerson = (props: SvgIconProps) =>
  React.createElement(
    SvgIcon,
    props,
    <path d="M12 4C9.79 4 8 5.79 8 8s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm-2.969 9.406C5.254 14.551 4 17.656 4 17.656V20h16v-2.344s-1.254-3.105-5.031-4.25C14.762 14.863 13.512 16 12 16s-2.762-1.137-2.969-2.594z" />,
  );

export default SvgPerson;
