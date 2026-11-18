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
import { mockCredentials } from '@backstage/backend-test-utils';
import { anthropicProvider } from '@earendil-works/pi-ai/providers/anthropic';
import { normalizeContext } from '@earendil-works/pi-ai/utils/transcript';
import {
  CRASH_TEST_CHILD_ENV,
  createCrashTestFixture,
  createProviderRegistry,
  registerProviderCertification,
  runCrashChild,
} from '@backstage/ai-node/testUtils';
import type { TrustedOperation } from '@backstage/ai-node/testUtils';
import { anthropicMessages } from './anthropicMessages';

const providers = createProviderRegistry([anthropicMessages]);
const API = 'anthropic-messages';
const PATH = '/v1/messages';
/** Anthropic's base URL carries no version prefix beyond the route itself. */
const PREFIX = '';

const credentials = mockCredentials.user('user:default/alice');

function operation(origin: string): TrustedOperation {
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
    provider: 'anthropic',
    modelId: 'gpt',
    resolvedModel: 'gpt',
    operation: 'streamSimple',
    api: API,
    destination: `${origin}${PATH}`,
    credentialScope: { kind: 'user', id: 'user:default/alice' },
    credentialGeneration: '1',
    controller: new AbortController(),
  };
}

function request(op: TrustedOperation, substitute = false, query = false) {
  const url = new URL(op.destination);
  if (query) url.searchParams.set('unexpected', 'true');
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
        const model = {
          ...anthropicProvider().getModels()[0],
          api: API,
          baseUrl: `${origin}${PREFIX}`,
        };
        const summary = bind({
          provider: model.provider,
          modelId: model.id,
          resolvedModel: model.id,
          operation: 'streamSimple',
          api: API,
          destination: anthropicMessages.destination(model as never, undefined),
        });
        const adapter = anthropicMessages.adapter;
        if (adapter.kind !== 'stream')
          throw new Error('Expected stream adapter');
        await adapter
          .streamSimple(
            model as never,
            normalizeContext({ messages: [] }) as never,
            {
              apiKey: 'test-key',
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
  // One journal database for the whole suite: the crash cell opens it here and
  // the certification harness asserts the durable record after the kill.
  let resources:
    | Promise<{
        db: knex.Knex;
        dir: string;
        fixture: Awaited<ReturnType<typeof createCrashTestFixture>>;
      }>
    | undefined;
  const prepare = () => {
    resources ??= (async () => {
      const dir = await mkdtemp(join(tmpdir(), 'cert-fixture-'));
      const db = knex({
        client: 'better-sqlite3',
        connection: { filename: join(dir, 'journal.sqlite') },
        useNullAsDefault: true,
        pool: { min: 1, max: 1 },
      });
      const fixture = await createCrashTestFixture({ db, providers });
      return { db, dir, fixture };
    })();
    return resources;
  };
  const assertCrashUnknown = async () => {
    const { fixture } = await prepare();
    await fixture.assertCrashUnknown();
  };
  afterAll(async () => {
    if (!resources) return;
    const { db, dir } = await resources;
    await db.destroy();
    await rm(dir, { recursive: true, force: true });
  });

  registerProviderCertification({
    name: 'anthropicMessages',
    operation: 'streamSimple',
    providers,
    createOperation: () => operation('https://provider.example'),
    request,
    assertCrashUnknown,
  });
}
