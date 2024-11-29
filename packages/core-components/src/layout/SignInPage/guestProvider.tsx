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

import React from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { InfoCard } from '../InfoCard/InfoCard';
import { GridItem } from './styles';
import { ProviderComponent, ProviderLoader, SignInProvider } from './types';
import { ProxiedSignInIdentity } from '../ProxiedSignInPage/ProxiedSignInIdentity';
import { discoveryApiRef, useApi } from '@backstage/core-plugin-api';
import { GuestUserIdentity } from './GuestUserIdentity';
import useLocalStorage from 'react-use/esm/useLocalStorage';
import { ResponseError } from '@backstage/errors';
import { coreComponentsTranslationRef } from '../../translation';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';

const getIdentity = async (identity: ProxiedSignInIdentity) => {
  try {
    const identityResponse = await identity.getBackstageIdentity();
    return identityResponse;
  } catch (error) {
    if (
      error.name === 'ResponseError' &&
      (error as ResponseError).cause.name === 'NotFoundError'
    ) {
      return undefined;
    }
    throw error;
  }
};

const Component: ProviderComponent = ({
  onSignInStarted,
  onSignInSuccess,
  onSignInFailure,
}) => {
  const discoveryApi = useApi(discoveryApiRef);
  const [_, setUseLegacyGuestToken] = useLocalStorage('enableLegacyGuestToken');
  const { t } = useTranslationRef(coreComponentsTranslationRef);

  const handle = async () => {
    onSignInStarted();

    const identity = new ProxiedSignInIdentity({
      provider: 'guest',
      discoveryApi,
    });

    const identityResponse = await getIdentity(identity).catch(error => {
      // eslint-disable-next-line no-console
      console.warn(`Failed to sign in as a guest, ${error}`);
      return undefined;
    });

    if (!identityResponse) {
      // eslint-disable-next-line no-alert
      const useLegacyGuestTokenResponse = confirm(
        'Failed to sign in as a guest using the auth backend. Do you want to fallback to the legacy guest token?',
      );
      if (useLegacyGuestTokenResponse) {
        setUseLegacyGuestToken(true);
        onSignInSuccess(new GuestUserIdentity());
        return;
      }
      onSignInFailure();
      throw new Error(
        `You cannot sign in as a guest, you must either enable the legacy guest token or configure the auth backend to support guest sign in.`,
      );
    }

    onSignInSuccess(identity);
  };

  return (
    <GridItem>
      <InfoCard
        title="Guest"
        variant="fullHeight"
        actions={
          <Button color="primary" variant="outlined" onClick={handle}>
            {t('signIn.guestProvider.enter')}
          </Button>
        }
      >
        <Typography variant="body1" style={{ whiteSpace: 'pre-line' }}>
          {t('signIn.guestProvider.subtitle')}
        </Typography>
      </InfoCard>
    </GridItem>
  );
};

const loader: ProviderLoader = async apis => {
  const useLegacyGuestToken =
    localStorage.getItem('enableLegacyGuestToken') === 'true';

  const identity = new ProxiedSignInIdentity({
    provider: 'guest',
    discoveryApi: apis.get(discoveryApiRef)!,
  });
  const identityResponse = await getIdentity(identity).catch(error => {
    // eslint-disable-next-line no-console
    console.warn(`Failed to sign in as a guest, ${error}`);
    return undefined;
  });

  if (!identityResponse && !useLegacyGuestToken) {
    return undefined;
  } else if (identityResponse && useLegacyGuestToken) {
    // eslint-disable-next-line no-alert
    const switchToNewGuestToken = confirm(
      'You are currently using the legacy guest token, but you have the new guest backend module installed. Do you want to use the new module?',
    );
    if (switchToNewGuestToken) {
      localStorage.removeItem('enableLegacyGuestToken');
    } else {
      return new GuestUserIdentity();
    }
  } else if (useLegacyGuestToken) {
    return new GuestUserIdentity();
  }

  return identity;
};

export const guestProvider: SignInProvider = { Component, loader };
