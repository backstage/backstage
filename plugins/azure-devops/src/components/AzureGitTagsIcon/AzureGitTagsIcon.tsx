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

import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';

import React from 'react';

// From https://github.com/microsoft/fluentui-system-icons/blob/30a3e3c458883a1d63a43a951407f30e6b32b60c/assets/Tag/SVG/ic_fluent_tag_32_regular.svg
export const AzureGitTagsIcon = (props: SvgIconProps) => (
  <SvgIcon {...props} viewBox="0 0 32 32">
    <path d="M22.5 12C23.8807 12 25 10.8807 25 9.5C25 8.11929 23.8807 7 22.5 7C21.1193 7 20 8.11929 20 9.5C20 10.8807 21.1193 12 22.5 12ZM18.6842 3C17.6695 3 16.6927 3.38568 15.9516 4.07892L3.77041 15.4742C2.01578 17.1157 1.96966 19.8841 3.66863 21.5831L9.99455 27.909C11.6543 29.5687 14.3452 29.5687 16.005 27.909L27.8282 16.0858C28.5783 15.3356 28.9998 14.3182 28.9998 13.2574V6.5C28.9998 4.567 27.4328 3 25.4998 3H18.6842ZM17.3179 5.53946C17.6884 5.19284 18.1769 5 18.6842 5H25.4998C26.3282 5 26.9998 5.67157 26.9998 6.5V13.2574C26.9998 13.7878 26.789 14.2965 26.414 14.6716L14.5907 26.4948C13.7121 27.3735 12.2874 27.3735 11.4088 26.4948L5.08284 20.1689C4.18339 19.2694 4.20781 17.8038 5.13673 16.9348L17.3179 5.53946Z" />
  </SvgIcon>
);
