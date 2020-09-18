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
import { IconComponent, OAuthApi, OpenIdConnectApi } from '@backstage/core-api';
import {
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Tooltip,
} from '@material-ui/core';
import PowerButton from '@material-ui/icons/PowerSettingsNew';
import { ToggleButton } from '@material-ui/lab';

type Props = {
  title: string;
  icon: IconComponent;
  signedIn: boolean;
  api: OAuthApi | OpenIdConnectApi;
  signInHandler: Function;
};

export const ProviderSettingsItem = ({
  title,
  icon: Icon,
  signedIn,
  api,
  signInHandler,
}: Props) => (
  <ListItem>
    <ListItemIcon>
      <Icon />
    </ListItemIcon>
    <ListItemText primary={title} />
    <ListItemSecondaryAction>
      <ToggleButton
        size="small"
        value={title}
        selected={signedIn}
        onChange={() => (signedIn ? api.logout() : signInHandler())}
      >
        <Tooltip
          placement="top"
          arrow
          title={signedIn ? `Sign out from ${title}` : `Sign in to ${title}`}
        >
          <PowerButton />
        </Tooltip>
      </ToggleButton>
    </ListItemSecondaryAction>
  </ListItem>
);
