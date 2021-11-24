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

import { Header, Page, RoutedTabs } from '@backstage/core-components';
import {
  attachComponentData,
  useElementFilter,
} from '@backstage/core-plugin-api';
import { TabProps } from '@material-ui/core';
import { default as React } from 'react';

// TODO: This layout could be a shared based component if it was possible to create custom TabbedLayouts
//    A generalized version of createSubRoutesFromChildren, etc. would be required

type SubRoute = {
  path: string;
  title: string;
  children: JSX.Element;
  tabProps?: TabProps<React.ElementType, { component?: React.ElementType }>;
};

const dataKey = 'plugin.explore.exploreLayoutRoute';

const Route: (props: SubRoute) => null = () => null;
attachComponentData(Route, dataKey, true);

// This causes all mount points that are discovered within this route to use the path of the route itself
attachComponentData(Route, 'core.gatherMountPoints', true);

type ExploreLayoutProps = {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
};

/**
 * Explore is a compound component, which allows you to define a custom layout
 *
 * @example
 * ```jsx
 * <ExploreLayout title="Explore ACME's ecosystem">
 *   <ExploreLayout.Route path="/example" title="Example tab">
 *     <div>This is rendered under /example/anything-here route</div>
 *   </ExploreLayout.Route>
 * </ExploreLayout>
 * ```
 */
export const ExploreLayout = ({
  title,
  subtitle,
  children,
}: ExploreLayoutProps) => {
  const routes = useElementFilter(children, elements =>
    elements
      .selectByComponentData({
        key: dataKey,
        withStrictError:
          'Child of ExploreLayout must be an ExploreLayout.Route',
      })
      .getElements<SubRoute>()
      .map(child => child.props),
  );

  return (
    <Page themeId="home">
      <Header
        title={title ?? 'Explore our ecosystem'}
        subtitle={subtitle ?? 'Discover solutions available in our ecosystem'}
      />
      <RoutedTabs routes={routes} />
    </Page>
  );
};

ExploreLayout.Route = Route;
