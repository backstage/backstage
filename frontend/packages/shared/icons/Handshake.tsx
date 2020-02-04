import React from 'react';
import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';

const SvgHandshake = (props: SvgIconProps) =>
  React.createElement(
    SvgIcon,
    props,
    <path d="M14.002 4.002a2.071 2.071 0 00-.854.191l-4.824 2.23.58 1.114a2 2 0 002.46.957l2.63-.959 5.399 5.235c.389.377.607.894.607 1.435V15h2V5l-3 1-4.14-1.822a2.085 2.085 0 00-.858-.176zM2 5v10h1l6.076 5.316a2.734 2.734 0 003.733-.125l4.238-4.238a2.716 2.716 0 00.795-1.902l-4.34-4.207-1.455.529a3.978 3.978 0 01-1.37.242A3.985 3.985 0 017.13 8.46L6.55 7.346a2.007 2.007 0 01-.12-1.57c.103-.3.28-.56.5-.776H2z" />,
  );

export default SvgHandshake;
