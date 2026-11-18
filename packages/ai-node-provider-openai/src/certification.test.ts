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

import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import knex from 'knex';
import { openaiProvider } from '@earendil-works/pi-ai/providers/openai';
import { normalizeContext } from '@earendil-works/pi-ai/utils/transcript';
import {
  CRASH_TEST_CHILD_ENV,
  createCrashTestFixture,
  createProviderRegistry,
  registerProviderCertification,
  runCrashChild,
  type TrustedOperation,
} from '@backstage/ai-node-test-utils/alpha';
import { openaiProviderModules } from './alpha';

const credentials = { $$type: '@backstage/BackstageCredentials' } as never;
const providers = createProviderRegistry([...openaiProviderModules]);

const paths = {
  'openai-responses': '/v1/responses',
  'openai-completions': '/v1/chat/completions',
  'openai-codex-responses': '/backend-api/codex/responses',
} as const;
type Id = keyof typeof paths;
const prefix: Record<Id, string> = {
  'openai-responses': '/v1',
  'openai-completions': '/v1',
  'openai-codex-responses': '/backend-api',
};

function operation(id: Id, origin: string): TrustedOperation {
  return {
    actor: 'user:default/alice',
    credentials,
    provenance: {
      origin: 'verified',
      conversationId: '1',
      taskId: '2',
      callId: '3',
    },
    fence: {
      namespace: { pluginId: 'crash-test', sessionId: 'session' },
      owner: 'owner',
      token: '1',
    },
    definitionVersion: 'v1',
    configVersion: 'v1',
    provider: id,
    modelId: 'gpt',
    resolvedModel: 'gpt',
    operation: 'streamSimple',
    api: id,
    destination: `${origin}${paths[id]}`,
    credentialScope: { kind: 'user', id: 'user:default/alice' },
    credentialGeneration: '1',
    controller: new AbortController(),
  };
}

function request(
  op: TrustedOperation,
  substitute = false,
  substituteQuery = false,
): Request {
  const url = new URL(op.destination);
  if (substituteQuery) url.searchParams.set('unexpected', 'true');
  return new Request(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ model: substitute ? 'other' : op.resolvedModel }),
  });
}

if (process.env[CRASH_TEST_CHILD_ENV] === '1') {
  // eslint-disable-next-line jest/expect-expect
  it('sends after durable intent and waits to be killed', async () => {
    await runCrashChild({
      providers,
      async dispatch({ origin, bind }) {
        const id = process.env.AI_OPENAI_CERT_ID as Id;
        const model = {
          ...openaiProvider().getModels()[0],
          api: id,
          baseUrl: `${origin}${prefix[id]}`,
        } as { id: string; provider: string };
        const module = providers.get(id)!;
        const summary = bind({
          provider: model.provider,
          modelId: model.id,
          resolvedModel: model.id,
          operation: 'streamSimple',
          api: id,
          destination: `${origin}${paths[id]}`,
        });
        if (module.adapter.kind !== 'stream')
          throw new Error('Expected pinned stream adapter');
        const apiKey =
          id === 'openai-codex-responses'
            ? `x.${Buffer.from(
                JSON.stringify({
                  'https://api.openai.com/auth': {
                    chatgpt_account_id: 'account',
                  },
                }),
              ).toString('base64url')}.x`
            : 'test-key';
        await module.adapter
          .streamSimple(
            model as never,
            normalizeContext({ messages: [] }) as never,
            {
              apiKey,
              transport: 'sse',
              fetch: summary.fetch,
              maxRetries: 0,
            } as never,
          )
          .result();
      },
    });
  }, 30000);
} else {
  // One journal database per certified module: each crash cell gets its own
  // durable store so the recorded intents cannot bleed across modules.
  const resources = new Map<
    Id,
    Promise<{
      db: knex.Knex;
      dir: string;
      fixture: Awaited<ReturnType<typeof createCrashTestFixture>>;
    }>
  >();
  const prepare = (id: Id) => {
    let entry = resources.get(id);
    if (entry === undefined) {
      entry = (async () => {
        const dir = await mkdtemp(join(tmpdir(), 'openai-cert-fixture-'));
        const db = knex({
          client: 'better-sqlite3',
          connection: { filename: join(dir, 'journal.sqlite') },
          useNullAsDefault: true,
          pool: { min: 1, max: 1 },
        });
        const fixture = await createCrashTestFixture({ db, providers });
        return { db, dir, fixture };
      })();
      resources.set(id, entry);
    }
    return entry;
  };
  const assertCrashUnknown = (id: Id) =>
    prepare(id).then(({ fixture }) =>
      fixture.assertCrashUnknown({ env: { AI_OPENAI_CERT_ID: id } }),
    );
  afterAll(async () => {
    await Promise.all(
      [...resources.values()].map(async entry => {
        const { db, dir } = await entry;
        await db.destroy();
        await rm(dir, { recursive: true, force: true });
      }),
    );
  });

  for (const id of Object.keys(paths) as Id[]) {
    registerProviderCertification({
      name: id,
      operation: 'streamSimple',
      providers,
      createOperation: () => operation(id, 'https://provider.example'),
      request,
      assertCrashUnknown: () => assertCrashUnknown(id),
    });
  }
}
