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

import React, { useEffect, useState } from 'react';
import { Page } from '../Page';
import { Header } from '../Header';
import { Content } from '../Content/Content';
import { ContentHeader } from '../ContentHeader/ContentHeader';
import { Grid, Button, Typography } from '@material-ui/core';
import { SignInPageProps, useApi, configApiRef } from '@backstage/core-api';
import { useSignInProviders, getSignInProviders } from './providers';
import { IdentityProviders, SignInProviderConfig } from './types';
import { Progress } from '../../components/Progress';
import { GridItem, useStyles } from './styles';
import { InfoCard } from '../InfoCard';

type MultiSignInPageProps = SignInPageProps & {
  providers: IdentityProviders;
  title?: string;
  align?: 'center' | 'left';
};

type SingleSignInPageProps = SignInPageProps & {
  provider: SignInProviderConfig;
  auto?: boolean;
};

export type Props = MultiSignInPageProps | SingleSignInPageProps;

export const MultiSignInPage = ({
  onResult,
  providers = [],
  title,
  align = 'left',
}: MultiSignInPageProps) => {
  const configApi = useApi(configApiRef);
  const classes = useStyles();

  const signInProviders = getSignInProviders(providers);
  const [loading, providerElements] = useSignInProviders(
    signInProviders,
    onResult,
  );

  if (loading) {
    return <Progress />;
  }

  return (
    <Page themeId="home">
      <Header title={configApi.getString('app.title')} />
      <Content>
        {title && <ContentHeader title={title} textAlign={align} />}
        <Grid
          container
          justify={align === 'center' ? align : 'flex-start'}
          spacing={2}
          component="ul"
          classes={classes}
        >
          {providerElements}
        </Grid>
      </Content>
    </Page>
  );
};

export const SingleSignInPage = ({
  onResult,
  provider,
  auto,
}: SingleSignInPageProps) => {
  const classes = useStyles();
  const authApi = useApi(provider.apiRef);
  const configApi = useApi(configApiRef);

  const [retry, setRetry] = useState<{} | boolean | undefined>(auto);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    const login = async () => {
      const identity = await authApi.getBackstageIdentity({
        instantPopup: true,
      });

      const profile = await authApi.getProfile();
      onResult({
        userId: identity!.id,
        profile: profile!,
        getIdToken: () => {
          return authApi.getBackstageIdentity().then(i => i!.idToken);
        },
        signOut: async () => {
          await authApi.signOut();
        },
      });
    };

    if (retry) {
      login().catch(setError);
    }
  }, [onResult, authApi, retry]);

  return (
    <Page themeId="home">
      <Header title={configApi.getString('app.title')} />
      <Content>
        <Grid
          container
          justify="center"
          spacing={2}
          component="ul"
          classes={classes}
        >
          <GridItem>
            <InfoCard
              variant="fullHeight"
              title={provider.title}
              actions={
                <Button
                  color="primary"
                  variant="outlined"
                  onClick={() => setRetry({})}
                >
                  Sign In
                </Button>
              }
            >
              <Typography variant="body1">{provider.message}</Typography>
              {error && error.name !== 'PopupRejectedError' && (
                <Typography variant="body1" color="error">
                  {error.message}
                </Typography>
              )}
            </InfoCard>
          </GridItem>
        </Grid>
      </Content>
    </Page>
  );
};

export const SignInPage = (props: Props) => {
  if ('provider' in props) {
    return <SingleSignInPage {...props} />;
  }

  return <MultiSignInPage {...props} />;
};
