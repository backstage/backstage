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

import React, { FC } from 'react';
import { OAuthApi, OpenIdConnectApi, IconComponent } from '@backstage/core-api';
import { SidebarItem } from '../Items';
import { IconButton, Tooltip } from '@material-ui/core';
import StarBorder from '@material-ui/icons/StarBorder';
import PowerButton from '@material-ui/icons/PowerSettingsNew';

export const ProviderSettingsItem: FC<{
  title: string;
  icon: IconComponent;
  signedIn: boolean;
  api: OAuthApi | OpenIdConnectApi;
  signInHandler: Function;
}> = ({ title, icon, signedIn, api, signInHandler }) => {
  return (
    <SidebarItem
      key={title}
      text={title}
      icon={icon ?? StarBorder}
      disableSelected
    >
      <IconButton onClick={() => (signedIn ? api.logout() : signInHandler())}>
        <Tooltip
          placement="top"
          arrow
          title={signedIn ? `Sign out from ${title}` : `Sign in to ${title}`}
        >
          <PowerButton color={signedIn ? 'secondary' : 'primary'} />
        </Tooltip>
      </IconButton>
    </SidebarItem>
  );
};
