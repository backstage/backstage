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
  PropsWithChildren,
  ReactNode,
  useContext,
  useState,
} from 'react';
import {
  AppRootWrapperBlueprint,
  RouterBlueprint,
  SignInPageBlueprint,
  coreExtensionData,
  createExtension,
  createExtensionInput,
} from '@backstage/frontend-plugin-api';
import {
  IdentityApi,
  SignInPageProps,
  configApiRef,
  useApi,
} from '@backstage/core-plugin-api';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { InternalAppContext } from '../../../../packages/frontend-app-api/src/wiring/InternalAppContext';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { AppIdentityProxy } from '../../../../packages/core-app-api/src/apis/implementations/IdentityApi/AppIdentityProxy';
import { BrowserRouter } from 'react-router-dom';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { RouteTracker } from '../../../../packages/frontend-app-api/src/routing/RouteTracker';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { getBasePath } from '../../../../packages/frontend-app-api/src/routing/getBasePath';

export const AppRoot = createExtension({
  namespace: 'app',
  name: 'root',
  attachTo: { id: 'app', input: 'root' },
  inputs: {
    router: createExtensionInput([RouterBlueprint.dataRefs.component], {
      singleton: true,
      optional: true,
    }),
    signInPage: createExtensionInput([SignInPageBlueprint.dataRefs.component], {
      singleton: true,
      optional: true,
    }),
    children: createExtensionInput([coreExtensionData.reactElement], {
      singleton: true,
    }),
    elements: createExtensionInput([coreExtensionData.reactElement]),
    wrappers: createExtensionInput([
      AppRootWrapperBlueprint.dataRefs.component,
    ]),
  },
  output: [coreExtensionData.reactElement],
  factory({ inputs }) {
    let content: React.ReactNode = (
      <>
        {inputs.elements.map(el => (
          <Fragment key={el.node.spec.id}>
            {el.get(coreExtensionData.reactElement)}
          </Fragment>
        ))}
        {inputs.children.get(coreExtensionData.reactElement)}
      </>
    );

    for (const wrapper of inputs.wrappers) {
      const Component = wrapper.get(AppRootWrapperBlueprint.dataRefs.component);
      content = <Component>{content}</Component>;
    }

    return [
      coreExtensionData.reactElement(
        <AppRouter
          SignInPageComponent={inputs.signInPage?.get(
            SignInPageBlueprint.dataRefs.component,
          )}
          RouterComponent={inputs.router?.get(
            RouterBlueprint.dataRefs.component,
          )}
        >
          {content}
        </AppRouter>,
      ),
    ];
  },
});

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
  RouterComponent?: ComponentType<PropsWithChildren<{}>>;
}

function DefaultRouter(props: PropsWithChildren<{}>) {
  const configApi = useApi(configApiRef);
  const basePath = getBasePath(configApi);
  return <BrowserRouter basename={basePath}>{props.children}</BrowserRouter>;
}

/**
 * App router and sign-in page wrapper.
 *
 * @remarks
 *
 * The AppRouter provides the routing context and renders the sign-in page.
 * Until the user has successfully signed in, this component will render
 * the sign-in page. Once the user has signed-in, it will instead render
 * the app, while providing routing and route tracking for the app.
 */
export function AppRouter(props: AppRouterProps) {
  const {
    children,
    SignInPageComponent,
    RouterComponent = DefaultRouter,
  } = props;

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
      <RouterComponent>
        <RouteTracker routeObjects={routeObjects} />
        {children}
      </RouterComponent>
    );
  }

  return (
    <RouterComponent>
      <RouteTracker routeObjects={routeObjects} />
      <SignInPageWrapper
        component={SignInPageComponent}
        appIdentityProxy={appIdentityProxy}
      >
        {children}
      </SignInPageWrapper>
    </RouterComponent>
  );
}
