import React from 'react';
import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';

const SvgMaterialSharp = (props: SvgIconProps) =>
  React.createElement(
    SvgIcon,
    props,
    <path d="M17 0l-7 12h14L17 0zM1.875 2v3H0v2h1.875v2H0v2h1.875v2H0v2h1.875v2H0v2h1.875v3h10.824a6.924 6.924 0 01-.681-2.99c0-1.874.726-3.63 2.043-4.948.022-.021.048-.04.07-.062H8l-.023-2.5 5.54-9.5H1.876zM16 4h2v4h-2V4zm0 5h2v2h-2V9zm3.008 5.02a4.976 4.976 0 00-4.99 4.99c0 2.76 2.232 4.99 4.992 4.99S24 21.77 24 19.01a4.99 4.99 0 00-4.992-4.99zm-1.406 2.16l1.414 1.414 1.414-1.414 1.414 1.414-1.414 1.414 1.414 1.414-1.414 1.414-1.414-1.414-1.414 1.414-1.414-1.414 1.414-1.414-1.415-1.414 1.415-1.414z" />,
  );

export default SvgMaterialSharp;
