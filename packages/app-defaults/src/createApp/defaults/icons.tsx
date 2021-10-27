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

export const icons = () => ({
  brokenImage: MuiBrokenImageIcon as IconComponent,
  // To be confirmed: see https://github.com/backstage/backstage/issues/4970
  catalog: MuiMenuBookIcon as IconComponent,
  chat: MuiChatIcon as IconComponent,
  dashboard: MuiDashboardIcon as IconComponent,
  docs: MuiDocsIcon as IconComponent,
  email: MuiEmailIcon as IconComponent,
  github: MuiGitHubIcon as IconComponent,
  group: MuiPeopleIcon as IconComponent,
  help: MuiHelpIcon as IconComponent,
  'kind:api': MuiExtensionIcon as IconComponent,
  'kind:component': MuiMemoryIcon as IconComponent,
  'kind:domain': MuiApartmentIcon as IconComponent,
  'kind:group': MuiPeopleIcon as IconComponent,
  'kind:location': MuiLocationOnIcon as IconComponent,
  'kind:system': MuiCategoryIcon as IconComponent,
  'kind:user': MuiPersonIcon as IconComponent,
  user: MuiPersonIcon as IconComponent,
  warning: MuiWarningIcon as IconComponent,
});
