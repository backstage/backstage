/*
 * Copyright 2020 Spotify AB
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react';
import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';

export const PagerDutyIcon = (props: SvgIconProps) =>
  React.createElement(
    SvgIcon,
    props,
    <g fillRule="nonzero">
      <path d="M10.442 84.98H0V32.57c0-5.381 2.209-8.634 4.056-10.442 4.097-4.016 9.639-4.136 10.562-4.136h16.426c5.863 0 9.237 2.37 11.084 4.377 3.655 3.976 3.695 9.117 3.615 10.482v19.76c0 5.702-2.33 9.075-4.257 10.883-3.976 3.734-9.237 3.815-10.482 3.775H10.442v17.71zm20.963-28.193c.563 0 2.129-.16 2.972-.964.643-.602.964-1.687.964-3.253V32.289c0-.562-.12-2.048-.924-2.892-.763-.803-2.249-.963-3.373-.963H14.538c-4.096 0-4.096 3.092-4.096 4.136v24.217h20.963zM89.236.2h10.442v52.45c0 5.382-2.209 8.635-4.056 10.442-4.097 4.016-9.639 4.136-10.562 4.136H68.634c-5.863 0-9.237-2.369-11.084-4.377-3.655-3.976-3.695-9.116-3.615-10.482V32.65c0-5.702 2.33-9.076 4.257-10.883 3.976-3.735 9.237-3.815 10.482-3.775h20.562V.2zM68.273 28.435c-.563 0-2.129.16-2.972.963-.643.603-.964 1.687-.964 3.253v20.281c0 .563.12 2.049.924 2.892.763.803 2.249.964 3.373.964H85.14c4.137-.04 4.137-3.133 4.137-4.177V28.434H68.273z" />
    </g>,
  );
