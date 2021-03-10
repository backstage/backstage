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

import {
  BrokenImageIcon,
  ChatIcon,
  DashboardIcon,
  EmailIcon,
  GitHubIcon,
  GroupIcon,
  HelpIcon,
  UserIcon,
  WarningIcon,
} from '@backstage/components';
import { IconComponent } from '@backstage/plugin-api';

type AppIconsKey =
  | 'brokenImage'
  | 'chat'
  | 'dashboard'
  | 'email'
  | 'github'
  | 'group'
  | 'help'
  | 'user'
  | 'warning';

export type AppIcons = { [key in AppIconsKey]: IconComponent };

export const defaultAppIcons: AppIcons = {
  brokenImage: BrokenImageIcon,
  chat: ChatIcon,
  dashboard: DashboardIcon,
  email: EmailIcon,
  github: GitHubIcon,
  group: GroupIcon,
  help: HelpIcon,
  user: UserIcon,
  warning: WarningIcon,
};
