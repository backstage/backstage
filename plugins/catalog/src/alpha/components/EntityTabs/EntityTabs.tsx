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
import { ReactElement, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { matchRoutes, useParams, useRoutes } from 'react-router-dom';
import { NotFoundErrorPage } from '@backstage/frontend-plugin-api';
import { EntityTabsPanel } from './EntityTabsPanel';
import { EntityTabsList } from './EntityTabsList';
import { EntityContentGroupDefinitions } from '@backstage/plugin-catalog-react/alpha';

export type SubRoute = {
  group?: string;
  path: string;
  title: string;
  icon?: string | ReactElement;
  children: JSX.Element;
};

// Normalize a route path so it can be matched correctly:
//   - strip leading slashes
//   - if the path already ends with a `*`, keep it as-is so explicit wildcards
//     like `/*` or `/foo/*` aren't double-suffixed into `*/*` / `foo/*/*`
//   - otherwise strip trailing slashes and append `/*` for nested matching;
//     a bare `/` collapses to the empty string so it acts as an index route
//     rather than a wildcard that would swallow every sub-path
function normalizeRoutePath(path: string): string {
  const withoutLeading = path.replace(/^\/+/, '');
  if (withoutLeading.endsWith('*')) {
    return withoutLeading;
  }
  const trimmed = withoutLeading.replace(/\/+$/, '');
  return trimmed ? `${trimmed}/*` : '';
}

export function useSelectedSubRoute(subRoutes: SubRoute[]): {
  index: number;
  route?: SubRoute;
  element?: JSX.Element;
} {
  const params = useParams();

  const routes = useMemo(
    () =>
      subRoutes.map(({ path, children }) => ({
        caseSensitive: false,
        path: normalizeRoutePath(path),
        element: children,
      })),
    [subRoutes],
  );

  const element = useRoutes(routes) ?? undefined;

  let currentRoute = params['*'] ?? '';
  if (!currentRoute.startsWith('/')) {
    currentRoute = `/${currentRoute}`;
  }

  const [matchedRoute] = matchRoutes(routes, currentRoute) ?? [];
  const foundIndex = matchedRoute
    ? routes.findIndex(r => r.path === matchedRoute.route.path)
    : -1;

  return {
    index: foundIndex,
    element,
    route: subRoutes[foundIndex],
  };
}

type EntityTabsProps = {
  routes: SubRoute[];
  groupDefinitions: EntityContentGroupDefinitions;
  defaultContentOrder?: 'title' | 'natural';
  showIcons?: boolean;
};

export function EntityTabs(props: EntityTabsProps) {
  const { routes, groupDefinitions, defaultContentOrder, showIcons } = props;

  const { index, route, element } = useSelectedSubRoute(routes);

  const tabs = useMemo(
    () =>
      routes.map(r => {
        const { path, title, group, icon } = r;
        let to = path;
        // Remove trailing /*
        to = to.replace(/\/\*$/, '');
        // And remove leading / for relative navigation
        to = to.replace(/^\//, '');
        return {
          group,
          id: path,
          path: to,
          label: title,
          icon,
        };
      }),
    [routes],
  );

  return (
    <>
      <EntityTabsList
        tabs={tabs}
        selectedIndex={index}
        showIcons={showIcons}
        groupDefinitions={groupDefinitions}
        defaultContentOrder={defaultContentOrder}
      />
      <EntityTabsPanel>
        <Helmet title={route?.title} />
        {element ?? <NotFoundErrorPage />}
      </EntityTabsPanel>
    </>
  );
}
