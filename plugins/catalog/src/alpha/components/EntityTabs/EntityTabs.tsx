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
import { WarningPanel, Content } from '@backstage/core-components';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { EntityTabsPanel } from './EntityTabsPanel';
import { EntityTabsList } from './EntityTabsList';
import { EntityContentGroupDefinitions } from '@backstage/plugin-catalog-react/alpha';
import { catalogTranslationRef } from '../../translation';

type SubRoute = {
  group?: string;
  path: string;
  title: string;
  icon?: string | ReactElement;
  children: JSX.Element;
};

function normalizeRoutePath(path: string): string {
  const trimmed = path.replace(/^\/+|\/+$/g, '');
  return trimmed ? `${trimmed}/*` : '';
}

export function useSelectedSubRoute(subRoutes: SubRoute[]): {
  index: number;
  route?: SubRoute;
  element?: JSX.Element;
} {
  const params = useParams();

  const routes = subRoutes.map(({ path, children }) => ({
    caseSensitive: false,
    path: normalizeRoutePath(path),
    element: children,
  }));

  // Sort by descending path length so more specific paths match before shorter
  // prefixes; fall back to lexicographic order for stable output when lengths
  // are equal.
  const sortedRoutes = [...routes].sort((a, b) => {
    const aPath = a.path.replace(/\/\*$/, '');
    const bPath = b.path.replace(/\/\*$/, '');
    return bPath.length - aPath.length || aPath.localeCompare(bPath);
  });

  const element = useRoutes(sortedRoutes) ?? undefined;

  let currentRoute = params['*'] ?? '';
  if (!currentRoute.startsWith('/')) {
    currentRoute = `/${currentRoute}`;
  }

  const [matchedRoute] = matchRoutes(sortedRoutes, currentRoute) ?? [];
  const foundIndex = matchedRoute
    ? subRoutes.findIndex(
        t => normalizeRoutePath(t.path) === matchedRoute.route.path,
      )
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
  const { t } = useTranslationRef(catalogTranslationRef);

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
        {element ?? (
          <Content>
            <WarningPanel
              title={t('entityTabs.notFoundTitle')}
              message={t('entityTabs.notFoundMessage')}
            />
          </Content>
        )}
      </EntityTabsPanel>
    </>
  );
}
