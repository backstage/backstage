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

import {
  Header,
  Page,
  TabbedLayout,
  CodeSnippet,
} from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';
import { appTreeApiRef } from '@backstage/frontend-plugin-api';
import React from 'react';

export function AppVisualizerPage() {
  const appTreeApi = useApi(appTreeApiRef);
  const { tree } = appTreeApi.getTree();

  return (
    <Page themeId="tool">
      <Header title="App Visualizer" />
      <TabbedLayout>
        <TabbedLayout.Route path="/text" title="Text">
          <CodeSnippet
            text={String(tree.root)}
            language="sql"
            customStyle={{ margin: 0, padding: 0 }}
          />
        </TabbedLayout.Route>
      </TabbedLayout>
    </Page>
  );
}
