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
import React from 'react';
import { List } from '@material-ui/core';
import { InfoCard } from '@backstage/core-components';
import { UserSettingsPinToggle } from './UserSettingsPinToggle';
import { UserSettingsThemeToggle } from './UserSettingsThemeToggle';

export const UserSettingsAppearanceCard = () => (
  <InfoCard title="Appearance" variant="gridItem">
    <List dense>
      <UserSettingsThemeToggle />
      {/* <UserSettingsPinToggle /> */}
    </List>
  </InfoCard>
);
