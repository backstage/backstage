/*
 * Copyright 2021 The Backstage Authors
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

import { SvgIcon, SvgIconProps } from '@material-ui/core';

import React from 'react';

export const AzurePullRequestsIcon = (props: SvgIconProps) => (
  <SvgIcon {...props} viewBox="0 0 512 512">
    <path
      d="M160 95.1c0-44.18-35.82-80-80-80c-44.18 0-80 35.82-80 80C0 128.8 19.77 156.9 48 169.2V342.8C19.77 355.1 0 383.2 0 415.1c0 44.18 35.82 80 80 80c44.18 0 80-35.82 80-80c0-32.79-19.77-60.89-48-73.25V169.2C140.2 156.9 160 128.8 160 95.1zM80 439.1c-13.23 0-24-10.77-24-24s10.77-24 24-24c13.23 0 24 10.77 24 24S93.23 439.1 80 439.1zM80 119.1c-13.23 0-24-10.77-24-24s10.77-24 24-24c13.23 0 24 10.77 24 24S93.23 119.1 80 119.1zM464 342.8v-182.8c0-52.94-43.06-96-96-96H320v-48c0-6.219-3.594-11.84-9.219-14.5c-5.594-2.594-12.25-1.781-17.03 2.219l-96 80C194.1 86.75 192 91.25 192 95.1S194.1 105.2 197.8 108.3l96 80C296.7 190.7 300.3 191.1 304 191.1c2.312 0 4.625-.5 6.781-1.5C316.4 187.8 320 182.2 320 175.1v-48h48c17.66 0 32 14.34 32 32v182.8c-28.23 12.36-48 40.46-48 73.25c0 44.18 35.82 80 80 80c44.18 0 80-35.82 80-80C512 383.2 492.2 355.1 464 342.8zM432 439.1c-13.23 0-24-10.77-24-24s10.77-24 24-24c13.23 0 24 10.77 24 24S445.2 439.1 432 439.1z"
      fill="currentColor"
    />
  </SvgIcon>
);
