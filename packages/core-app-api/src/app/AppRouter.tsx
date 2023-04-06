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

import React, { useContext, ReactNode, ComponentType, useState } from 'react';
import {
  ConfigApi,
  configApiRef,
  IdentityApi,
  SignInPageProps,
  useApi,
  useApp,
} from '@backstage/core-plugin-api';
import { InternalAppContext } from './InternalAppContext';
import { isReactRouterBeta } from './isReactRouterBeta';
import { RouteTracker } from '../routing/RouteTracker';
import { Route, Routes } from 'react-router-dom';
import { AppIdentityProxy } from '../apis/implementations/IdentityApi/AppIdentityProxy';

/**
 * Get the app base path from the configured app baseUrl.
 *
 * The returned path does not have a trailing slash.
 */
export function getBasePath(configApi: ConfigApi) {
  if (!isReactRouterBeta()) {
    // When using rr v6 stable the base path is handled through the
    // basename prop on the router component instead.
    return '';
  }

  return readBasePath(configApi);
}

/**
 * Read the configured base path.
 *
 * The returned path does not have a trailing slash.
 */
function readBasePath(configApi: ConfigApi) {
  let { pathname } = new URL(
    configApi.getOptionalString('app.baseUrl') ?? '/',
    'http://sample.dev', // baseUrl can be specified as just a path
  );
  pathname = pathname.replace(/\/*$/, '');
  return pathname;
}

// This wraps the sign-in page and waits for sign-in to be completed before rendering the app
function SignInPageWrapper({
  component: Component,
  appIdentityProxy,
  children,
}: {
  component: ComponentType<SignInPageProps>;
  appIdentityProxy: AppIdentityProxy;
  children: ReactNode;
}) {
  const [identityApi, setIdentityApi] = useState<IdentityApi>();
  const configApi = useApi(configApiRef);
  const basePath = getBasePath(configApi);

  if (!identityApi) {
    return <Component onSignInSuccess={setIdentityApi} />;
  }

  appIdentityProxy.setTarget(identityApi, {
    signOutTargetUrl: basePath || '/',
  });
  return <>{children}</>;
}

/**
 * Props for the {@link AppRouter} component.
 * @public
 */
export interface AppRouterProps {
  children?: ReactNode;
}

/**
 * App router and sign-in page wrapper.
 *
 * @public
 * @remarks
 *
 * The AppRouter provides the routing context and renders the sign-in page.
 * Until the user has successfully signed in, this component will render
 * the sign-in page. Once the user has signed-in, it will instead render
 * the app, while providing routing and route tracking for the app.
 */
export function AppRouter(props: AppRouterProps) {
  const { Router: RouterComponent, SignInPage: SignInPageComponent } =
    useApp().getComponents();

  const configApi = useApi(configApiRef);
  const basePath = readBasePath(configApi);
  const mountPath = `${basePath}/*`;
  const internalAppContext = useContext(InternalAppContext);
  if (!internalAppContext) {
    throw new Error('AppRouter must be rendered within the AppProvider');
  }
  const { routeObjects, appIdentityProxy } = internalAppContext;

  // If the app hasn't configured a sign-in page, we just continue as guest.
  if (!SignInPageComponent) {
    appIdentityProxy.setTarget(
      {
        getUserId: () => 'guest',
        getIdToken: async () => undefined,
        getProfile: () => ({
          email: 'guest@example.com',
          displayName: 'Guest',
        }),
        getProfileInfo: async () => ({
          email: 'guest@example.com',
          displayName: 'Guest',
        }),
        getBackstageIdentity: async () => ({
          type: 'user',
          userEntityRef: 'user:default/guest',
          ownershipEntityRefs: ['user:default/guest'],
        }),
        getCredentials: async () => ({}),
        signOut: async () => {},
      },
      { signOutTargetUrl: basePath || '/' },
    );

    if (isReactRouterBeta()) {
      return (
        <RouterComponent>
          <RouteTracker routeObjects={routeObjects} />
          <Routes>
            <Route path={mountPath} element={<>{props.children}</>} />
          </Routes>
        </RouterComponent>
      );
    }

    return (
      <RouterComponent basename={basePath}>
        <RouteTracker routeObjects={routeObjects} />
        {props.children}
      </RouterComponent>
    );
  }

  if (isReactRouterBeta()) {
    return (
      <RouterComponent>
        <RouteTracker routeObjects={routeObjects} />
        <SignInPageWrapper
          component={SignInPageComponent}
          appIdentityProxy={appIdentityProxy}
        >
          <Routes>
            <Route path={mountPath} element={<>{props.children}</>} />
          </Routes>
        </SignInPageWrapper>
      </RouterComponent>
    );
  }

  return (
    <RouterComponent basename={basePath}>
      <RouteTracker routeObjects={routeObjects} />
      <SignInPageWrapper
        component={SignInPageComponent}
        appIdentityProxy={appIdentityProxy}
      >
        {props.children}
      </SignInPageWrapper>
    </RouterComponent>
  );
}
