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

import type { ApiEntityV1alpha1 } from './ApiEntityV1alpha1';
import {
  AiModelServerApiEntity,
  aiModelServerApiEntityValidator,
  isAiModelServerApiEntity,
} from './AiModelServerApiEntity';

describe('aiModelServerApiEntityValidator', () => {
  let entity: AiModelServerApiEntity;

  beforeEach(() => {
    entity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'API',
      metadata: { name: 'test-ai-model-server' },
      spec: {
        type: 'ai-model-server',
        lifecycle: 'experimental',
        owner: 'backstage',
        serverType: 'openai-v1',
        serverUrl: 'https://api.openai.com/v1',
      },
    };
  });

  it('accepts a valid ai-model-server entity with required fields only', async () => {
    await expect(aiModelServerApiEntityValidator.check(entity)).resolves.toBe(
      true,
    );
  });

  it('accepts v1beta1', async () => {
    entity.apiVersion = 'backstage.io/v1beta1';
    await expect(aiModelServerApiEntityValidator.check(entity)).resolves.toBe(
      true,
    );
  });

  it('accepts a fully populated entity with all optional fields', async () => {
    entity.spec = {
      ...entity.spec,
      requiresApiKey: true,
      apiEntityRef: 'api:default/openai-spec',
      models: {
        discoverable: true,
        available: ['gpt-4o', 'gpt-4o-mini'],
        default: 'gpt-4o',
      },
    };
    await expect(aiModelServerApiEntityValidator.check(entity)).resolves.toBe(
      true,
    );
  });

  it('accepts entity with models struct containing only discoverable', async () => {
    entity.spec.models = { discoverable: true };
    await expect(aiModelServerApiEntityValidator.check(entity)).resolves.toBe(
      true,
    );
  });

  it('accepts entity with requiresApiKey set to false', async () => {
    entity.spec.requiresApiKey = false;
    await expect(aiModelServerApiEntityValidator.check(entity)).resolves.toBe(
      true,
    );
  });

  it('rejects wrong spec.type value', async () => {
    (entity as any).spec.type = 'openapi';
    await expect(aiModelServerApiEntityValidator.check(entity)).rejects.toThrow(
      /type/,
    );
  });

  it('rejects missing serverType', async () => {
    delete (entity as any).spec.serverType;
    await expect(aiModelServerApiEntityValidator.check(entity)).rejects.toThrow(
      /serverType/,
    );
  });

  it('rejects missing serverUrl', async () => {
    delete (entity as any).spec.serverUrl;
    await expect(aiModelServerApiEntityValidator.check(entity)).rejects.toThrow(
      /serverUrl/,
    );
  });

  it('rejects empty serverType', async () => {
    (entity as any).spec.serverType = '';
    await expect(aiModelServerApiEntityValidator.check(entity)).rejects.toThrow(
      /serverType/,
    );
  });

  it('rejects empty serverUrl', async () => {
    (entity as any).spec.serverUrl = '';
    await expect(aiModelServerApiEntityValidator.check(entity)).rejects.toThrow(
      /serverUrl/,
    );
  });
});

describe('isAiModelServerApiEntity', () => {
  it('returns true for an ai-model-server entity', () => {
    const entity: AiModelServerApiEntity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'API',
      metadata: { name: 'openai' },
      spec: {
        type: 'ai-model-server',
        lifecycle: 'production',
        owner: 'me',
        serverType: 'openai-v1',
        serverUrl: 'https://api.openai.com/v1',
      },
    };
    expect(isAiModelServerApiEntity(entity)).toBe(true);
  });

  it('returns false for a non-ai-model-server API entity', () => {
    const entity: ApiEntityV1alpha1 = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'API',
      metadata: { name: 'a' },
      spec: {
        type: 'openapi',
        lifecycle: 'production',
        owner: 'me',
        definition: 'x',
      },
    };
    expect(isAiModelServerApiEntity(entity)).toBe(false);
  });
});
