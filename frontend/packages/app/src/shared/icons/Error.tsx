import React from 'react';
import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';

const SvgError = (props: SvgIconProps) =>
  React.createElement(
    SvgIcon,
    props,
    <path d="M22.239 18.451L13.442 3.816C13.135 3.305 12.596 3 12 3s-1.135.305-1.441.815L1.761 18.451A1.684 1.684 0 003.203 21h17.595a1.683 1.683 0 001.441-2.549zM13 18h-2v-2h2v2zm0-4h-2V9h2v5z" />,
  );

export default SvgError;
