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
  Divider,
  makeStyles,
} from '@material-ui/core';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import { SidebarPinButton } from './PinButton';
import { SignInAvatar } from './SignInAvatar';
import { SidebarThemeToggle } from './ThemeToggle';
import { UserSettingsMenu } from './UserSettingsMenu';
import { useUserProfile } from './useUserProfileInfo';

const useStyles = makeStyles({
  root: {
    minWidth: 400,
  },
});

export const SettingsDialog = ({
  providerSettings,
}: {
  providerSettings?: React.ReactNode;
}) => {
  const classes = useStyles();
  const { profile, displayName } = useUserProfile();

  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={<SignInAvatar />}
        action={<UserSettingsMenu />}
        title={displayName}
        subheader={profile.email}
      />
      <CardContent>
        <Divider />
        <List dense subheader={<ListSubheader>App Settings</ListSubheader>}>
          <SidebarThemeToggle />
          <SidebarPinButton />
        </List>
        <Divider />
        <List
          subheader={<ListSubheader>Available Auth Providers</ListSubheader>}
        >
          {providerSettings}
        </List>
      </CardContent>
    </Card>
  );
};
