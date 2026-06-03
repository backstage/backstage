/*
 * Copyright 2025 The Backstage Authors
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
  createFrontendPlugin,
  discoveryApiRef,
  fetchApiRef,
  ApiBlueprint,
  PageBlueprint,
} from '@backstage/frontend-plugin-api';
import { mcpActionsApiRef, McpActionsClient } from '../api/McpActionsClient';
import { secretsFormRouteRef } from '../routes';

const mcpActionsApi = ApiBlueprint.make({
  params: defineParams =>
    defineParams({
      api: mcpActionsApiRef,
      deps: {
        discoveryApi: discoveryApiRef,
        fetchApi: fetchApiRef,
      },
      factory: ({ discoveryApi, fetchApi }) =>
        new McpActionsClient({ discoveryApi, fetchApi }),
    }),
});

const secretsFormPage = PageBlueprint.make({
  params: {
    path: '/mcp-actions/secrets/:elicitationId',
    routeRef: secretsFormRouteRef,
    title: 'Provide Credentials',
    loader: () =>
      import('../components/SecretsFormPage/SecretsFormPage').then(m => (
        <m.SecretsFormPage />
      )),
  },
});

/** @alpha */
export default createFrontendPlugin({
  pluginId: 'mcp-actions',
  info: { packageJson: () => import('../../package.json') },
  routes: {
    secretsForm: secretsFormRouteRef,
  },
  extensions: [mcpActionsApi, secretsFormPage],
});
