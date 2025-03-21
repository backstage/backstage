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

import React, { useLayoutEffect, useState, useMemo, useCallback } from 'react';
import {
  SignInPageProps,
  useApi,
  useApiHolder,
  errorApiRef,
  IdentityApi,
} from '@backstage/core-plugin-api';
import {
  IdentityProviders,
  SignInProvider,
  SignInProviderConfig,
} from './types';
import { commonProvider } from './commonProvider';
import { guestProvider } from './guestProvider';
import { customProvider } from './customProvider';
import { IdentityApiSignOutProxy } from './IdentityApiSignOutProxy';
import { useSearchParams } from 'react-router-dom';
import { useMountEffect } from '@react-hookz/web';
import { ForwardedError } from '@backstage/errors';
import { coreComponentsTranslationRef } from '../../translation';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';

const PROVIDER_STORAGE_KEY = '@backstage/core:SignInPage:provider';

export type SignInProviderType = {
  [key: string]: {
    components: SignInProvider;
    id: string;
    config?: SignInProviderConfig;
  };
};

const signInProviders: { [key: string]: SignInProvider } = {
  guest: guestProvider,
  custom: customProvider,
  common: commonProvider,
};

function validateIDs(id: string, providers: SignInProviderType): void {
  if (id in providers)
    throw new Error(
      `"${id}" ID is duplicated. IDs of identity providers have to be unique.`,
    );
}

export function getSignInProviders(
  identityProviders: IdentityProviders,
): SignInProviderType {
  const providers = identityProviders.reduce(
    (acc: SignInProviderType, config) => {
      if (typeof config === 'string') {
        validateIDs(config, acc);
        acc[config] = { components: signInProviders[config], id: config };

        return acc;
      }

      const { id } = config as SignInProviderConfig;
      validateIDs(id, acc);

      acc[id] = { components: signInProviders.common, id, config };

      return acc;
    },
    {},
  );

  return providers;
}

export const useSignInProviders = (
  providers: SignInProviderType,
  onSignInSuccess: SignInPageProps['onSignInSuccess'],
) => {
  const errorApi = useApi(errorApiRef);
  const apiHolder = useApiHolder();
  const [loading, setLoading] = useState(true);

  const { t } = useTranslationRef(coreComponentsTranslationRef);
  // User was redirected back to sign in page with error from auth redirect flow
  const [searchParams, _setSearchParams] = useSearchParams();

  useMountEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam) {
      errorApi.post(
        new ForwardedError(t('signIn.loginFailed'), new Error(errorParam)),
      );
    }
  });

  // This decorates the result with sign out logic from this hook
  const handleWrappedResult = useCallback(
    (identityApi: IdentityApi) => {
      onSignInSuccess(
        IdentityApiSignOutProxy.from({
          identityApi,
          signOut: async () => {
            localStorage.removeItem(PROVIDER_STORAGE_KEY);
            await identityApi.signOut?.();
          },
        }),
      );
    },
    [onSignInSuccess],
  );

  // In this effect we check if the user has already selected an existing login
  // provider, and in that case try to load an existing session for the provider.
  useLayoutEffect(() => {
    if (!loading) {
      return undefined;
    }

    // We can't use storageApi here, as it might have a dependency on the IdentityApi
    const selectedProviderId = localStorage.getItem(
      PROVIDER_STORAGE_KEY,
    ) as string;

    // No provider selected, let the user pick one
    if (selectedProviderId === null) {
      setLoading(false);
      return undefined;
    }

    const provider = providers[selectedProviderId];
    if (!provider) {
      setLoading(false);
      return undefined;
    }

    let didCancel = false;

    provider.components
      .loader(apiHolder, provider.config?.apiRef!)
      .then(result => {
        if (didCancel) {
          localStorage.removeItem(PROVIDER_STORAGE_KEY);
          return;
        }
        if (result) {
          handleWrappedResult(result);
        } else {
          setLoading(false);
        }
      })
      .catch(error => {
        localStorage.removeItem(PROVIDER_STORAGE_KEY);
        if (didCancel) {
          return;
        }
        errorApi.post(error);
        setLoading(false);
      });

    return () => {
      didCancel = true;
    };
  }, [
    loading,
    errorApi,
    onSignInSuccess,
    apiHolder,
    providers,
    handleWrappedResult,
  ]);

  // This renders all available sign-in providers
  const elements = useMemo(
    () =>
      Object.keys(providers).map(key => {
        const provider = providers[key];

        const { Component } = provider.components;

        const handleSignInSuccess = (result: IdentityApi) => {
          handleWrappedResult(result);
        };

        const handleSignInStarted = () => {
          localStorage.setItem(
            PROVIDER_STORAGE_KEY,
            provider?.config?.id || provider.id,
          );
        };

        const handleSignInFailure = () => {
          localStorage.removeItem(PROVIDER_STORAGE_KEY);
        };

        return (
          <Component
            key={provider.id}
            config={provider.config!}
            onSignInStarted={handleSignInStarted}
            onSignInSuccess={handleSignInSuccess}
            onSignInFailure={handleSignInFailure}
          />
        );
      }),
    [providers, handleWrappedResult],
  );

  return [loading, elements];
};
