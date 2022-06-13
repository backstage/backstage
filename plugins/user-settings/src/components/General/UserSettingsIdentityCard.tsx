/*
 * Copyright 2022 The Backstage Authors
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
import { InfoCard } from '@backstage/core-components';
import React from 'react';
import { useUserProfile } from '../useUserProfileInfo';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

export const UserSettingsIdentityCard = () => {
  const { backstageIdentity } = useUserProfile();

  return (
    <InfoCard title="Backstage Identity">
      <Grid container spacing={6}>
        <Grid item xs={12} sm container>
          <Grid item xs container direction="column" spacing={2}>
            <Grid item xs>
              <Typography variant="subtitle1" gutterBottom>
                User Entity:{' '}
                <Chip
                  label={backstageIdentity?.userEntityRef}
                  variant="outlined"
                  size="small"
                />
              </Typography>
              <Typography variant="subtitle1">
                Ownership Entities:{' '}
                {backstageIdentity?.ownershipEntityRefs.map(it => (
                  <Chip label={it} variant="outlined" size="small" />
                ))}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </InfoCard>
  );
};
