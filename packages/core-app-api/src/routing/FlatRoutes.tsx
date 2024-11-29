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

import React, { ReactNode, useMemo } from 'react';
import { useRoutes } from 'react-router-dom';
import {
  attachComponentData,
  useApp,
  useElementFilter,
} from '@backstage/core-plugin-api';
import { isReactRouterBeta } from '../app/isReactRouterBeta';

let warned = false;

type RouteObject = {
  path: string;
  element: ReactNode;
  children?: RouteObject[];
};

/**
 * Props for the {@link FlatRoutes} component.
 *
 * @public
 */
export type FlatRoutesProps = {
  children: ReactNode;
};

/**
 * A wrapper around a set of routes.
 *
 * @remarks
 *
 * The root of the routing hierarchy in your app should use this component,
 * instead of the one from `react-router-dom`. This ensures that all of the
 * plugin route and utility API wiring happens under the hood.
 *
 * @public
 */
export const FlatRoutes = (props: FlatRoutesProps): JSX.Element | null => {
  const app = useApp();
  const { NotFoundErrorPage } = app.getComponents();
  const isBeta = useMemo(() => isReactRouterBeta(), []);
  const routes = useElementFilter(props.children, elements =>
    elements
      .getElements<{
        path?: string;
        element?: ReactNode;
        children?: ReactNode;
      }>()
      .flatMap<RouteObject>(child => {
        let path = child.props.path;

        // TODO(Rugvip): Work around plugins registering empty paths, remove once deprecated routes are gone
        if (path === '') {
          return [];
        }
        path = path?.replace(/\/\*$/, '') ?? '/';

        let element = isBeta ? child : child.props.element;
        if (!isBeta && !element) {
          element = child;
          if (!warned && process.env.NODE_ENV !== 'test') {
            // eslint-disable-next-line no-console
            console.warn(
              'DEPRECATION WARNING: All elements within <FlatRoutes> must be of type <Route> with an element prop. ' +
                'Existing usages of <Navigate key=[path] to=[to] /> should be replaced with <Route path=[path] element={<Navigate to=[to] />} />.',
            );
            warned = true;
          }
        }

        return [
          {
            // Each route matches any sub route, except for the explicit root path
            path,
            element,
            children: child.props.children
              ? [
                  // These are the children of each route, which we all add in under a catch-all
                  // subroute in order to make them available to `useOutlet`
                  {
                    path: path === '/' ? '/' : '*', // The root path must require an exact match
                    element: child.props.children,
                  },
                ]
              : undefined,
          },
        ];
      })
      // Routes are sorted to work around a bug where prefixes are unexpectedly matched
      // TODO(Rugvip): This can be removed once react-router v6 beta is no longer supported
      .sort((a, b) => b.path.localeCompare(a.path))
      .map(obj => ({ ...obj, path: obj.path === '/' ? '/' : `${obj.path}/*` })),
  );

  // TODO(Rugvip): Possibly add a way to skip this, like a noNotFoundPage prop
  const withNotFound = [
    ...routes,
    {
      path: '*',
      element: <NotFoundErrorPage />,
    },
  ];

  return useRoutes(withNotFound);
};

attachComponentData(FlatRoutes, 'core.type', 'FlatRoutes');
