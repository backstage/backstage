import React from 'react';
import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';

const SvgRss = (props: SvgIconProps) =>
  React.createElement(
    SvgIcon,
    props,
    <path d="M5 3a2.007 2.007 0 00-1.959 1.598V4.6C3.015 4.73 3 4.863 3 5v14c0 .137.014.271.041.4v.002a2.007 2.007 0 001.557 1.557H4.6c.13.026.263.041.4.041h14a2.007 2.007 0 002-2V5a2.007 2.007 0 00-1.598-1.959H19.4A1.966 1.966 0 0019 3H5zm1 3h1c6.065 0 11 4.935 11 11v1h-2v-1c0-4.963-4.037-9-9-9H6V6zm0 4h1c3.859 0 7 3.141 7 7v1h-2v-1c0-2.757-2.243-5-5-5H6v-2zm1.5 5a1.5 1.5 0 11-.001 3.001A1.5 1.5 0 017.5 15z" />,
  );

export default SvgRss;
