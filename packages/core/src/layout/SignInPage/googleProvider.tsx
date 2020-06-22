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
import { Grid, Typography, Button } from '@material-ui/core';
import { InfoCard } from '../InfoCard/InfoCard';
import { ProviderComponent, ProviderLoader, SignInProvider } from './types';
import {
  useApi,
  googleAuthApiRef,
  errorApiRef,
  ProfileInfo,
} from '@backstage/core-api';

function parseUserId(profile: ProfileInfo) {
  return profile!.email.replace(/@.*/, '');
}

const Component: ProviderComponent = ({ onResult }) => {
  const googleAuthApi = useApi(googleAuthApiRef);
  const errorApi = useApi(errorApiRef);

  const handleLogin = async () => {
    try {
      await googleAuthApi.getIdToken({ instantPopup: true });
      const profile = await googleAuthApi.getProfile();

      onResult({
        userId: parseUserId(profile!),
        getIdToken: () => googleAuthApi.getIdToken(),
        logout: async () => {
          await googleAuthApi.logout();
        },
      });
    } catch (error) {
      errorApi.post(error);
    }
  };

  return (
    <Grid item>
      <InfoCard
        title="Google"
        actions={
          <Button color="primary" variant="outlined" onClick={handleLogin}>
            Sign In
          </Button>
        }
      >
        <Typography variant="body1">Sign In using Google</Typography>
      </InfoCard>
    </Grid>
  );
};

const loader: ProviderLoader = async apis => {
  const googleAuthApi = apis.get(googleAuthApiRef)!;

  const profile = await googleAuthApi.getProfile({ optional: true });

  return {
    userId: parseUserId(profile!),
    getIdToken: () => googleAuthApi.getIdToken(),
    logout: async () => {
      await googleAuthApi.logout();
    },
  };
};

export const googleProvider: SignInProvider = { Component, loader };
