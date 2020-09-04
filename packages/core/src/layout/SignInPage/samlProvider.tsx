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
import { ProviderComponent, ProviderLoader, SignInProvider } from './types';
import { useApi, errorApiRef /* samlAuthApiRef */ } from '@backstage/core-api';
import { InfoCard } from '../InfoCard/InfoCard';

const Component: ProviderComponent = ({ onResult }) => {
  // const samlApi = useApi(samlAuthApiRef);
  const errorApi = useApi(errorApiRef);

  const handleSSORedirect = () => {
    // FIXME: this shoudl be from identity API or something.
    window.open('http://localhost:7000/auth/saml/start');
  };

  const receiveMessage = (event: any) => {
    // FIXME: Should use the backstage identity API and not create this session storage.
    window.sessionStorage.setItem(
      'helixSession',
      JSON.stringify(event.data.response),
    );

    onResult({
      userId: event.data.response.backstageIdentity,
      profile: {
        email: event.data.response.profile.email,
        displayName: event.data.response.profile.displayName,
      },
    });
  };

  const handleLogin = async () => {
    try {
      // FIXME: this should be handle through backstage API or something.
      handleSSORedirect();
      window.addEventListener('message', receiveMessage, false);
    } catch (error) {
      errorApi.post(error);
    }
  };

  return (
    <Grid item>
      <InfoCard
        title="SAML"
        actions={
          <Button color="primary" variant="outlined" onClick={handleLogin}>
            Sign In
          </Button>
        }
      >
        <Typography variant="body1">Sign In using SAML lolololol</Typography>
      </InfoCard>
    </Grid>
  );
};

const loader: ProviderLoader = async () => {
  // FIXME: should get the profile from identiy API not from storage session.
  const sessionRaw = window.sessionStorage.getItem('helixSession');

  if (!sessionRaw) {
    return undefined;
  }

  const session = JSON.parse(sessionRaw);

  return {
    userId: session.backstageIdentity,
    profile: {
      email: session.profile.email,
      displayName: session.profile.displayName,
    },
  };
};

export const samlProvider: SignInProvider = { Component, loader };
