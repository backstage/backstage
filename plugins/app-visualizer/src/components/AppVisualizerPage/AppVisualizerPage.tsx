/*
 * Copyright 2023 The Backstage Authors
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

import { Content, Header, HeaderTabs, Page } from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';
import { appTreeApiRef } from '@backstage/frontend-plugin-api';
import { Flex } from '@backstage/ui';
import { useCallback, useEffect, useMemo } from 'react';
import { DetailedVisualizer } from './DetailedVisualizer';
import { TextVisualizer } from './TextVisualizer';
import { TreeVisualizer } from './TreeVisualizer';
import { matchRoutes, useNavigate, useParams } from 'react-router-dom';

export function AppVisualizerPage() {
  const appTreeApi = useApi(appTreeApiRef);
  const { tree } = appTreeApi.getTree();

  const tabs = useMemo(
    () => [
      {
        id: 'tree',
        path: 'tree',
        label: 'Tree',
        element: <TreeVisualizer tree={tree} />,
      },
      {
        id: 'detailed',
        path: 'detailed',
        label: 'Detailed',
        element: <DetailedVisualizer tree={tree} />,
      },
      {
        id: 'text',
        path: 'text',
        label: 'Text',
        element: <TextVisualizer tree={tree} />,
      },
    ],
    [tree],
  );

  const params = useParams();
  // When a splat (*) param exists, we're inside a * child route and need
  // to navigate up one route level before appending the tab path. Without
  // this, v7_relativeSplatPath causes relative links to resolve from the
  // full matched URL, duplicating segments on each tab click.
  const hasSplatParam = !!params['*'];

  const currentPath = `/${params['*'] ?? ''}`;
  const [matchedRoute] = matchRoutes(tabs, currentPath) ?? [];

  const currentTabIndex = matchedRoute
    ? tabs.findIndex(t => t.path === matchedRoute.route.path)
    : 0;

  const element = tabs[currentTabIndex]?.element ?? tabs[0]?.element;

  const navigate = useNavigate();
  const handleTabChange = useCallback(
    (index: number) => {
      const tabId = tabs[index].id;
      navigate(hasSplatParam ? `../${tabId}` : tabId);
    },
    [navigate, tabs, hasSplatParam],
  );

  useEffect(() => {
    if (!matchedRoute) {
      navigate(hasSplatParam ? `../${tabs[0].path}` : tabs[0].path, {
        replace: true,
      });
    }
  }, [matchedRoute, navigate, tabs, hasSplatParam]);

  return (
    <Page themeId="tool">
      <Header title="App Visualizer" />
      <Content noPadding stretch>
        <Flex direction="column" style={{ height: '100%' }}>
          <HeaderTabs
            tabs={tabs}
            selectedIndex={currentTabIndex}
            onChange={handleTabChange}
          />
          {element}
        </Flex>
      </Content>
    </Page>
  );
}
