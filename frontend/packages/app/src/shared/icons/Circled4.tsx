import React from 'react';
import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';

const SvgCircled4 = (props: SvgIconProps) =>
  React.createElement(
    SvgIcon,
    props,
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm.188 5.313H14v5.78h1v1.5h-1v2h-1.813v-2h-3.78l-.095-1.187zm-.094 2.593l-2 3.188h2z" />,
  );

export default SvgCircled4;
