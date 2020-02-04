import React from 'react';
import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';

const SvgMaterialFilled = (props: SvgIconProps) =>
  React.createElement(
    SvgIcon,
    props,
    <path d="M12 3.898c4.898 0 5.102 3.602 5.102 4.301 0 2-1.403 3-2.102 3.403.898.296 2.8 1.199 2.8 3.898 0 3.602-2.6 4.7-4.902 4.7-1.5 0-2.597-.5-3.097-.802v4H6.699V8.7c0-2 1.403-4.8 5.301-4.8zm-.102 6.704c1.903 0 2-1.5 2-2.204 0-1.898-1.597-2-2-2-1.296 0-2.097 1-2.097 2.301V17c.3.2 1.097.602 2.398.602 2.301 0 2.403-1.903 2.403-2.204 0-2.296-1.602-2.5-2.301-2.5h-1.102v-2.296z" />,
  );

export default SvgMaterialFilled;
