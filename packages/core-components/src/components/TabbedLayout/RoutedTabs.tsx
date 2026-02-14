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
import { useMemo } from 'react';
import { Helmet } from 'react-helmet';
import {
  matchRoutes,
  useParams,
  useResolvedPath,
  useRoutes,
} from 'react-router-dom';
import { Content } from '../../layout/Content';
import { HeaderTabs } from '../../layout/HeaderTabs';
import { SubRoute } from './types';
import { Link } from '../Link';

export function useSelectedSubRoute(subRoutes: SubRoute[]): {
  index: number;
  route?: SubRoute;
  element?: JSX.Element;
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

  // useRoutes provides proper nested route context needed by child
  // components that contain their own <Routes>. It returns null in NFS
  // v7 contexts where the parent Outlet structure prevents matching.
  const useRoutesElement = useRoutes(sortedRoutes);

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

  const idx = foundIndex === -1 ? 0 : foundIndex;

  return {
    index: idx,
    // Prefer useRoutes result when available (provides nested route context
    // for child components). Fall back to direct rendering for NFS/v7
    // contexts where useRoutes returns null.
    element:
      useRoutesElement ?? subRoutes[idx]?.children ?? subRoutes[0]?.children,
    route: subRoutes[idx] ?? subRoutes[0],
  };
}

export function RoutedTabs(props: { routes: SubRoute[] }) {
  const { routes } = props;
  const params = useParams();
  const resolvedDot = useResolvedPath('.');
  const splatParam = params['*'] ?? '';
  // Detect whether v7_relativeSplatPath is active. When enabled, resolving
  // '.' inside a * child route includes the splat value in the path (e.g.
  // '/devtools/info'). Without the flag, '.' resolves to the parent route
  // path only (e.g. '/devtools'). We only need the ../ prefix when the v7
  // behavior is active, so that the link navigates up from the splat child
  // before appending the new tab path.
  const hasSplatParam =
    splatParam.length > 0 && resolvedDot.pathname.endsWith(`/${splatParam}`);

  const { index, route, element } = useSelectedSubRoute(routes);
  const headerTabs = useMemo(
    () =>
      routes.map(t => {
        const { path, title, tabProps } = t;
        let to = path;
        // Remove trailing /*
        to = to.replace(/\/\*$/, '');
        // And remove leading / for relative navigation
        to = to.replace(/^\//, '');
        if (hasSplatParam) {
          // Navigate up from the * child route to the parent before
          // appending the tab path, so that relative links resolve
          // correctly with v7_relativeSplatPath enabled.
          to = to ? `../${to}` : '..';
        } else {
          to = to || '.';
        }
        return {
          id: path,
          label: title,
          tabProps: {
            component: Link,
            to,
            ...tabProps,
          },
        };
      }),
    [routes, hasSplatParam],
  );

  return (
    <>
      <HeaderTabs tabs={headerTabs} selectedIndex={index} />
      <Content>
        <Helmet title={route?.title} />
        {element}
      </Content>
    </>
  );
}
