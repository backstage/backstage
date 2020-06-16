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

import React, { useLayoutEffect, useState, useMemo, useCallback } from 'react';
import { guestProvider } from './guestProvider';
import {
  SignInPageProps,
  SignInResult,
  useApi,
  useApiHolder,
  errorApiRef,
} from '@backstage/core-api';
import { SignInProvider } from './types';

const PROVIDER_STORAGE_KEY = '@backstage/core:SignInPage:provider';

// Separate list here to avoid exporting internal types
export type SignInProviderId = 'guest';

const signInProviders: { [id in SignInProviderId]: SignInProvider } = {
  guest: guestProvider,
};

export const useSignInProviders = (
  providers: SignInProviderId[],
  onResult: SignInPageProps['onResult'],
) => {
  const errorApi = useApi(errorApiRef);
  const apiHolder = useApiHolder();
  const [loading, setLoading] = useState(true);

  // This decorates the result with logout logic from this hook
  const handleWrappedResult = useCallback(
    (result: SignInResult) => {
      onResult({
        ...result,
        logout: async () => {
          localStorage.removeItem(PROVIDER_STORAGE_KEY);
          await result.logout?.();
        },
      });
    },
    [onResult],
  );

  // In this effect we check if the user has already selected an existing login
  // provider, and in that case try to load an existing session for the provider.
  useLayoutEffect(() => {
    if (!loading) {
      return undefined;
    }

    // We can't use storageApi here, as it might have a dependency on the IdentityApi
    const selectedProvider = localStorage.getItem(
      PROVIDER_STORAGE_KEY,
    ) as SignInProviderId;

    // No provider selected, let the user pick one
    if (selectedProvider === null) {
      setLoading(false);
      return undefined;
    }

    const provider = signInProviders[selectedProvider];
    if (!provider) {
      setLoading(false);
      return undefined;
    }

    let didCancel = false;
    provider
      .loader(apiHolder)
      .then(result => {
        if (didCancel) {
          return;
        }
        if (result) {
          handleWrappedResult(result);
        }
        setLoading(false);
      })
      .catch(error => {
        if (didCancel) {
          return;
        }
        errorApi.post(error);
        setLoading(false);
      });

    return () => {
      didCancel = true;
    };
  }, [loading, errorApi, onResult, apiHolder, providers, handleWrappedResult]);

  // This renders all available sign-in providers
  const elements = useMemo(
    () =>
      providers.map(providerId => {
        const provider = signInProviders[providerId];
        if (!provider) {
          throw new Error(`Unknown sign-in provider: ${providerId}`);
        }
        const { Component } = provider;

        const handleResult = (result: SignInResult) => {
          localStorage.setItem(PROVIDER_STORAGE_KEY, providerId);

          handleWrappedResult(result);
        };

        return <Component key={providerId} onResult={handleResult} />;
      }),
    [providers, handleWrappedResult],
  );

  return [loading, elements];
};
