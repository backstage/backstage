import React from 'react';
import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';

const SvgCircled3 = (props: SvgIconProps) =>
  React.createElement(
    SvgIcon,
    props,
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-.102 14.7C9.5 16.7 8.7 15 8.801 14h1.8c-.101.3.2 1.2 1.399 1.2 1.3 0 1.398-1.098 1.398-1.302 0-1.398-1.296-1.398-1.5-1.398h-1v-1.398h1c.5 0 1.403-.102 1.403-1.301 0-1.102-1-1.2-1.301-1.2-1 0-1.2.797-1.2 1H8.899c0-1.8 1.801-2.5 3-2.5C14.7 7.102 15 9 15 9.7c0 1.301-1.2 1.903-1.398 2 .5.2 1.5.7 1.5 2.2.097 2.203-1.801 2.8-3.204 2.8z" />,
  );

export default SvgCircled3;
