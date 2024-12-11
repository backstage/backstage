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

import { createApp } from '@backstage/frontend-defaults';
import apiDocsPlugin from '@backstage/plugin-api-docs/alpha';
import appVisualizerPlugin from '@backstage/plugin-app-visualizer';
import catalogPlugin from '@backstage/plugin-catalog/alpha';
import catalogGraphPlugin from '@backstage/plugin-catalog-graph/alpha';
import catalogImportPlugin from '@backstage/plugin-catalog-import/alpha';
import homePlugin from '@backstage/plugin-home/alpha';
import kubernetesPlugin from '@backstage/plugin-kubernetes/alpha';
import orgPlugin from '@backstage/plugin-org/alpha';
import scaffolderPlugin from '@backstage/plugin-scaffolder/alpha';
import searchPlugin from '@backstage/plugin-search/alpha';
import techdocsPlugin from '@backstage/plugin-techdocs/alpha';
import userSettingsPlugin from '@backstage/plugin-user-settings/alpha';

import { createFrontendModule, PageBlueprint } from '@backstage/frontend-plugin-api';
import { Navigate } from 'react-router';


// This just defaults to `/catalog` instead of a blank page
const defaultPageExtension = PageBlueprint.make({
  name: 'default',
  params: {
    defaultPath: '/',
    loader: () => Promise.resolve(<Navigate to="catalog" />),
  },
});

const app = createApp({
  features: [
    searchPlugin,
    orgPlugin,
    catalogPlugin,
    apiDocsPlugin,
    techdocsPlugin,
    scaffolderPlugin,
    homePlugin,
    kubernetesPlugin,
    catalogGraphPlugin,
    catalogImportPlugin,
    appVisualizerPlugin,
    userSettingsPlugin,
    createFrontendModule({
      pluginId: 'app',
      extensions: [
        defaultPageExtension
      ],
    }),
  ],
});

export default app.createRoot();
