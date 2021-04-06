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

import { SvgIconProps } from '@material-ui/core';
import MuiMenuBookIcon from '@material-ui/icons/MenuBook';
import MuiBrokenImageIcon from '@material-ui/icons/BrokenImage';
import MuiChatIcon from '@material-ui/icons/Chat';
import MuiDashboardIcon from '@material-ui/icons/Dashboard';
import MuiEmailIcon from '@material-ui/icons/Email';
import MuiGitHubIcon from '@material-ui/icons/GitHub';
import MuiHelpIcon from '@material-ui/icons/Help';
import MuiPeopleIcon from '@material-ui/icons/People';
import MuiPersonIcon from '@material-ui/icons/Person';
import MuiWarningIcon from '@material-ui/icons/Warning';
import MuiDocsIcon from '@material-ui/icons/Description';

import React from 'react';
import { useApp } from '../app/AppContext';
import { IconComponent, IconComponentMap, SystemIconKey } from './types';

export const defaultSystemIcons: IconComponentMap = {
  brokenImage: MuiBrokenImageIcon,
  // To be confirmed: see https://github.com/backstage/backstage/issues/4970
  catalog: MuiMenuBookIcon,
  chat: MuiChatIcon,
  dashboard: MuiDashboardIcon,
  email: MuiEmailIcon,
  github: MuiGitHubIcon,
  group: MuiPeopleIcon,
  help: MuiHelpIcon,
  user: MuiPersonIcon,
  warning: MuiWarningIcon,
  docs: MuiDocsIcon,
};

const overridableSystemIcon = (key: SystemIconKey): IconComponent => {
  const Component = (props: SvgIconProps) => {
    const app = useApp();
    const Icon = app.getSystemIcon(key);
    return Icon ? <Icon {...props} /> : <MuiBrokenImageIcon {...props} />;
  };
  return Component;
};

export const BrokenImageIcon = overridableSystemIcon('brokenImage');
export const ChatIcon = overridableSystemIcon('chat');
export const DashboardIcon = overridableSystemIcon('dashboard');
export const EmailIcon = overridableSystemIcon('email');
export const GitHubIcon = overridableSystemIcon('github');
export const GroupIcon = overridableSystemIcon('group');
export const HelpIcon = overridableSystemIcon('help');
export const UserIcon = overridableSystemIcon('user');
export const WarningIcon = overridableSystemIcon('warning');
export const DocsIcon = overridableSystemIcon('docs');
