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
import Box from '@material-ui/core/Box';
import { useCallback, useEffect, useMemo } from 'react';
import { DetailedVisualizer } from './DetailedVisualizer';
import { TextVisualizer } from './TextVisualizer';
import { TreeVisualizer } from './TreeVisualizer';
import {
  matchRoutes,
  useLocation,
  useNavigate,
  useParams,
  useRoutes,
} from 'react-router-dom';

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

  const location = useLocation();
  const element = useRoutes(tabs, location);

  const currentPath = `/${useParams()['*']}`;
  const [matchedRoute] = matchRoutes(tabs, currentPath) ?? [];

  const currentTabIndex = matchedRoute
    ? tabs.findIndex(t => t.path === matchedRoute.route.path)
    : 0;

  const navigate = useNavigate();
  const handleTabChange = useCallback(
    (index: number) => {
      navigate(tabs[index].id);
    },
    [navigate, tabs],
  );

  useEffect(() => {
    if (!element) {
      navigate(tabs[0].path);
    }
  }, [element, navigate, tabs]);

  return (
    <Page themeId="tool">
      <Header title="App Visualizer" />
      <Content noPadding stretch>
        <Box display="flex" flexDirection="column" height="100%">
          <HeaderTabs
            tabs={tabs}
            selectedIndex={currentTabIndex}
            onChange={handleTabChange}
          />
          {element}
        </Box>
      </Content>
    </Page>
  );
}
