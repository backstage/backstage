/*
 * Copyright 2020 The Backstage Authors
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

import { IconComponent } from '@backstage/core-plugin-api';
import MuiApartmentIcon from '@material-ui/icons/Apartment';
import MuiBrokenImageIcon from '@material-ui/icons/BrokenImage';
import MuiCategoryIcon from '@material-ui/icons/Category';
import MuiChatIcon from '@material-ui/icons/Chat';
import MuiDashboardIcon from '@material-ui/icons/Dashboard';
import MuiDocsIcon from '@material-ui/icons/Description';
import MuiEmailIcon from '@material-ui/icons/Email';
import MuiExtensionIcon from '@material-ui/icons/Extension';
import MuiGitHubIcon from '@material-ui/icons/GitHub';
import MuiHelpIcon from '@material-ui/icons/Help';
import MuiLocationOnIcon from '@material-ui/icons/LocationOn';
import MuiMemoryIcon from '@material-ui/icons/Memory';
import MuiMenuBookIcon from '@material-ui/icons/MenuBook';
import MuiPeopleIcon from '@material-ui/icons/People';
import MuiPersonIcon from '@material-ui/icons/Person';
import MuiWarningIcon from '@material-ui/icons/Warning';

type AppIconsKey =
  | 'api'
  | 'brokenImage'
  | 'catalog'
  | 'chat'
  | 'component'
  | 'dashboard'
  | 'docs'
  | 'domain'
  | 'email'
  | 'github'
  | 'group'
  | 'help'
  | 'location'
  | 'user'
  | 'system'
  | 'warning';

export type AppIcons = { [key in AppIconsKey]: IconComponent };

export const defaultAppIcons: AppIcons = {
  api: MuiExtensionIcon,
  brokenImage: MuiBrokenImageIcon,
  // To be confirmed: see https://github.com/backstage/backstage/issues/4970
  catalog: MuiMenuBookIcon,
  chat: MuiChatIcon,
  component: MuiMemoryIcon,
  dashboard: MuiDashboardIcon,
  docs: MuiDocsIcon,
  domain: MuiApartmentIcon,
  email: MuiEmailIcon,
  github: MuiGitHubIcon,
  group: MuiPeopleIcon,
  help: MuiHelpIcon,
  location: MuiLocationOnIcon,
  user: MuiPersonIcon,
  system: MuiCategoryIcon,
  warning: MuiWarningIcon,
};
