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

import { mockCredentials } from '@backstage/backend-test-utils';
import type { PermissionsService } from '@backstage/backend-plugin-api';
import {
  createModelPermissions,
  modelPermissionName,
} from './modelPermissions';

describe('model permissions', () => {
  it('encodes canonical pairs without collisions or Unicode normalization', () => {
    expect(modelPermissionName({ provider: 'a.b', modelId: 'm/% é' })).toBe(
      'ai.model.a%2Eb.m%2F%25%20%C3%A9.use',
    );
    expect(modelPermissionName({ provider: 'a', modelId: 'b.c' })).not.toBe(
      modelPermissionName({ provider: 'a.b', modelId: 'c' }),
    );
    expect(modelPermissionName({ provider: 'A', modelId: 'é' })).not.toBe(
      modelPermissionName({ provider: 'a', modelId: 'e\u0301' }),
    );
    for (const pair of [
      { provider: '', modelId: 'm' },
      { provider: 'p', modelId: '' },
      { provider: '\ud800', modelId: 'm' },
      { provider: 'p', modelId: '\udfff' },
    ]) {
      expect(() => modelPermissionName(pair)).toThrow();
    }
  });

  it('registers canonical pairs and filters with original caller authority on every call', async () => {
    const user = mockCredentials.user('user:default/alice');
    const restricted = mockCredentials.service('external:ci');
    const selected = 'ai.model.openai.gpt%2E4.use';
    const authorize = jest.fn(
      async (
        requests: Parameters<PermissionsService['authorize']>[0],
        { credentials }: Parameters<PermissionsService['authorize']>[1],
      ) => {
        if (credentials !== user && credentials !== restricted)
          throw Error('unknown caller');
        return requests.map(({ permission }) => ({
          result: permission.name === selected ? 'ALLOW' : 'DENY',
        }));
      },
    ) as unknown as jest.MockedFunction<PermissionsService['authorize']>;
    const addPermissions = jest.fn();
    const source = [
      { provider: 'openai', modelId: 'gpt.4' },
      { provider: 'anthropic', modelId: 'claude' },
      { provider: 'openai', modelId: 'gpt.4' },
    ];
    const permissions = createModelPermissions({
      models: source,
      authorizer: { authorize },
      registry: { addPermissions },
    });
    expect(addPermissions).toHaveBeenCalledWith([
      { type: 'basic', name: selected, attributes: {} },
      { type: 'basic', name: 'ai.model.anthropic.claude.use', attributes: {} },
    ]);
    source[0].modelId = 'substitution';
    expect(await permissions.listModels(user)).toEqual([
      { provider: 'openai', modelId: 'gpt.4' },
    ]);
    expect(await permissions.listProviders(restricted)).toEqual(['openai']);
    expect(
      await permissions.canUse(
        { provider: 'openai', modelId: 'gpt.4' },
        restricted,
      ),
    ).toBe(true);
    expect(
      await permissions.canUse(
        { provider: 'openai', modelId: '*' },
        restricted,
      ),
    ).toBe(false);
    expect(
      authorize.mock.calls.map(([, options]) => options.credentials),
    ).toEqual([user, restricted, restricted]);
    authorize.mockResolvedValueOnce([]);
    await expect(permissions.listModels(user)).rejects.toThrow(
      'Invalid model permission decisions',
    );
    authorize.mockRejectedValueOnce(new Error('unavailable'));
    await expect(permissions.listModels(user)).rejects.toThrow('unavailable');
  });

  it("reports catalog descriptors, frozen, filtered by the caller's own authority", async () => {
    const user = mockCredentials.user('user:default/alice');
    const openaiName = 'ai.model.openai.gpt%2E5.use';
    const authorize = jest.fn(
      async (requests: Parameters<PermissionsService['authorize']>[0]) =>
        requests.map(({ permission }) => ({
          result: permission.name === openaiName ? 'ALLOW' : 'DENY',
        })),
    ) as unknown as jest.MockedFunction<PermissionsService['authorize']>;
    const descriptor = {
      provider: 'openai',
      modelId: 'gpt.5',
      api: 'openai-responses',
      type: 'chat',
      contextWindow: 400_000,
      maxTokens: 128_000,
    };
    const permissions = createModelPermissions({
      models: [
        descriptor,
        // An image model carries no context window; the descriptor keeps
        // the entry's own shape.
        {
          provider: 'openrouter',
          modelId: 'flux',
          api: 'openai-completions',
          type: 'image',
          maxTokens: 4096,
        },
      ],
      authorizer: { authorize },
      registry: { addPermissions: jest.fn() },
    });
    const listed = await permissions.listModels(user);
    expect(listed).toEqual([descriptor]);
    // The caller cannot mutate the discovery result or its source.
    expect(Object.isFrozen(listed[0])).toBe(true);
    expect(() => {
      (listed[0] as { modelId: string }).modelId = 'substituted';
    }).toThrow();
    descriptor.modelId = 'substitution';
    expect((await permissions.listModels(user))[0].modelId).toBe('gpt.5');
    // The authorization asked for exact names under the caller's own
    // credentials, one request per registered pair — the first listModels
    // call, before the mutation re-check call.
    const requested = authorize.mock.calls[0][0]
      .map(({ permission }) => permission.name)
      .sort();
    expect(requested).toEqual([
      'ai.model.openai.gpt%2E5.use',
      'ai.model.openrouter.flux.use',
    ]);
  });

  it('round-trips the documented policy-author decoding exactly', async () => {
    // The README documents this decode for policy authors; this pins the
    // documented algorithm against the encoder for the tricky cases.
    const decode = (segment: string) =>
      decodeURIComponent(segment.replace(/%2E/g, '.'));
    const decodeName = (name: string) => {
      const parts = name.split('.');
      if (
        parts.length !== 5 ||
        parts[0] !== 'ai' ||
        parts[1] !== 'model' ||
        parts[4] !== 'use'
      ) {
        throw new Error('not a model permission name');
      }
      return {
        provider: decode(parts[2]),
        modelId: decode(parts[3]),
      };
    };
    for (const pair of [
      { provider: 'openai', modelId: 'gpt-5' },
      { provider: 'my.provider', modelId: 'model.v2' },
      { provider: 'a/% é', modelId: 'b.c/%' },
      { provider: 'Ünicode', modelId: 'Claude-é' },
      { provider: 'p', modelId: 'with spaces' },
    ]) {
      expect(decodeName(modelPermissionName(pair))).toEqual(pair);
    }
    // A name that is not a model permission name rejects rather than
    // decoding to nonsense.
    expect(() => decodeName('ai.model.openai.gpt-5')).toThrow(
      'not a model permission name',
    );
    // Another permission kind's name is not a model permission name; the
    // decode rejects rather than misreading its segments, and a provider
    // literally named 'model' stays unambiguous because the part count is
    // fixed at five.
    expect(() => decodeName('ai.session.use')).toThrow(
      'not a model permission name',
    );
    expect(
      decodeName(modelPermissionName({ provider: 'model', modelId: 'm' })),
    ).toEqual({ provider: 'model', modelId: 'm' });
    // A real '%' in a provider becomes %25 before %2E is applied, so the
    // decode cannot confuse an encoded dot with an encoded percent.
    expect(modelPermissionName({ provider: 'a%2Eb', modelId: 'm' })).toBe(
      'ai.model.a%252Eb.m.use',
    );
    expect(decodeName('ai.model.a%252Eb.m.use')).toEqual({
      provider: 'a%2Eb',
      modelId: 'm',
    });
  });
});
