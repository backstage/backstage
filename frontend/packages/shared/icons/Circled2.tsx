import React from 'react';
import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';

const SvgCircled2 = (props: SvgIconProps) =>
  React.createElement(
    SvgIcon,
    props,
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm3.3 14.602H8.899V15.3c2.704-3 4.204-4.102 4.204-5.301 0-.398-.204-1.3-1.204-1.3-1.296 0-1.296 1.3-1.296 1.6H8.699c0-.902.7-3 3.2-3s3 1.5 3 2.598c0 1.5-1.098 2.704-3.7 5.301h4v1.403z" />,
  );

export default SvgCircled2;
