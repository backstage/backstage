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

import lodash from 'lodash';
import { compileCatalogModel } from '../model/compileCatalogModel';
import { defaultCatalogEntityModel } from '../model/defaultCatalogEntityModel';
import { mcpServerApiEntityModel } from './McpServerApiEntity';
import { aiModelServerApiEntityModel } from './AiModelServerApiEntity';

describe('apiEntityModel mcp-server dispatch', () => {
  const model = compileCatalogModel([
    defaultCatalogEntityModel,
    mcpServerApiEntityModel,
  ]);

  it('routes mcp-server and non-mcp-server v1alpha1 entities to different schemas', () => {
    const mcp = model.getKind({
      kind: 'API',
      apiVersion: 'backstage.io/v1alpha1',
      spec: { type: 'mcp-server' },
    });
    const openapi = model.getKind({
      kind: 'API',
      apiVersion: 'backstage.io/v1alpha1',
      spec: { type: 'openapi' },
    });

    expect(mcp).toBeDefined();
    expect(openapi).toBeDefined();
    expect(mcp!.description).not.toBe(openapi!.description);

    const mcpSpecRequired = lodash.get(
      mcp,
      'jsonSchema.properties.spec.required',
    );
    const openapiSpecRequired = lodash.get(
      openapi,
      'jsonSchema.properties.spec.required',
    );

    expect(mcpSpecRequired).toContain('remotes');
    expect(mcpSpecRequired).not.toContain('definition');
    expect(openapiSpecRequired).toContain('definition');
    expect(openapiSpecRequired).not.toContain('remotes');
  });

  it('routes mcp-server under v1beta1 too', () => {
    const mcp = model.getKind({
      kind: 'API',
      apiVersion: 'backstage.io/v1beta1',
      spec: { type: 'mcp-server' },
    });
    expect(mcp).toBeDefined();
    const required = lodash.get(mcp, 'jsonSchema.properties.spec.required');
    expect(required).toContain('remotes');
  });
});

describe('apiEntityModel ai-model-server dispatch', () => {
  const model = compileCatalogModel([
    defaultCatalogEntityModel,
    mcpServerApiEntityModel,
    aiModelServerApiEntityModel,
  ]);

  it('routes ai-model-server, mcp-server, and openapi to different schemas', () => {
    const aiModelServer = model.getKind({
      kind: 'API',
      apiVersion: 'backstage.io/v1alpha1',
      spec: { type: 'ai-model-server' },
    });
    const mcp = model.getKind({
      kind: 'API',
      apiVersion: 'backstage.io/v1alpha1',
      spec: { type: 'mcp-server' },
    });
    const openapi = model.getKind({
      kind: 'API',
      apiVersion: 'backstage.io/v1alpha1',
      spec: { type: 'openapi' },
    });

    expect(aiModelServer).toBeDefined();
    expect(mcp).toBeDefined();
    expect(openapi).toBeDefined();

    expect(aiModelServer!.description).not.toBe(openapi!.description);
    expect(aiModelServer!.description).not.toBe(mcp!.description);

    const aiModelServerSpecRequired = lodash.get(
      aiModelServer,
      'jsonSchema.properties.spec.required',
    );
    expect(aiModelServerSpecRequired).toContain('remotes');
    expect(aiModelServerSpecRequired).not.toContain('definition');
  });

  it('routes ai-model-server under v1beta1 too', () => {
    const aiModelServer = model.getKind({
      kind: 'API',
      apiVersion: 'backstage.io/v1beta1',
      spec: { type: 'ai-model-server' },
    });
    expect(aiModelServer).toBeDefined();
    const required = lodash.get(
      aiModelServer,
      'jsonSchema.properties.spec.required',
    );
    expect(required).toContain('remotes');
  });
});
