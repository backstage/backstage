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
import PeopleIcon from '@material-ui/icons/People';
import PersonIcon from '@material-ui/icons/Person';
import React from 'react';
import { useApp } from '../app/AppContext';
import { IconComponent, SystemIconKey, SystemIcons } from './types';

export const defaultSystemIcons: SystemIcons = {
  user: PersonIcon,
  group: PeopleIcon,
};

const overridableSystemIcon = (key: SystemIconKey): IconComponent => {
  const Component = (props: SvgIconProps) => {
    const app = useApp();
    const Icon = app.getSystemIcon(key);
    return <Icon {...props} />;
  };
  return Component;
};

export const UserIcon = overridableSystemIcon('user');
export const GroupIcon = overridableSystemIcon('group');
