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

import React, { useEffect, useState } from 'react';
import {
  Button,
  Grid,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Tooltip,
  Typography,
} from '@material-ui/core';
import {
  ApiRef,
  SessionApi,
  SessionState,
  ProfileInfoApi,
  ProfileInfo,
  useApi,
  errorApiRef,
  IconComponent,
} from '@backstage/core-plugin-api';
import { ProviderSettingsAvatar } from './ProviderSettingsAvatar';

const emptyProfile: ProfileInfo = {};

/** @public */
export const ProviderSettingsItem = (props: {
  title: string;
  description: string;
  icon: IconComponent;
  apiRef: ApiRef<ProfileInfoApi & SessionApi>;
}) => {
  const { title, description, icon: Icon, apiRef } = props;

  const api = useApi(apiRef);
  const errorApi = useApi(errorApiRef);
  const [signedIn, setSignedIn] = useState(false);
  const [profile, setProfile] = useState<ProfileInfo>(emptyProfile);

  useEffect(() => {
    let didCancel = false;

    const subscription = api
      .sessionState$()
      .subscribe((sessionState: SessionState) => {
        if (sessionState !== SessionState.SignedIn) {
          setProfile(emptyProfile);
          setSignedIn(false);
        }
        if (!didCancel) {
          api
            .getProfile({ optional: true })
            .then((profileResponse: ProfileInfo | undefined) => {
              if (!didCancel) {
                if (sessionState === SessionState.SignedIn) {
                  setSignedIn(true);
                }
                if (profileResponse) {
                  setProfile(profileResponse);
                }
              }
            });
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
      <ListItemText
        primary={title}
        secondary={
          <Tooltip placement="top" arrow title={description}>
            <Grid container spacing={6}>
              <Grid item>
                <ProviderSettingsAvatar size={48} picture={profile.picture} />
              </Grid>
              <Grid item xs={12} sm container>
                <Grid item xs container direction="column" spacing={2}>
                  <Grid item xs>
                    {profile.displayName && (
                      <Typography
                        variant="subtitle1"
                        color="textPrimary"
                        gutterBottom
                      >
                        {profile.displayName}
                      </Typography>
                    )}
                    {profile.email && (
                      <Typography variant="body2" color="textSecondary">
                        {profile.email}
                      </Typography>
                    )}
                    <Typography variant="body2" color="textSecondary">
                      {description}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
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
          <Button
            variant="outlined"
            color="primary"
            onClick={() => {
              const action = signedIn ? api.signOut() : api.signIn();
              action.catch(error => errorApi.post(error));
            }}
          >
            {signedIn ? `Sign out` : `Sign in`}
          </Button>
        </Tooltip>
      </ListItemSecondaryAction>
    </ListItem>
  );
};
