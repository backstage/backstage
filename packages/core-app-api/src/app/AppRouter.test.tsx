/*
 * Copyright 2022 The Backstage Authors
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
import {
  AppComponents,
  configApiRef,
  IdentityApi,
  identityApiRef,
  SignInPageProps,
  useApi,
} from '@backstage/core-plugin-api';
import { InternalAppContext } from './InternalAppContext';
import { MemoryRouter } from 'react-router-dom';
import { AppIdentityProxy } from '../apis/implementations/IdentityApi/AppIdentityProxy';
import { render, screen } from '@testing-library/react';
import { AppRouter } from './AppRouter';
import useAsync from 'react-use/lib/useAsync';
import { AppContextProvider } from './AppContext';
import { TestApiProvider } from '@backstage/test-utils';
import { ConfigReader } from '@backstage/config';

function UserRefDisplay() {
  const identityApi = useApi(identityApiRef);
  const { value } = useAsync(() => identityApi.getBackstageIdentity());
  return <div>ref: {value?.userEntityRef}</div>;
}

describe('AppRouter', () => {
  const mockComponents = {
    Router: MemoryRouter,
  } as AppComponents;

  it('should fall back to guest if there is no sign-in page', async () => {
    const appIdentityProxy = new AppIdentityProxy();

    render(
      <TestApiProvider
        apis={[
          [identityApiRef, appIdentityProxy],
          [configApiRef, new ConfigReader({})],
        ]}
      >
        <InternalAppContext.Provider
          value={{ routeObjects: [], appIdentityProxy }}
        >
          <AppContextProvider
            appContext={{ getComponents: () => mockComponents } as any}
          >
            <AppRouter>
              <UserRefDisplay />
            </AppRouter>
          </AppContextProvider>
        </InternalAppContext.Provider>
        ,
      </TestApiProvider>,
    );

    await expect(
      screen.findByText('ref: user:default/guest'),
    ).resolves.toBeInTheDocument();
  });

  it('should use the result from the sign-in page', async () => {
    const appIdentityProxy = new AppIdentityProxy();

    const SignInPage = (props: SignInPageProps) => {
      props.onSignInSuccess({
        getBackstageIdentity: async () => ({
          type: 'user',
          userEntityRef: 'user:default/test',
          ownershipEntityRefs: ['user:default/test'],
        }),
      } as IdentityApi);
      return null;
    };

    render(
      <TestApiProvider
        apis={[
          [identityApiRef, appIdentityProxy],
          [configApiRef, new ConfigReader({})],
        ]}
      >
        <InternalAppContext.Provider
          value={{ routeObjects: [], appIdentityProxy }}
        >
          <AppContextProvider
            appContext={
              {
                getComponents: () => ({ ...mockComponents, SignInPage }),
              } as any
            }
          >
            <AppRouter>
              <UserRefDisplay />
            </AppRouter>
          </AppContextProvider>
        </InternalAppContext.Provider>
      </TestApiProvider>,
    );

    await expect(
      screen.findByText('ref: user:default/test'),
    ).resolves.toBeInTheDocument();
  });
});
