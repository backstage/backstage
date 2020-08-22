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
export const EntityPageTabs = ({ children }: { children: React.ReactNode }) => {
  const routes: PartialRouteObject[] = [];
  const tabs: Tab[] = [];
  const params = useParams();
  const navigate = useNavigate();

  React.Children.forEach(children, child => {
    if (!React.isValidElement(child)) {
      // Skip conditionals resolved to falses/nulls/undefineds etc
      return;
    }
    const pathAndId =
      (child as JSX.Element).props.path +
      ((child as JSX.Element).props.exact ? '' : '/*');
    routes.push({
      path: pathAndId,
      element: (child as JSX.Element).props.children,
    });
    tabs.push({
      id: pathAndId,
      label: (child as JSX.Element).props.title,
    });
  });

  // Add catch-all for incorrect sub-routes
  routes.push({
    path: '/*',
    element: <Navigate to="." />,
  });

  const [matchedRoute] =
    matchRoutes(routes as RouteObject[], `/${params['*']}`) ?? [];
  const selectedIndex = getSelectedIndex(matchedRoute, tabs);
  const currentTab = tabs[selectedIndex];
  const title = currentTab.label;

  const onTabChange = (index: number) => navigate(tabs[index].id.slice(1, -2));

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
};
type TabProps = {
  children: React.ReactNode;
  title: string;
  path: string;
  exact?: boolean;
};
EntityPageTabs.Tab = (_props: TabProps) => null;
