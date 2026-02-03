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

import { Fragment } from 'react';
import { Link, MemoryRouter } from 'react-router-dom';
import { createSpecializedApp } from '@backstage/frontend-app-api';
import { RenderResult, render } from '@testing-library/react';
import { ConfigReader } from '@backstage/config';
import { JsonObject } from '@backstage/types';
import {
  createExtension,
  ExtensionDefinition,
  coreExtensionData,
  RouteRef,
  useRouteRef,
  IconComponent,
  NavItemBlueprint,
  createFrontendPlugin,
  FrontendFeature,
  createFrontendModule,
  createApiFactory,
} from '@backstage/frontend-plugin-api';
import { RouterBlueprint } from '@backstage/plugin-app-react';
import appPlugin from '@backstage/plugin-app';
import { type TestApiPairs } from '../utils';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import type { CreateSpecializedAppInternalOptions } from '../../../frontend-app-api/src/wiring/createSpecializedApp';

const DEFAULT_MOCK_CONFIG = {
  app: { baseUrl: 'http://localhost:3000' },
  backend: { baseUrl: 'http://localhost:7007' },
};

/**
 * Options to customize the behavior of the test app.
 * @public
 */
export type TestAppOptions<TApiPairs extends any[] = any[]> = {
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

  /**
   * Additional features to add to the test app.
   */
  features?: FrontendFeature[];

  /**
   * Initial route entries to use for the router.
   */
  initialRouteEntries?: string[];

  /**
   * API overrides to provide to the test app. Use `mockApis` helpers
   * from `@backstage/frontend-test-utils` to create mock implementations.
   *
   * @example
   * ```ts
   * import { identityApiRef } from '@backstage/frontend-plugin-api';
   * import { mockApis } from '@backstage/frontend-test-utils';
   *
   * renderInTestApp(<MyComponent />, {
   *   apis: [[identityApiRef, mockApis.identity({ userEntityRef: 'user:default/guest' })]],
   * })
   * ```
   */
  apis?: readonly [...TestApiPairs<TApiPairs>];
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

const appPluginOverride = appPlugin.withOverrides({
  extensions: [
    appPlugin.getExtension('sign-in-page:app').override({
      disabled: true,
    }),
    appPlugin.getExtension('app/layout').override({
      disabled: true,
    }),
    appPlugin.getExtension('app/routes').override({
      disabled: true,
    }),
    appPlugin.getExtension('app/nav').override({
      output: [coreExtensionData.reactElement],
      factory(_originalFactory, { inputs }) {
        return [
          coreExtensionData.reactElement(
            <nav>
              <ul>
                {inputs.items.map((item, index) => {
                  const { icon, title, routeRef } = item.get(
                    NavItemBlueprint.dataRefs.target,
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
    }),
  ],
});

/**
 * @public
 * Renders the given element in a test app, for use in unit tests.
 */
export function renderInTestApp<TApiPairs extends any[] = any[]>(
  element: JSX.Element,
  options?: TestAppOptions<TApiPairs>,
): RenderResult {
  const extensions: Array<ExtensionDefinition> = [
    createExtension({
      attachTo: { id: 'app/root', input: 'children' },
      output: [coreExtensionData.reactElement],
      factory: () => {
        return [coreExtensionData.reactElement(element)];
      },
    }),
  ];

  if (options?.mountedRoutes) {
    for (const [path, routeRef] of Object.entries(options.mountedRoutes)) {
      // TODO(Rugvip): add support for external route refs
      extensions.push(
        createExtension({
          kind: 'test-route',
          name: path,
          attachTo: { id: 'app/root', input: 'elements' },
          output: [
            coreExtensionData.reactElement,
            coreExtensionData.routePath,
            coreExtensionData.routeRef,
          ],
          factory: () => [
            coreExtensionData.reactElement(<Fragment />),
            coreExtensionData.routePath(path),
            coreExtensionData.routeRef(routeRef),
          ],
        }),
      );
    }
  }

  const features: FrontendFeature[] = [
    createFrontendModule({
      pluginId: 'app',
      extensions: [
        RouterBlueprint.make({
          params: {
            component: ({ children }) => (
              <MemoryRouter initialEntries={options?.initialRouteEntries}>
                {children}
              </MemoryRouter>
            ),
          },
        }),
      ],
    }),
    createFrontendPlugin({
      pluginId: 'test',
      extensions,
    }),
    appPluginOverride,
  ];

  if (options?.features) {
    features.push(...options.features);
  }

  const app = createSpecializedApp({
    features,
    config: ConfigReader.fromConfigs([
      {
        context: 'render-config',
        data: options?.config ?? DEFAULT_MOCK_CONFIG,
      },
    ]),
    __internal: options?.apis && {
      apiFactoryOverrides: options.apis.map(([apiRef, implementation]) =>
        createApiFactory(apiRef, implementation),
      ),
    },
  } as CreateSpecializedAppInternalOptions);

  return render(
    app.tree.root.instance!.getData(coreExtensionData.reactElement),
  );
}
