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

import React from 'react';
import { Link, MemoryRouter } from 'react-router-dom';
import { createSpecializedApp } from '@backstage/frontend-app-api';
import { RenderResult, render } from '@testing-library/react';
import { ConfigReader } from '@backstage/config';
import { JsonObject } from '@backstage/types';
import {
  createExtension,
  createExtensionOverrides,
  ExtensionDefinition,
  coreExtensionData,
  RouteRef,
  useRouteRef,
  createExtensionInput,
  IconComponent,
  createNavItemExtension,
  RouterBlueprint,
} from '@backstage/frontend-plugin-api';

/**
 * Options to customize the behavior of the test app.
 * @public
 */
export type TestAppOptions = {
  /**
   * An object of paths to mount route ref on, with the key being the path and the value
   * being the RouteRef that the path will be bound to. This allows the route refs to be
   * used by `useRouteRef` in the rendered elements.
   *
   * @example
   * ```ts
   * renderInTestApp(<MyComponent />, {
   *   mountedRoutes: {
   *     '/my-path': myRouteRef,
   *   }
   * })
   * // ...
   * const link = useRouteRef(myRouteRef)
   * ```
   */
  mountedRoutes?: { [path: string]: RouteRef };

  /**
   * Additional configuration passed to the app when rendering elements inside it.
   */
  config?: JsonObject;
};

const NavItem = (props: {
  routeRef: RouteRef<undefined>;
  title: string;
  icon: IconComponent;
}) => {
  const { routeRef, title, icon: Icon } = props;
  const link = useRouteRef(routeRef);
  if (!link) {
    return null;
  }
  return (
    <li>
      <Link to={link()}>
        <Icon /> {title}
      </Link>
    </li>
  );
};

export const TestAppNavExtension = createExtension({
  namespace: 'app',
  name: 'nav',
  attachTo: { id: 'app/layout', input: 'nav' },
  inputs: {
    items: createExtensionInput([createNavItemExtension.targetDataRef]),
  },
  output: [coreExtensionData.reactElement],
  factory({ inputs }) {
    return [
      coreExtensionData.reactElement(
        <nav>
          <ul>
            {inputs.items.map((item, index) => {
              const { icon, title, routeRef } = item.get(
                createNavItemExtension.targetDataRef,
              );

              return (
                <NavItem
                  key={index}
                  icon={icon}
                  title={title}
                  routeRef={routeRef}
                />
              );
            })}
          </ul>
        </nav>,
      ),
    ];
  },
});

/**
 * @public
 * Renders the given element in a test app, for use in unit tests.
 */
export function renderInTestApp(
  element: JSX.Element,
  options?: TestAppOptions,
): RenderResult {
  const extensions: Array<ExtensionDefinition<any, any>> = [
    createExtension({
      namespace: 'test',
      attachTo: { id: 'app/routes', input: 'routes' },
      output: [coreExtensionData.reactElement, coreExtensionData.routePath],
      factory: () => {
        return [
          coreExtensionData.reactElement(element),
          coreExtensionData.routePath('/'),
        ];
      },
    }),
    RouterBlueprint.make({
      namespace: 'test',
      params: {
        Component: ({ children }) => <MemoryRouter>{children}</MemoryRouter>,
      },
    }),
    TestAppNavExtension,
  ];

  if (options?.mountedRoutes) {
    for (const [path, routeRef] of Object.entries(options.mountedRoutes)) {
      // TODO(Rugvip): add support for external route refs
      extensions.push(
        createExtension({
          kind: 'test-route',
          name: path,
          attachTo: { id: 'app/root', input: 'elements' },
          output: {
            element: coreExtensionData.reactElement,
            path: coreExtensionData.routePath,
            routeRef: coreExtensionData.routeRef,
          },
          factory() {
            return { element: <React.Fragment />, path, routeRef };
          },
        }),
      );
    }
  }

  const app = createSpecializedApp({
    features: [
      createExtensionOverrides({
        extensions,
      }),
    ],
    config: ConfigReader.fromConfigs([
      { context: 'render-config', data: options?.config ?? {} },
    ]),
  });

  return render(app.createRoot());
}
