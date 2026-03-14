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

import { ApiEntityV1alpha1, ApiEntityV1alpha2 } from '@backstage/catalog-model';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import { ApiDocsConfig, apiDocsConfigRef } from '../../config';
import { ApiDefinitionDialog } from './ApiDefinitionDialog';

describe('<ApiDefinitionDialog />', () => {
  const apiDocsConfig: jest.Mocked<ApiDocsConfig> = {
    getApiDefinitionWidget: jest.fn(),
  } as any;

  afterEach(() => jest.resetAllMocks());

  it('renders empty state for v1alpha2 mcp-server entities', async () => {
    const entity: ApiEntityV1alpha2 = {
      apiVersion: 'backstage.io/v1alpha2',
      kind: 'API',
      metadata: {
        name: 'my-mcp-server',
        title: 'My MCP Server',
      },
      spec: {
        type: 'mcp-server',
        lifecycle: 'production',
        owner: 'team-a',
        remotes: [
          { type: 'streamable-http', url: 'http://localhost:7007/api/mcp' },
        ],
      },
    };

    const { getByText } = await renderInTestApp(
      <TestApiProvider apis={[[apiDocsConfigRef, apiDocsConfig]]}>
        <ApiDefinitionDialog entity={entity} open onClose={() => {}} />
      </TestApiProvider>,
    );

    expect(getByText(/My MCP Server/i)).toBeInTheDocument();
    expect(getByText(/No API definition available/i)).toBeInTheDocument();
  });

  it('renders definition widget for v1alpha1 entities', async () => {
    const entity: ApiEntityV1alpha1 = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'API',
      metadata: {
        name: 'my-api',
        title: 'My API',
      },
      spec: {
        type: 'openapi',
        lifecycle: 'production',
        owner: 'team-a',
        definition: 'openapi: "3.0.0"',
      },
    };

    apiDocsConfig.getApiDefinitionWidget.mockReturnValue({
      type: 'openapi',
      title: 'OpenAPI',
      rawLanguage: 'yaml',
      component: definition => <div>Rendered: {definition}</div>,
    });

    const { getByText } = await renderInTestApp(
      <TestApiProvider apis={[[apiDocsConfigRef, apiDocsConfig]]}>
        <ApiDefinitionDialog entity={entity} open onClose={() => {}} />
      </TestApiProvider>,
    );

    expect(getByText(/My API/i)).toBeInTheDocument();
    expect(getByText(/Rendered: openapi: "3.0.0"/)).toBeInTheDocument();
  });
});
