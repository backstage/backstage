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

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { UserSettingsSignInAvatar } from './UserSettingsSignInAvatar';
import { UserSettingsMenu } from './UserSettingsMenu';
import { useUserProfile } from '../useUserProfileInfo';
import { InfoCard } from '@backstage/core-components';

/** @public */
export const UserSettingsProfileCard = () => {
  const { profile, displayName } = useUserProfile();

  return (
    <InfoCard title="Profile" variant="gridItem">
      <Grid container spacing={6}>
        <Grid item>
          <UserSettingsSignInAvatar size={96} />
        </Grid>
        <Grid item xs={12} sm container>
          <Grid item xs container direction="column" spacing={2}>
            <Grid item xs>
              <Typography variant="subtitle1" gutterBottom>
                {displayName}
              </Typography>
              {profile.email && (
                <Typography variant="body2" color="textSecondary">
                  {profile.email}
                </Typography>
              )}
            </Grid>
          </Grid>
          <Grid item>
            <UserSettingsMenu />
          </Grid>
        </Grid>
      </Grid>
    </InfoCard>
  );
};
