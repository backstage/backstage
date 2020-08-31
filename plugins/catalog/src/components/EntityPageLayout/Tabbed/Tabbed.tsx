/*
 * Copyright 2020 Spotify AB
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
import {
  useParams,
  useNavigate,
  PartialRouteObject,
  matchRoutes,
  RouteObject,
  useRoutes,
  Navigate,
  RouteMatch,
} from 'react-router';
import { Tab, HeaderTabs, Content } from '@backstage/core';
import { Grid } from '@material-ui/core';
import { Helmet } from 'react-helmet';

const getSelectedIndex = (matchedRoute: RouteMatch, tabs: Tab[]) => {
  if (!matchedRoute) return 0;
  const tabIndex = tabs.findIndex(t => t.id === matchedRoute.route.path);
  return ~tabIndex ? tabIndex : 0;
};

/**
 * Compound component, which allows you to define layout
 * for EntityPage using Tabs as a subnavigation mechanism
 * Constists of 2 parts: Tabbed.Layout and Tabbed.Content.
 * Takes care of: tabs, routes, document titles, spacing around content
 *
 * @example
 * ```jsx
 * <Tabbed.Layout>
 *   <Tabbed.Content
 *      title="Example tab"
 *      route="/example/*"
 *      element={<div>This is rendered under /example/anything-here route</div>}
 *   />
 * </TabbedLayout>
 * ```
 */
export const Tabbed = {
  Layout: ({ children }: { children: React.ReactNode }) => {
    const routes: PartialRouteObject[] = [];
    const tabs: Tab[] = [];
    const params = useParams();
    const navigate = useNavigate();

    React.Children.forEach(children, child => {
      if (!React.isValidElement(child)) {
        // Skip conditionals resolved to falses/nulls/undefineds etc
        return;
      }
      const pathAndId = (child as JSX.Element).props.path;

      // Child here must be then always a functional component without any wrappers
      tabs.push({
        id: pathAndId,
        label: (child as JSX.Element).props.title,
      });

      routes.push({
        path: pathAndId,
        element: child.props.element,
      });
    });

    // Add catch-all for incorrect sub-routes
    if ((routes?.[0]?.path ?? '') !== '')
      routes.push({
        path: '/*',
        element: <Navigate to={routes[0].path!} />,
      });

    const [matchedRoute] =
      matchRoutes(routes as RouteObject[], `/${params['*']}`) ?? [];
    const selectedIndex = getSelectedIndex(matchedRoute, tabs);
    const currentTab = tabs[selectedIndex];
    const title = currentTab.label;

    const onTabChange = (index: number) =>
      navigate(tabs[index].id.replace(/\/\*$/g, ''));

    const currentRouteElement = useRoutes(routes);

    return (
      <>
        <HeaderTabs
          tabs={tabs}
          selectedIndex={selectedIndex}
          onChange={onTabChange}
        />
        <Content>
          <Grid container spacing={3}>
            <Helmet title={title} />
            {currentRouteElement}
          </Grid>
        </Content>
      </>
    );
  },
  Content: (_props: { path: string; title: string; element: JSX.Element }) =>
    null,
};
