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
import React, { useMemo } from 'react';
import { Helmet } from 'react-helmet';
import {
  matchRoutes,
  useNavigate,
  useParams,
  useRoutes,
} from 'react-router-dom';
import { Content } from '../../layout/Content';
import { HeaderTabs } from '../../layout/HeaderTabs';
import { SubRoute } from './types';

export function useSelectedSubRoute(subRoutes: SubRoute[]): {
  index: number;
  route: SubRoute;
  element: JSX.Element;
} {
  const params = useParams();

  const routes = subRoutes.map(({ path, children }) => ({
    caseSensitive: false,
    path: `${path}/*`,
    element: children,
  }));

  // TODO: remove once react-router updated
  const sortedRoutes = routes.sort((a, b) =>
    // remove "/*" symbols from path end before comparing
    b.path.replace(/\/\*$/, '').localeCompare(a.path.replace(/\/\*$/, '')),
  );

  const element = useRoutes(sortedRoutes) ?? subRoutes[0].children;

  // TODO(Rugvip): Once we only support v6 stable we can always prefix
  // This avoids having a double / prefix for react-router v6 beta, which in turn breaks
  // the tab highlighting when using relative paths for the tabs.
  let currentRoute = params['*'] ?? '';
  if (!currentRoute.startsWith('/')) {
    currentRoute = `/${currentRoute}`;
  }

  const [matchedRoute] = matchRoutes(sortedRoutes, currentRoute) ?? [];
  const foundIndex = matchedRoute
    ? subRoutes.findIndex(t => `${t.path}/*` === matchedRoute.route.path)
    : 0;

  return {
    index: foundIndex === -1 ? 0 : foundIndex,
    element,
    route: subRoutes[foundIndex] ?? subRoutes[0],
  };
}

export function RoutedTabs(props: { routes: SubRoute[] }) {
  const { routes } = props;
  const navigate = useNavigate();
  const { index, route, element } = useSelectedSubRoute(routes);
  const headerTabs = useMemo(
    () =>
      routes.map(t => ({
        id: t.path,
        label: t.title,
        tabProps: t.tabProps,
      })),
    [routes],
  );

  const onTabChange = (tabIndex: number) => {
    let { path } = routes[tabIndex];
    // Remove trailing /*
    path = path.replace(/\/\*$/, '');
    // And remove leading / for relative navigation
    path = path.replace(/^\//, '');
    // Note! route resolves relative to the position in the React tree,
    // not relative to current location
    navigate(path);
  };
  return (
    <>
      <HeaderTabs
        tabs={headerTabs}
        selectedIndex={index}
        onChange={onTabChange}
      />
      <Content>
        <Helmet title={route.title} />
        {element}
      </Content>
    </>
  );
}
