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
import { ConfigReader } from '@backstage/config';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { parseAiInstallationConfig } from '../config-extension';
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
    // The caller cannot mutate the discovery result or its source: the
    // returned array is frozen, and so is every entry.
    expect(Object.isFrozen(listed)).toBe(true);
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

  it('drops extra input fields at the seam, keeping only descriptor fields', async () => {
    // A structurally compatible input (the catalog's AnyModel entries are
    // wider than ModelDescriptor) must not smuggle extra fields —
    // headers, metadata — into discovery descriptors.
    const user = mockCredentials.user('user:default/alice');
    const authorize = jest.fn(async () => [
      { result: 'ALLOW' },
    ]) as unknown as jest.MockedFunction<PermissionsService['authorize']>;
    // Wider than ModelDescriptor on purpose — the seam must shed the
    // extra fields, which is why the literal needs the cast.
    const input = [
      {
        provider: 'openai',
        modelId: 'gpt-5',
        api: 'openai-responses',
        type: 'chat',
        contextWindow: 400_000,
        maxTokens: 128_000,
        baseUrl: 'https://api.openai.com/v1',
        headers: { authorization: 'private-value' },
        extraMetadata: 'confidential',
        cost: { input: 1, output: 2 },
      },
    ] as unknown as Parameters<typeof createModelPermissions>[0]['models'];
    const permissions = createModelPermissions({
      models: input,
      authorizer: { authorize },
      registry: { addPermissions: jest.fn() },
    });
    const listed = await permissions.listModels(user);
    expect(listed).toEqual([
      {
        provider: 'openai',
        modelId: 'gpt-5',
        api: 'openai-responses',
        type: 'chat',
        contextWindow: 400_000,
        maxTokens: 128_000,
      },
    ]);
    expect(JSON.stringify(listed)).not.toContain('private-value');
    expect(JSON.stringify(listed)).not.toContain('confidential');
    expect(JSON.stringify(listed)).not.toContain('baseUrl');
  });

  it('configures classifier and image models through the real config path', async () => {
    const user = mockCredentials.user('user:default/alice');
    const installation = parseAiInstallationConfig({
      root: new ConfigReader({
        ai: {
          models: [
            {
              provider: 'openai',
              modelId: 'gpt-decisions',
              type: 'classifier',
              api: 'openai-decisions',
              baseUrl: 'https://api.openai.com/v1',
              contextWindow: 272_000,
            },
            {
              provider: 'openrouter',
              modelId: 'flux-3-image',
              type: 'image',
              api: 'openrouter-images',
              baseUrl: 'https://openrouter.ai/api/v1',
              maxTokens: 4096,
            },
            {
              provider: 'openai',
              modelId: 'gpt-5',
              api: 'openai-responses',
              baseUrl: 'https://api.openai.com/v1',
              contextWindow: 400_000,
              maxTokens: 128_000,
            },
          ],
        },
      }),
      path: 'ai',
    });
    expect(installation.models).toHaveLength(3);
    const authorize = jest.fn(
      async (requests: Parameters<PermissionsService['authorize']>[0]) =>
        requests.map(() => ({ result: 'ALLOW' })),
    ) as unknown as jest.MockedFunction<PermissionsService['authorize']>;
    const permissions = createModelPermissions({
      models: installation.models.map(model => ({
        provider: model.provider,
        modelId: model.id,
        api: model.api,
        type: model.type,
        ...('contextWindow' in model
          ? { contextWindow: model.contextWindow }
          : {}),
        ...('maxTokens' in model ? { maxTokens: model.maxTokens } : {}),
      })),
      authorizer: { authorize },
      registry: { addPermissions: jest.fn() },
    });
    const listed = await permissions.listModels(user);
    expect(listed).toEqual([
      {
        provider: 'openai',
        modelId: 'gpt-decisions',
        api: 'openai-decisions',
        type: 'classifier',
        contextWindow: 272_000,
      },
      {
        provider: 'openrouter',
        modelId: 'flux-3-image',
        api: 'openrouter-images',
        type: 'image',
        maxTokens: 4096,
      },
      {
        provider: 'openai',
        modelId: 'gpt-5',
        api: 'openai-responses',
        type: 'chat',
        contextWindow: 400_000,
        maxTokens: 128_000,
      },
    ]);
  });

  it('round-trips the documented policy-author decoding exactly', async () => {
    // The README documents this decode for policy authors. The test
    // executes the README's own fenced snippet — extracted and
    // transpiled — so the documented algorithm and the tested one
    // cannot drift apart.
    const markdown = readFileSync(join(__dirname, '../../README.md'), 'utf8');
    const section = markdown
      .split('## Model permission names')[1]
      .split('## Semantics')[0];
    const fenced = section.match(/```ts\n([\s\S]*?)```/);
    expect(fenced).not.toBeNull();
    // The repo-root TypeScript compiler, required at runtime so the
    // package declares no dependency for one documentation test.
    const ts = createRequire(import.meta.url)('typescript') as {
      transpileModule(
        code: string,
        options: { compilerOptions: { target: number } },
      ): { outputText: string };
      ScriptTarget: { ES2022: number };
    };
    const transpiled = ts.transpileModule(fenced![1], {
      compilerOptions: { target: ts.ScriptTarget.ES2022 },
    }).outputText;
    // The Function constructor is eval; the input here is this
    // repository's own README snippet, extracted from the fenced block
    // we author, and the argument is a permission name the test built.
    // eslint-disable-next-line no-new-func
    const decodeName = new Function('name', `${transpiled}\nreturn pair;`) as (
      name: string,
    ) => { provider: string; modelId: string };
    for (const pair of [
      { provider: 'openai', modelId: 'gpt-5' },
      { provider: 'my.provider', modelId: 'model.v2' },
      { provider: 'a/% é', modelId: 'b.c/%' },
      { provider: 'Ünicode', modelId: 'Claude-é' },
      { provider: 'p', modelId: 'with spaces' },
      // encodeURIComponent passes '*' through unchanged, so a literal-star
      // model ID is a legal, exact, non-wildcard name.
      { provider: 'openai', modelId: '*' },
    ]) {
      expect(decodeName(modelPermissionName(pair))).toEqual(pair);
    }
    expect(modelPermissionName({ provider: 'openai', modelId: '*' })).toBe(
      'ai.model.openai.*.use',
    );
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
