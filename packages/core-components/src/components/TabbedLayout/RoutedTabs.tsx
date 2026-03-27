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
import { Helmet } from 'react-helmet';
import { matchRoutes, useParams, useRoutes } from 'react-router-dom';
import { Content } from '../../layout/Content';
import { ShadcnTabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { cn } from '../../lib/utils';
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

  const element = useRoutes(sortedRoutes) ?? subRoutes[0]?.children;

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
  const { index, route, element } = useSelectedSubRoute(routes);
  const currentTabValue = routes[index]?.path ?? routes[0]?.path ?? '';

  return (
    <>
      {/*
       * The outer wrapper div must carry [grid-area:pageSubheader] because it
       * is a direct child of the Page CSS grid.  Previously the grid-area was
       * placed on TabsList (a grandchild), which has no effect on the parent
       * grid — causing the ShadcnTabs block to be auto-placed into the first
       * implicit column and forcing the "auto" column to expand to the full
       * tab-bar text width, squeezing pageContent to near-zero on narrow
       * viewports (Issues #6 / #7).
       *
       * overflow-x-auto + min-w-0 allow the tab bar to scroll horizontally on
       * small screens instead of pushing the page grid columns out of bounds.
       */}
      <div className="[grid-area:pageSubheader] min-w-0 overflow-x-auto">
        <ShadcnTabs value={currentTabValue}>
          <TabsList
            className={cn(
              'bg-transparent h-auto w-full justify-start',
              'rounded-none border-b border-border p-0',
            )}
          >
            {routes.map(t => {
              const { path, title, tabProps } = t;
              let to = path;
              // Remove trailing /*
              to = to.replace(/\/\*$/, '');
              // And remove leading / for relative navigation
              to = to.replace(/^\//, '');
              const { className: tabClassName, ...restTabProps } =
                tabProps ?? {};
              return (
                <TabsTrigger
                  key={path}
                  {...restTabProps}
                  value={path}
                  asChild
                  className={cn(
                    'rounded-none border-b-2 border-transparent px-3 py-3',
                    'text-xs font-bold uppercase text-muted-foreground',
                    'shadow-none transition-colors whitespace-nowrap',
                    'data-[state=active]:border-primary',
                    'data-[state=active]:bg-transparent',
                    'data-[state=active]:text-foreground',
                    'data-[state=active]:shadow-none',
                    'hover:text-foreground',
                    tabClassName,
                  )}
                >
                  <Link to={to}>{title}</Link>
                </TabsTrigger>
              );
            })}
          </TabsList>
          {/*
           * Hidden TabsContent elements satisfy the dangling aria-controls
           * references that Radix auto-generates on each TabsTrigger.
           * Without these, assistive technology follows aria-controls to a
           * non-existent DOM id. forceMount keeps them in the DOM; the hidden
           * attribute keeps them invisible and out of the accessibility tree
           * so that the real (route-rendered) content below is read instead.
           */}
          {routes.map(t => (
            <TabsContent
              key={`panel-${t.path}`}
              value={t.path}
              forceMount
              hidden
              className="hidden"
            />
          ))}
        </ShadcnTabs>
      </div>
      <Content>
        <Helmet title={route?.title} />
        {element}
      </Content>
    </>
  );
}
