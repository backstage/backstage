import React from 'react';
import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';

const SvgBigquery = (props: SvgIconProps) =>
  React.createElement(
    SvgIcon,
    props,
    <g fill="none" fillRule="evenodd">
      <path d="M-5-5h30v30H-5z" />
      <g fill="#000" fillRule="nonzero">
        <path d="M9.405 0l.271.004c5.072.143 9.139 4.281 9.138 9.365a9.3 9.3 0 01-1.787 5.495l.029.024 3.696 3.68a.44.44 0 010 .622l-1.485 1.478a.443.443 0 01-.624 0l-3.695-3.683a.446.446 0 01-.026-.028 9.375 9.375 0 01-5.515 1.78C4.212 18.737 0 14.543 0 9.37 0 4.194 4.212 0 9.407 0h-.002zm4.928 4.46a6.992 6.992 0 00-7.596-1.505 6.941 6.941 0 00-4.303 6.414c0 3.833 3.12 6.94 6.97 6.94a6.969 6.969 0 006.44-4.284 6.92 6.92 0 00-1.51-7.566z" />
        <path d="M10.4 6.663v7.84c-.337.046-.68.077-1.034.077-.386 0-.762-.035-1.13-.09V6.664H10.4zM6.718 9.178v4.548a5.173 5.173 0 01-1.776-1.808v-2.74h1.776zm7.21 1.077v1.522a5.173 5.173 0 01-1.777 1.898v-3.42h1.778z" />
      </g>
    </g>,
  );

export default SvgBigquery;
