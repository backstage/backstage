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
});
