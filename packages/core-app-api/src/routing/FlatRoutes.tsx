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

import { ReactNode, useMemo } from 'react';
import { useRoutes, createRoutesFromChildren } from 'react-router-dom';
import {
  attachComponentData,
  useApp,
  useElementFilter,
} from '@backstage/core-plugin-api';
import { isReactRouterBeta } from '../app/isReactRouterBeta';

let warned = false;

type RouteObject = {
  path: string;
  element?: ReactNode;
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

export const FlatRoutes = (props: FlatRoutesProps): JSX.Element | null => {
  const app = useApp();
  const { NotFoundErrorPage } = app.getComponents();
  const routes = createRoutesFromChildren(props.children);

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
export const FlatRoutes2 = (props: FlatRoutesProps): JSX.Element | null => {
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
        const path = child.props.path;
        const children = child.props.children;

        let element = isBeta ? child : child.props.element;
        if (!isBeta && !element && !children) {
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

        let correctedPath = path ?? '/';
        if (path?.length === 0) {
          // Route paths should not be empty
          // eslint-disable-next-line no-console
          console.warn(
            `DEPRECATION WARNING: The path property in the <Route /> component must not be left empty.`,
          );
        }

        if (correctedPath.startsWith('/') && correctedPath.length > 1) {
          // Route paths should not have a leading '/'
          // eslint-disable-next-line no-console
          console.warn(
            `DEPRECATION WARNING: Remove the leading '/' from the path property in the <Route /> component: ${path}.`,
          );
          correctedPath = correctedPath.slice(1);
        }

        let isSplat = false;
        if (correctedPath.endsWith('/*')) {
          // Route paths should not have a trailing '/*'
          // instead a new Route component should be used
          // eslint-disable-next-line no-console
          console.warn(
            `DEPRECATION WARNING: Remove the trailing '/*' from the path property in the <Route /> component: ${path}. For more information, see: https://reactrouter.com/upgrading/v6#v7_relativesplatpath.`,
          );
          isSplat = true;
          correctedPath = correctedPath.slice(0, -2);
        }

        if (isSplat) {
          return [
            {
              path: correctedPath,
              children: [{ path: '*', element: element, children }],
            },
          ] as RouteObject[];
        }

        return [
          {
            path: correctedPath,
            element,
            children,
          },
        ] as RouteObject[];
      })
      // Routes are sorted to work around a bug where prefixes are unexpectedly matched
      // TODO(Rugvip): This can be removed once react-router v6 beta is no longer supported
      .sort((a, b) => b.path.localeCompare(a.path)),
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
