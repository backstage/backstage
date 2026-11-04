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

import {
  AppComponents,
  configApiRef,
  identityApiRef,
  SignInPageProps,
  useApi,
} from '@backstage/core-plugin-api';
import { InternalAppContext } from './InternalAppContext';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { BUIProvider, Link } from '@backstage/ui';
import { useVersionedContext } from '@backstage/version-bridge';
import { Link as AriaLink } from 'react-aria-components';
import * as ReactRouter from 'react-router-dom';
import { AppIdentityProxy } from '../apis/implementations/IdentityApi/AppIdentityProxy';
import { fireEvent, render, screen } from '@testing-library/react';
import { AppRouter } from './AppRouter';
import useAsync from 'react-use/esm/useAsync';
import { AppContextProvider } from './AppContext';
import { mockApis, TestApiProvider } from '@backstage/test-utils';
import { ConfigReader } from '@backstage/config';

function UserRefDisplay() {
  const identityApi = useApi(identityApiRef);
  const { value } = useAsync(() => identityApi.getBackstageIdentity());
  return <div>ref: {value?.userEntityRef}</div>;
}

// Frozen V2 consumer contract, independent of the current BUI provider type.
type LegacyRouting = {
  Link: typeof ReactRouter.Link;
  useHref: typeof ReactRouter.useHref;
  useInRouterContext: typeof ReactRouter.useInRouterContext;
  useLocation: typeof ReactRouter.useLocation;
  useNavigate: typeof ReactRouter.useNavigate;
  useResolvedPath: typeof ReactRouter.useResolvedPath;
  createRouterOptions(
    action: () => void,
    options?: ReactRouter.NavigateOptions,
  ): ReactRouter.NavigateOptions;
};

function FrozenV2Consumer() {
  const { routing } = useVersionedContext<{ 2: { routing: LegacyRouting } }>(
    'bui',
  )!.atVersion(2)!;
  const location = routing.useLocation();
  const resolved = routing.useResolvedPath('create');
  const navigate = routing.useNavigate();
  const href = routing.useHref('create');
  const active = location.pathname === resolved.pathname;
  return (
    <>
      <routing.Link to="create" aria-current={active ? 'page' : undefined}>
        Legacy create
      </routing.Link>
      <AriaLink
        href={href}
        routerOptions={
          routing.createRouterOptions(() => navigate('create')) as never
        }
      >
        Legacy delegated
      </AriaLink>
      <span>
        {routing.useInRouterContext()
          ? 'Legacy router present'
          : 'No legacy router'}
      </span>
    </>
  );
}

describe('AppRouter', () => {
  const mockComponents = {
    Router: MemoryRouter,
  } as AppComponents;

  it('provides scoped navigation and the frozen BUI V2 contract through the legacy app router', () => {
    const appIdentityProxy = new AppIdentityProxy();
    function Location() {
      const { pathname } = useLocation();
      return <output>{pathname}</output>;
    }
    const components = {
      Router: (props: React.ComponentProps<typeof MemoryRouter>) => (
        <MemoryRouter
          {...props}
          initialEntries={['/app/catalog']}
          future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
        />
      ),
    } as AppComponents;
    render(
      <TestApiProvider
        apis={[
          [identityApiRef, appIdentityProxy],
          [
            configApiRef,
            new ConfigReader({ app: { baseUrl: 'http://localhost/app' } }),
          ],
        ]}
      >
        <InternalAppContext.Provider
          value={{ routeObjects: [], appIdentityProxy }}
        >
          <AppContextProvider
            appContext={{ getComponents: () => components } as any}
          >
            <AppRouter>
              <Location />
              <Routes>
                <Route
                  path="catalog"
                  element={
                    <BUIProvider>
                      <Link href="create">Create</Link>
                      <FrozenV2Consumer />
                    </BUIProvider>
                  }
                >
                  <Route path="*" element={null} />
                </Route>
              </Routes>
            </AppRouter>
          </AppContextProvider>
        </InternalAppContext.Provider>
      </TestApiProvider>,
    );
    const link = screen.getByRole('link', { name: 'Create' });
    expect(link).toHaveAttribute('href', '/app/catalog/create');
    const legacyLink = screen.getByRole('link', { name: 'Legacy create' });
    expect(legacyLink).toHaveAttribute('href', '/app/catalog/create');
    expect(legacyLink).not.toHaveAttribute('aria-current');
    expect(screen.getByText('Legacy router present')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('link', { name: 'Legacy delegated' }));
    expect(screen.getByRole('status')).toHaveTextContent('/catalog/create');
    expect(legacyLink).toHaveAttribute('aria-current', 'page');
    fireEvent.click(legacyLink);
    expect(screen.getByRole('status')).toHaveTextContent('/catalog/create');
    fireEvent.click(link);
    expect(screen.getByRole('status')).toHaveTextContent('/catalog/create');
  });

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
      props.onSignInSuccess(mockApis.identity());
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
