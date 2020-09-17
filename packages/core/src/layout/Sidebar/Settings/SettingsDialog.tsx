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

import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  makeStyles,
  Divider,
} from '@material-ui/core';
import { AppSettingsList } from './AppSettingsList';
import { AuthProvidersList } from './AuthProviderList';
import { FeatureFlagsList } from './FeatureFlagsList';
import { SignInAvatar } from './SignInAvatar';
import { UserSettingsMenu } from './UserSettingsMenu';
import { useUserProfile } from './useUserProfileInfo';
import { useApi, featureFlagsApiRef } from '@backstage/core-api';

const useStyles = makeStyles({
  root: {
    minWidth: 400,
  },
});

type Props = {
  providerSettings?: React.ReactNode;
};

export const SettingsDialog = ({ providerSettings }: Props) => {
  const classes = useStyles();
  const { profile, displayName } = useUserProfile();
  const featureFlagsApi = useApi(featureFlagsApiRef);
  const featureFlags = featureFlagsApi.getRegisteredFlags();

  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={<SignInAvatar size={48} />}
        action={<UserSettingsMenu />}
        title={displayName}
        subheader={profile.email}
      />
      <CardContent>
        <AppSettingsList />
        {providerSettings && (
          <>
            <Divider />
            <AuthProvidersList providerSettings={providerSettings} />
          </>
        )}
        {featureFlags.length > 0 && (
          <>
            <Divider />
            <FeatureFlagsList featureFlags={featureFlags} />
          </>
        )}
      </CardContent>
    </Card>
  );
};
