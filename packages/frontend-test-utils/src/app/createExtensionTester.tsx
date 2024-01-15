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
import { MemoryRouter, Link } from 'react-router-dom';
import { RenderResult, render } from '@testing-library/react';
import { createSpecializedApp } from '@backstage/frontend-app-api';
import {
  ExtensionDefinition,
  IconComponent,
  IdentityApi,
  RouteRef,
  configApiRef,
  coreExtensionData,
  createAppRootWrapperExtension,
  createExtension,
  createExtensionInput,
  createExtensionOverrides,
  createNavItemExtension,
  useApi,
  useRouteRef,
} from '@backstage/frontend-plugin-api';
import { MockConfigApi } from '@backstage/test-utils';
import { JsonArray, JsonObject, JsonValue } from '@backstage/types';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { resolveExtensionDefinition } from '../../../frontend-plugin-api/src/wiring/resolveExtensionDefinition';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { createSignInPageExtension } from '../../../frontend-plugin-api/src/extensions/createSignInPageExtension';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { toInternalExtensionDefinition } from '../../../frontend-plugin-api/src/wiring/createExtension';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { InternalAppContext } from '../../../frontend-app-api/src/wiring/InternalAppContext';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { SignInPageProps } from '../../../core-plugin-api';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { getBasePath } from '../../../core-app-api/src/app/AppRouter';

const NavItem = (props: {
  routeRef: RouteRef<undefined>;
  title: string;
  icon: IconComponent;
}) => {
  const { routeRef, title, icon: Icon } = props;
  const to = useRouteRef(routeRef)();
  return (
    <li>
      <Link to={to}>
        <Icon /> {title}
      </Link>
    </li>
  );
};

const TestAppNavExtension = createExtension({
  namespace: 'app',
  name: 'nav',
  attachTo: { id: 'app/layout', input: 'nav' },
  inputs: {
    items: createExtensionInput({
      target: createNavItemExtension.targetDataRef,
    }),
  },
  output: {
    element: coreExtensionData.reactElement,
  },
  factory({ inputs }) {
    return {
      element: (
        <nav>
          <ul>
            {inputs.items.map((item, index) => (
              <NavItem
                key={index}
                icon={item.output.target.icon}
                title={item.output.target.title}
                routeRef={item.output.target.routeRef}
              />
            ))}
          </ul>
        </nav>
      ),
    };
  },
});

const AuthenticationProvider = (props: {
  signInPage?: ComponentType<SignInPageProps>;
  children: ReactNode;
}) => {
  const { signInPage: SignInPage, children } = props;
  const configApi = useApi(configApiRef);
  const signOutTargetUrl = getBasePath(configApi) || '/';

  const internalAppContext = useContext(InternalAppContext);
  if (!internalAppContext) {
    throw new Error('AppRouter must be rendered within the AppProvider');
  }

  const { appIdentityProxy } = internalAppContext;
  const [identityApi, setIdentityApi] = useState<IdentityApi>();

  if (!SignInPage) {
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
      { signOutTargetUrl },
    );

    return children;
  }

  if (!identityApi) {
    return <SignInPage onSignInSuccess={setIdentityApi} />;
  }

  appIdentityProxy.setTarget(identityApi, {
    signOutTargetUrl,
  });

  return children;
};

const TestAppRootExtension = createExtension({
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
    const SignInPage = inputs.signInPage?.output.component;

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
        <MemoryRouter>
          <AuthenticationProvider signInPage={SignInPage}>
            {content}
          </AuthenticationProvider>
        </MemoryRouter>
      ),
    };
  },
});

/** @public */
export class ExtensionTester {
  /** @internal */
  static forSubject<TConfig>(
    subject: ExtensionDefinition<TConfig>,
    options?: { config?: TConfig },
  ): ExtensionTester {
    const tester = new ExtensionTester();
    const { output, factory, ...rest } = toInternalExtensionDefinition(subject);
    // attaching to app/routes to render as index route
    const extension = createExtension({
      ...rest,
      attachTo: { id: 'app/routes', input: 'routes' },
      output: {
        ...output,
        path: coreExtensionData.routePath,
      },
      factory: params => ({
        ...factory(params),
        path: '/',
      }),
    });
    tester.add(extension, options);
    return tester;
  }

  readonly #extensions = new Array<{
    id: string;
    definition: ExtensionDefinition<any>;
    config?: JsonValue;
  }>();

  add<TConfig>(
    extension: ExtensionDefinition<TConfig>,
    options?: { config?: TConfig },
  ): ExtensionTester {
    const { name, namespace } = extension;

    const definition = {
      ...extension,
      // setting name "test" as fallback
      name: !namespace && !name ? 'test' : name,
    };

    const { id } = resolveExtensionDefinition(definition);

    this.#extensions.push({
      id,
      definition,
      config: options?.config as JsonValue,
    });

    return this;
  }

  render(options?: { config?: JsonObject }): RenderResult {
    const { config = {} } = options ?? {};

    const [subject, ...rest] = this.#extensions;
    if (!subject) {
      throw new Error(
        'No subject found. At least one extension should be added to the tester.',
      );
    }

    const extensionsConfig: JsonArray = [
      ...rest.map(extension => ({
        [extension.id]: {
          config: extension.config,
        },
      })),
      {
        [subject.id]: {
          config: subject.config,
          disabled: false,
        },
      },
    ];

    const finalConfig = {
      ...config,
      app: {
        ...(typeof config.app === 'object' ? config.app : undefined),
        extensions: extensionsConfig,
      },
    };

    const app = createSpecializedApp({
      features: [
        createExtensionOverrides({
          extensions: [
            ...this.#extensions.map(extension => extension.definition),
            TestAppNavExtension,
            TestAppRootExtension,
          ],
        }),
      ],
      config: new MockConfigApi(finalConfig),
    });

    return render(app.createRoot());
  }
}

/** @public */
export function createExtensionTester<TConfig>(
  subject: ExtensionDefinition<TConfig>,
  options?: { config?: TConfig },
): ExtensionTester {
  return ExtensionTester.forSubject(subject, options);
}
