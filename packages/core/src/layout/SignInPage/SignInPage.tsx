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

import React, {
  FC,
  useLayoutEffect,
  useState,
  ComponentType,
  useMemo,
} from 'react';
import { Page } from '../Page';
import { Header } from '../Header';
import { Content } from '../Content/Content';
import { ContentHeader } from '../ContentHeader/ContentHeader';
import { Grid, Typography, Button } from '@material-ui/core';
import { InfoCard } from '../InfoCard/InfoCard';
import {
  SignInPageProps,
  SignInResult,
  useApi,
  configApiRef,
  useApiHolder,
  ApiHolder,
  errorApiRef,
} from '@backstage/core-api';

const PROVIDER_STORAGE_KEY = '@backstage/core:SignInPage:provider';

type ProviderComponent = ComponentType<SignInPageProps>;

type ProviderLoader = (apis: ApiHolder) => Promise<SignInResult | undefined>;

type SignInProvider = {
  component: ProviderComponent;
  loader: ProviderLoader;
};

const GuestProvider: ProviderComponent = ({ onResult }) => (
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
        meaning some features might be unavailable.
      </Typography>
    </InfoCard>
  </Grid>
);

const guestLoader: ProviderLoader = async () => {
  return { userId: 'guest' };
};

const guestProvider: SignInProvider = {
  component: GuestProvider,
  loader: guestLoader,
};

const signInProviders = {
  guest: guestProvider,
};

export type SignInProviderId = keyof typeof signInProviders;

export type Props = SignInPageProps & {
  providers: SignInProviderId[];
};

export const SignInPage: FC<Props> = ({ onResult, providers }) => {
  const configApi = useApi(configApiRef);
  const errorApi = useApi(errorApiRef);
  const apiHolder = useApiHolder();

  // We can't use storageApi here, as it might have a dependency on the IdentityApi
  const selectedProvider = localStorage.getItem(
    PROVIDER_STORAGE_KEY,
  ) as SignInProviderId;

  const [attempting, setAttempting] = useState(Boolean(selectedProvider));

  useLayoutEffect(() => {
    if (!attempting || selectedProvider === null) {
      return undefined;
    }

    const provider = signInProviders[selectedProvider];
    if (!provider) {
      setAttempting(false);
      return undefined;
    }

    let didCancel = false;
    provider
      .loader(apiHolder)
      .then(result => {
        if (didCancel) {
          return;
        }
        setAttempting(false);
        if (result) {
          onResult({
            ...result,
            logout: async () => {
              localStorage.removeItem(PROVIDER_STORAGE_KEY);
              await result.logout?.();
            },
          });
        }
      })
      .catch(error => {
        if (!didCancel) {
          errorApi.post(error);
        }
      });

    return () => {
      didCancel = true;
    };
  }, [attempting, errorApi, onResult, apiHolder, providers, selectedProvider]);

  const providerElements = useMemo(
    () =>
      providers.map(providerId => {
        const provider = signInProviders[providerId];
        if (!provider) {
          throw new Error(`Unknown sign-in provider: ${providerId}`);
        }
        const { component: Component } = provider;

        const handleResult = (result: SignInResult) => {
          localStorage.setItem(PROVIDER_STORAGE_KEY, providerId);

          onResult({
            ...result,
            logout: async () => {
              localStorage.removeItem(PROVIDER_STORAGE_KEY);
              await result.logout?.();
            },
          });
        };

        return <Component key={providerId} onResult={handleResult} />;
      }),
    [providers, onResult],
  );

  return (
    <Page>
      <Header title={configApi.getString('app.title') ?? 'Backstage'} />
      <Content>
        <ContentHeader title="Select a sign-in method" />
        <Grid container>{providerElements}</Grid>
      </Content>
    </Page>
  );
};
