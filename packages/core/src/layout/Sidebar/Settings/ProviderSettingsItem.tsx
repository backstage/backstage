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

import React, { FC, useState, useEffect } from 'react';
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
  icon: IconComponent;
  apiRef: ApiRef<SessionApi>;
};

export const ProviderSettingsItem: FC<OAuthProviderSidebarProps> = ({
  title,
  icon: Icon,
  apiRef,
}) => {
  const api = useApi(apiRef);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    let didCancel = false;

    const subscription = api
      .sessionState$()
      .subscribe((sessionState: SessionState) => {
        if (!didCancel) {
          setSignedIn(sessionState === SessionState.SignedIn);
        }
      });

    return () => {
      didCancel = true;
      subscription.unsubscribe();
    };
  }, [api]);

  return (
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
          onChange={() => (signedIn ? api.signOut() : api.signIn())}
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
};
