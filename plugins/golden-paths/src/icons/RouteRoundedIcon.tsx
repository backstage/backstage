/*
 * Copyright 2026 The Backstage Authors
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

const RouteRoundedIcon = (props: SvgIconProps) => {
  return (
    <SvgIcon viewBox="0 0 20 20" {...props}>
      <path d="M15.8333 12.65V5.83333C15.8333 3.99167 14.3417 2.5 12.5 2.5C10.6583 2.5 9.16667 3.99167 9.16667 5.83333V14.1667C9.16667 15.0833 8.41667 15.8333 7.5 15.8333C6.58333 15.8333 5.83333 15.0833 5.83333 14.1667V7.35C6.8 7 7.5 6.08333 7.5 5C7.5 3.61667 6.38333 2.5 5 2.5C3.61667 2.5 2.5 3.61667 2.5 5C2.5 6.08333 3.2 7 4.16667 7.35V14.1667C4.16667 16.0083 5.65833 17.5 7.5 17.5C9.34167 17.5 10.8333 16.0083 10.8333 14.1667V5.83333C10.8333 4.91667 11.5833 4.16667 12.5 4.16667C13.4167 4.16667 14.1667 4.91667 14.1667 5.83333V12.65C13.2 12.9917 12.5 13.9083 12.5 15C12.5 16.3833 13.6167 17.5 15 17.5C16.3833 17.5 17.5 16.3833 17.5 15C17.5 13.9167 16.8 13 15.8333 12.65Z" />
    </SvgIcon>
  );
};

export default RouteRoundedIcon;
