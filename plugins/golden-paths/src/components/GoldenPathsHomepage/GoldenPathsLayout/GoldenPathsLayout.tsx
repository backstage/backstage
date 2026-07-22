/*
 * Copyright 2026 The Backstage Authors
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
import { ElementType, PropsWithChildren } from 'react';

import { Header, Page, RoutedTabs } from '@backstage/core-components';
import {
  attachComponentData,
  useElementFilter,
} from '@backstage/core-plugin-api';
import { TabProps } from '@material-ui/core';

type GoldenPathsLayoutRouteProps = {
  path: string;
  title: string;
  children: JSX.Element;
  tabProps?: TabProps<ElementType, { component?: ElementType }>;
};

const DATA_KEY = 'plugin.goldenPaths.goldenPathsLayoutRoute';

type RouteComponent = (props: GoldenPathsLayoutRouteProps) => null;

const Route: RouteComponent = () => null;
attachComponentData(Route, DATA_KEY, true);
attachComponentData(Route, 'core.gatherMountPoints', true); // This causes all mount points that are discovered within this route to use the path of the route itself

export const GoldenPathsLayout = ({ children }: PropsWithChildren) => {
  const routes = useElementFilter(children, elements =>
    elements
      .selectByComponentData({
        key: DATA_KEY,
        withStrictError:
          'Child of GoldenPathsLayout must be an GoldenPathsLayout.Route',
      })
      .getElements<GoldenPathsLayoutRouteProps>()
      .map(child => child.props),
  );

  return (
    <Page themeId="home">
      <Header title="Golden Paths" />
      <RoutedTabs routes={routes} />
    </Page>
  );
};

GoldenPathsLayout.Route = Route;
