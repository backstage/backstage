/*
 * Copyright 2022 The Backstage Authors
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

/** @public */
export type SubRoute = {
  path: string;
  title: string;
  children: JSX.Element;
  tabProps?: TabProps<React.ElementType, { component?: React.ElementType }>;
};

const dataKey = 'plugin.devtools.devtoolsLayoutRoute';

const Route: (props: SubRoute) => null = () => null;
attachComponentData(Route, dataKey, true);

// This causes all mount points that are discovered within this route to use the path of the route itself
attachComponentData(Route, 'core.gatherMountPoints', true);

/** @public */
export type DevToolsLayoutProps = {
  children?: React.ReactNode;
};

/**
 * DevTools is a compound component, which allows you to define a custom layout
 *
 * @example
 * ```jsx
 * <DevToolsLayout>
 *   <DevToolsLayout.Route path="/example" title="Example tab">
 *     <div>This is rendered under /example/anything-here route</div>
 *   </DevToolsLayout.Route>
 * </DevToolsLayout>
 * ```
 * @public
 */
export const DevToolsLayout = ({ children }: DevToolsLayoutProps) => {
  const routes = useElementFilter(children, elements =>
    elements
      .selectByComponentData({
        key: dataKey,
        withStrictError:
          'Child of DevToolsLayout must be an DevToolsLayout.Route',
      })
      .getElements<SubRoute>()
      .map(child => child.props),
  );

  return (
    <Page themeId="home">
      <Header title="DevTools" />
      <RoutedTabs routes={routes} />
    </Page>
  );
};

DevToolsLayout.Route = Route;
