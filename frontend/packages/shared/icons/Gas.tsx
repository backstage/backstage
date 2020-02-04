import React from 'react';
import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';

const SvgGas = (props: SvgIconProps) =>
  React.createElement(
    SvgIcon,
    props,
    <path d="M20 14.938c-.022-2.674-1.44-5.288-2.478-7.2-.23-.425-.446-.821-.627-1.185l-.686-1.371-.979 1.18a3.84 3.84 0 00-.411.631c-1.231-2.416-1.862-4.285-1.87-4.309l-.513-1.534-1.143 1.143C10.995 2.591 4 9.647 4 15c0 4.411 3.589 8 8 8s8-3.589 8-8v-.049l.006-.008-.006-.005zM9 18c0-3 3-6 3-6 .574 3.059 3.129 3.954 3 6-.104 1.654-1.343 3-3 3s-3-1.343-3-3z" />,
  );

export default SvgGas;
