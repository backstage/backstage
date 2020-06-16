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

import React, { FC, useLayoutEffect } from 'react';
import { Page } from '../Page';
import { Header } from '../Header';
import { Content } from '../Content/Content';
import { ContentHeader } from '../ContentHeader/ContentHeader';
import { Grid, Typography, Button } from '@material-ui/core';
import { InfoCard } from '../InfoCard/InfoCard';
import { SignInPageProps, SignInResult } from '@backstage/core-api';

const PROVIDER_STORAGE_KEY = '@backstage/core:SignInPage:provider';

type ProviderProps = SignInPageProps & {
  selected: boolean;
};

const GuestProvider: FC<ProviderProps> = ({ selected, onResult }) => {
  useLayoutEffect(() => {
    if (selected) {
      onResult({ userId: 'guest' });
    }
  }, [selected, onResult]);

  return (
    <Grid item>
      <InfoCard
        title="Guest"
        actions={
          <Button
            color="primary"
            variant="outlined"
            onClick={() => onResult({ userId: 'guest' })}
          >
            Enter
          </Button>
        }
      >
        <Typography variant="body1">
          Enter as a Guest User.
          <br />
          You will not have a verified identity,
          <br />
          so some features might be unavailable.
        </Typography>
      </InfoCard>
    </Grid>
  );
};

export type SignInProvider = 'guest';

export type Props = SignInPageProps & {
  providers: SignInProvider[];
};

export const SignInPage: FC<Props> = ({ onResult, providers }) => {
  // We can't use storageApi here, as it might have a dependency on the IdentityApi
  const selectedProvider = localStorage.getItem(PROVIDER_STORAGE_KEY);

  const makeResultHandler = (provider: SignInProvider) => (
    result: SignInResult,
  ) => {
    localStorage.setItem(PROVIDER_STORAGE_KEY, provider);

    onResult({
      ...result,
      logout: async () => {
        localStorage.removeItem(PROVIDER_STORAGE_KEY);
        await result.logout?.();
      },
    });
  };

  return (
    <Page>
      <Header title="Login" />
      <Content>
        <ContentHeader title="Select a sign-in method" />
        <Grid container>
          {providers.includes('guest') && (
            <GuestProvider
              selected={selectedProvider === 'guest'}
              onResult={makeResultHandler('guest')}
            />
          )}
        </Grid>
      </Content>
    </Page>
  );
};
