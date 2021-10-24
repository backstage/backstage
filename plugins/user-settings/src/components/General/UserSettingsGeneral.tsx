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
import { Grid } from '@material-ui/core';
import React from 'react';
import { UserSettingsContext } from '../../components/UserSettingsContext';
import { UserSettingsProfileCard } from './UserSettingsProfileCard';
import { UserSettingsAppearanceCard } from './UserSettingsAppearanceCard';

export const UserSettingsGeneral = () => {
  const { profileCard, appearanceCard } = React.useContext(UserSettingsContext);

  if (!profileCard && !appearanceCard) return null;

  return (
    <Grid
      container
      direction="row"
      spacing={3}
      data-testid="user-settings-general"
    >
      {profileCard && (
        <Grid
          item
          sm={12}
          md={6}
          data-testid="user-settings-general-profile-container"
        >
          <UserSettingsProfileCard />
        </Grid>
      )}
      {appearanceCard && (
        <Grid
          item
          sm={12}
          md={6}
          data-testid="user-settings-general-appearance-container"
        >
          <UserSettingsAppearanceCard />
        </Grid>
      )}
    </Grid>
  );
};
