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
import { useApi, githubAuthApiRef, errorApiRef } from '@backstage/core-api';

const Component: ProviderComponent = ({ onResult }) => {
  const githubAuthApi = useApi(githubAuthApiRef);
  const errorApi = useApi(errorApiRef);

  const handleLogin = async () => {
    try {
      const identity = await githubAuthApi.getBackstageIdentity({
        instantPopup: true,
      });

      const profile = await githubAuthApi.getProfile();
      onResult({
        userId: identity!.id,
        profile: profile!,
        getIdToken: () => {
          return githubAuthApi.getBackstageIdentity().then(i => i!.idToken);
        },
        logout: async () => {
          await githubAuthApi.logout();
        },
      });
    } catch (error) {
      errorApi.post(error);
    }
  };

  return (
    <Grid item>
      <InfoCard
        title="Github"
        actions={
          <Button color="primary" variant="outlined" onClick={handleLogin}>
            Sign In
          </Button>
        }
      >
        <Typography variant="body1">Sign In using Github</Typography>
      </InfoCard>
    </Grid>
  );
};

const loader: ProviderLoader = async apis => {
  const githubAuthApi = apis.get(githubAuthApiRef)!;

  const identity = await githubAuthApi.getBackstageIdentity({
    optional: true,
  });

  if (!identity) {
    return undefined;
  }

  const profile = await githubAuthApi.getProfile();

  return {
    userId: identity.id,
    profile: profile!,
    getIdToken: () =>
      githubAuthApi.getBackstageIdentity().then(i => i!.idToken),
    logout: async () => {
      await githubAuthApi.logout();
    },
  };
};

export const githubProvider: SignInProvider = { Component, loader };
