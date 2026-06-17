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
  McpServerApiEntity,
  mcpServerApiEntityValidator,
  isMcpServerApiEntity,
} from './McpServerApiEntity';

describe('mcpServerApiEntityValidator', () => {
  let entity: McpServerApiEntity;

  beforeEach(() => {
    entity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'API',
      metadata: { name: 'test-mcp' },
      spec: {
        type: 'mcp-server',
        lifecycle: 'experimental',
        owner: 'backstage',
        remotes: [
          {
            type: 'streamable-http',
            url: 'http://localhost:7007/api/mcp',
          },
        ],
      },
    };
  });

  it('accepts a valid mcp-server entity', async () => {
    await expect(mcpServerApiEntityValidator.check(entity)).resolves.toBe(true);
  });

  it('accepts v1beta1', async () => {
    entity.apiVersion = 'backstage.io/v1beta1';
    await expect(mcpServerApiEntityValidator.check(entity)).resolves.toBe(true);
  });

  it('rejects wrong spec.type value', async () => {
    (entity as any).spec.type = 'openapi';
    await expect(mcpServerApiEntityValidator.check(entity)).rejects.toThrow(
      /type/,
    );
  });

  it('rejects missing remotes', async () => {
    delete (entity as any).spec.remotes;
    await expect(mcpServerApiEntityValidator.check(entity)).rejects.toThrow(
      /remotes/,
    );
  });

  it('rejects empty remotes array', async () => {
    (entity as any).spec.remotes = [];
    await expect(mcpServerApiEntityValidator.check(entity)).rejects.toThrow(
      /remotes/,
    );
  });

  it('rejects remote missing url', async () => {
    (entity as any).spec.remotes[0] = { type: 'stdio' };
    await expect(mcpServerApiEntityValidator.check(entity)).rejects.toThrow(
      /url/,
    );
  });

  it('rejects remote missing type', async () => {
    (entity as any).spec.remotes[0] = { url: 'http://x' };
    await expect(mcpServerApiEntityValidator.check(entity)).rejects.toThrow(
      /type/,
    );
  });
});

describe('isMcpServerApiEntity', () => {
  it('returns true for an mcp-server entity', () => {
    const entity: McpServerApiEntity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'API',
      metadata: { name: 'm' },
      spec: {
        type: 'mcp-server',
        lifecycle: 'production',
        owner: 'me',
        remotes: [{ type: 'stdio', url: 'cmd' }],
      },
    };
    expect(isMcpServerApiEntity(entity)).toBe(true);
  });

  it('returns false for a non-mcp-server API entity', () => {
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
    expect(isMcpServerApiEntity(entity)).toBe(false);
  });
});
