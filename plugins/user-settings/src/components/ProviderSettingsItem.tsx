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
import { IconComponent, OAuthApi, OpenIdConnectApi } from '@backstage/core';
import {
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Tooltip,
} from '@material-ui/core';
import PowerButton from '@material-ui/icons/PowerSettingsNew';
import { ToggleButton } from '@material-ui/lab';
import {
  ApiRef,
  SessionApi,
  useApi,
  IconComponent,
  SessionState,
} from '@backstage/core-api';

type OAuthProviderSidebarProps = {
  title: string;
  description: string;
  icon: IconComponent;
  apiRef: ApiRef<SessionApi>;
};

export const ProviderSettingsItem: FC<OAuthProviderSidebarProps> = ({
  title,
  description,
  icon: Icon,
  signedIn,
  api,
  signInHandler,
}: Props) => (
  <ListItem>
    <ListItemIcon>
      <Icon />
    </ListItemIcon>
    <ListItemText
      primary={title}
      secondary={
        <Tooltip placement="top" arrow title={description}>
          <span>{description}</span>
        </Tooltip>
      }
      secondaryTypographyProps={{ noWrap: true, style: { width: '80%' } }}
    />
    <ListItemSecondaryAction>
      <Tooltip
        placement="top"
        arrow
        title={signedIn ? `Sign out from ${title}` : `Sign in to ${title}`}
      >
        <ToggleButton
          size="small"
          value={title}
          selected={signedIn}
          onChange={() => (signedIn ? api.logout() : signInHandler())}
        >
          <PowerButton color={signedIn ? 'primary' : undefined} />
        </ToggleButton>
      </Tooltip>
    </ListItemSecondaryAction>
  </ListItem>
);
