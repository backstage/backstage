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
import React, { useState } from 'react';
import { GraphVisualizer } from './GraphVisualizer';
import { TextVisualizer } from './TextVisualizer';
import { TreeVisualizer } from './TreeVisualizer';

export function AppVisualizerPage() {
  const appTreeApi = useApi(appTreeApiRef);
  const { tree } = appTreeApi.getTree();
  const [tab, setTab] = useState(0);

  const tabs = [
    { id: 'graph', label: 'Graph', element: <GraphVisualizer tree={tree} /> },
    { id: 'tree', label: 'Tree', element: <TreeVisualizer tree={tree} /> },
    { id: 'text', label: 'Text', element: <TextVisualizer tree={tree} /> },
  ];

  return (
    <Page themeId="tool">
      <Header title="App Visualizer" />
      <Content noPadding stretch>
        <Box display="flex" flexDirection="column" height="100%">
          <HeaderTabs tabs={tabs} selectedIndex={tab} onChange={setTab} />
          {tabs[tab].element}
        </Box>
      </Content>
    </Page>
  );
}
