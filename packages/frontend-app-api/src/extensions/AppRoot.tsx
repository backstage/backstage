/*
 * Copyright 2023 The Backstage Authors
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
  ComponentType,
  Fragment,
  ReactNode,
  useContext,
  useState,
} from 'react';
import {
  coreExtensionData,
  createAppRootWrapperExtension,
  createExtension,
  createExtensionInput,
  createSignInPageExtension,
} from '@backstage/frontend-plugin-api';
import {
  ConfigApi,
  IdentityApi,
  SignInPageProps,
  configApiRef,
  useApi,
} from '@backstage/core-plugin-api';
import { InternalAppContext } from '../wiring/InternalAppContext';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { AppIdentityProxy } from '../../../core-app-api/src/apis/implementations/IdentityApi/AppIdentityProxy';
import { BrowserRouter } from 'react-router-dom';
import { RouteTracker } from '../routing/RouteTracker';

export const AppRoot = createExtension({
  namespace: 'app',
  name: 'root',
  attachTo: { id: 'app', input: 'root' },
  inputs: {
    signInPage: createExtensionInput(
      { component: createSignInPageExtension.componentDataRef },
      { singleton: true, optional: true },
    ),
    children: createExtensionInput(
      { element: coreExtensionData.reactElement },
      { singleton: true },
    ),
    elements: createExtensionInput(
      { element: coreExtensionData.reactElement },
      { optional: true },
    ),
    wrappers: createExtensionInput(
      { component: createAppRootWrapperExtension.componentDataRef },
      { optional: true },
    ),
  },
  output: {
    element: coreExtensionData.reactElement,
  },
  factory({ inputs }) {
    let content: React.ReactNode = (
      <>
        {inputs.elements.map(el => (
          <Fragment key={el.node.spec.id}>{el.output.element}</Fragment>
        ))}
        {inputs.children.output.element}
      </>
    );

    for (const wrapper of inputs.wrappers) {
      content = <wrapper.output.component>{content}</wrapper.output.component>;
    }

    return {
      element: (
        <AppRouter SignInPageComponent={inputs.signInPage?.output.component}>
          {content}
        </AppRouter>
      ),
    };
  },
});

/**
 * Read the configured base path.
 *
 * The returned path does not have a trailing slash.
 */
function getBasePath(configApi: ConfigApi) {
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
  SignInPageComponent?: ComponentType<SignInPageProps>;
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
  const { children, SignInPageComponent } = props;

  const configApi = useApi(configApiRef);
  const basePath = getBasePath(configApi);
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

    return (
      <BrowserRouter basename={basePath}>
        <RouteTracker routeObjects={routeObjects} />
        {children}
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter basename={basePath}>
      <RouteTracker routeObjects={routeObjects} />
      <SignInPageWrapper
        component={SignInPageComponent}
        appIdentityProxy={appIdentityProxy}
      >
        {children}
      </SignInPageWrapper>
    </BrowserRouter>
  );
}
