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
import { Grid, makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import { UserSettingsSignInAvatar } from './UserSettingsSignInAvatar';
import { UserSettingsMenu } from './UserSettingsMenu';
import { useUserProfile } from '../useUserProfileInfo';
import { InfoCard } from '@backstage/core-components';

const useStyles = makeStyles(() => ({
  title: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
}));

type Props = {
  userProfileCard?: JSX.Element;
};

export const UserSettingsProfileCard = ({ userProfileCard }: Props) => {
  const styles = useStyles();
  return (
    <InfoCard
      headerStyle={{ paddingTop: 8, paddingBottom: 8 }}
      title={
        <div className={styles.title}>
          Profile
          <UserSettingsMenu />
        </div>
      }
      variant="gridItem"
    >
      {userProfileCard ?? <UserDefaultCard />}
    </InfoCard>
  );
};

function UserDefaultCard() {
  const { profile, displayName } = useUserProfile();
  return (
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
            <Typography variant="body2" color="textSecondary">
              {profile.email}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
