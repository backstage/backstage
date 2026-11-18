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

/**
 * Tool permission composition for the managed AI service: one basic
 * permission per declared tool, named by the shared tool permission-name
 * encoding (`ai.tool.<server>.<tool>.use`), deduplicated, and mapped back
 * to authorize requests under the caller's credentials. The service-side
 * enforcement (the guarded, journaled tool dispatch) is covered by
 * @backstage/ai-node's suite.
 */
import type { BackstageCredentials } from '@backstage/backend-plugin-api';
import { toolPermissionName } from '@backstage/ai-node/alpha';
import { createToolPermissions } from './createToolPermissions';

const CREDENTIALS = { principal: { type: 'user' } } as BackstageCredentials;

type RegistryLike = { addPermissions: (permissions: unknown[]) => void };

function registry() {
  const added: unknown[] = [];
  return {
    added,
    service: {
      addPermissions: (permissions: unknown[]) => {
        added.push(...permissions);
      },
    } as RegistryLike,
  };
}

describe('createToolPermissions', () => {
  it('registers one basic permission per tool, named by the shared encoding', () => {
    const reg = registry();
    createToolPermissions({
      tools: [
        { serverId: 'example-tools', toolName: 'search' },
        { serverId: 'example-tools', toolName: 'fetch' },
      ],
      authorizer: { authorize: async () => [] },
      registry: reg.service,
    });
    expect(reg.added).toEqual([
      {
        type: 'basic',
        name: 'ai.tool.example-tools.search.use',
        attributes: {},
      },
      {
        type: 'basic',
        name: 'ai.tool.example-tools.fetch.use',
        attributes: {},
      },
    ]);
  });

  it('deduplicates tools that encode to the same permission name', () => {
    const reg = registry();
    createToolPermissions({
      // A server id and tool name pair that collide after encoding: the
      // dot in 'a.b' encodes to %2E, so these two identities are the same
      // permission only when the encoding says so — distinct here.
      tools: [
        { serverId: 'example-tools', toolName: 'search' },
        { serverId: 'example-tools', toolName: 'search' },
      ],
      authorizer: { authorize: async () => [] },
      registry: reg.service,
    });
    expect(reg.added).toHaveLength(1);
  });

  it('maps authorize requests to the registered permissions under the caller credentials', async () => {
    const reg = registry();
    const authorize = jest.fn(
      async () => [{ result: 'ALLOW' }, { result: 'DENY' }] as never,
    );
    const tools = createToolPermissions({
      tools: [
        { serverId: 'example-tools', toolName: 'search' },
        { serverId: 'example-tools', toolName: 'fetch' },
      ],
      authorizer: { authorize },
      registry: reg.service,
    });
    const decisions = await tools.authorize(CREDENTIALS, [
      { serverId: 'example-tools', toolName: 'search' },
      { serverId: 'example-tools', toolName: 'fetch' },
    ]);
    expect(decisions).toEqual([{ result: 'ALLOW' }, { result: 'DENY' }]);
    expect(authorize).toHaveBeenCalledWith(
      [
        {
          permission: {
            type: 'basic',
            name: 'ai.tool.example-tools.search.use',
            attributes: {},
          },
          credentials: CREDENTIALS,
        },
        {
          permission: {
            type: 'basic',
            name: 'ai.tool.example-tools.fetch.use',
            attributes: {},
          },
          credentials: CREDENTIALS,
        },
      ],
      { credentials: CREDENTIALS },
    );
  });

  it('skips identities that were never registered', async () => {
    const reg = registry();
    const authorize = jest.fn(async () => [{ result: 'ALLOW' }] as never);
    const tools = createToolPermissions({
      tools: [{ serverId: 'example-tools', toolName: 'search' }],
      authorizer: { authorize },
      registry: reg.service,
    });
    const decisions = await tools.authorize(CREDENTIALS, [
      { serverId: 'other-tools', toolName: 'search' },
    ]);
    expect(decisions).toEqual([]);
    expect(authorize).not.toHaveBeenCalled();
  });

  it('exposes the shared permission-name encoding', () => {
    const reg = registry();
    const tools = createToolPermissions({
      tools: [],
      authorizer: { authorize: async () => [] },
      registry: reg.service,
    });
    expect(tools.toolPermissionName).toBe(toolPermissionName);
    expect(tools.toolPermissionName({ serverId: 's', toolName: 't' })).toBe(
      'ai.tool.s.t.use',
    );
  });
});
