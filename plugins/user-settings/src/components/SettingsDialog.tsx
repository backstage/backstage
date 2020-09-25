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

import React, { ChangeEvent, RefObject, useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  makeStyles,
  PopoverActions,
} from '@material-ui/core';
import { AppSettingsList } from './AppSettingsList';
import { AuthProvidersList } from './AuthProviderList';
import { FeatureFlagsList } from './FeatureFlagsList';
import { SignInAvatar } from './SignInAvatar';
import { UserSettingsMenu } from './UserSettingsMenu';
import { useUserProfile } from './useUserProfileInfo';
import {
  useApi,
  featureFlagsApiRef,
  TabbedCard,
  CardTab,
  InfoCard,
} from '@backstage/core';
import { ConfiguredProviderSettings } from './ConfiguredProviderSettings';
import { ProviderSettings } from './UserSettings';
import { Alert } from '@material-ui/lab';

const useStyles = makeStyles({
  root: {
    minWidth: 400,
    maxWidth: 500,
  },
});

type Props = {
  popoverActionRef: RefObject<PopoverActions | null>;
  providerSettings?: ProviderSettings;
};

export const SettingsDialog = ({
  popoverActionRef,
  providerSettings,
}: Props) => {
  const classes = useStyles();
  const { profile, displayName } = useUserProfile();
  const featureFlagsApi = useApi(featureFlagsApiRef);
  const featureFlags = featureFlagsApi.getRegisteredFlags();
  const [selectedTab, setSelectedTab] = useState<string | number>('auth');

  const providers = providerSettings ?? <ConfiguredProviderSettings />;

  const handleChange = (
    _ev: ChangeEvent<{}>,
    newSelectedTab: string | number,
  ) => {
    setSelectedTab(newSelectedTab);
  };

  // Update the position of the popover to handle different heights
  useEffect(() => {
    popoverActionRef?.current?.updatePosition();
  }, [selectedTab, popoverActionRef]);

  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={<SignInAvatar size={48} />}
        action={<UserSettingsMenu />}
        title={displayName}
        subheader={profile.email}
      />
      <CardContent>
        <InfoCard
          title="App Settings"
          subheader="General settings related to how the app feels and looks"
          variant="flat"
          noPadding
        >
          <AppSettingsList />
        </InfoCard>
        <TabbedCard
          title="Additional Settings"
          subheader="Settings that are specific to a plugin, or feature of the app"
          variant="flat"
          value={selectedTab}
          onChange={handleChange}
          noPadding
        >
          <CardTab value="auth" label="Auth Providers">
            <AuthProvidersList providers={providers} />
          </CardTab>
          <CardTab value="flags" label="Feature Flags">
            {featureFlags.length > 0 ? (
              <FeatureFlagsList featureFlags={featureFlags} />
            ) : (
              // TODO(marcuseide): Replace with empty state component
              <Alert severity="info">No registered Feature Flags found</Alert>
            )}
          </CardTab>
        </TabbedCard>
      </CardContent>
    </Card>
  );
};
