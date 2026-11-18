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
import {
  CRASH_TEST_CHILD_ENV,
  createCrashTestFixture,
  createProviderRegistry,
  registerProviderCertification,
  runCrashChild,
} from '@backstage/ai-node-test-utils/alpha';
import type { TrustedOperation } from '@backstage/ai-node-test-utils/alpha';
import { openrouterImages } from './openrouterImages';

const providers = createProviderRegistry([openrouterImages]);
const credentials = mockCredentials.user('user:default/alice');
const PATH = '/api/v1/chat/completions';

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
    provider: 'openrouter',
    modelId: 'gpt',
    resolvedModel: 'gpt',
    operation: 'generateImages',
    api: 'openrouter-images',
    destination: `${origin}${PATH}`,
    credentialScope: { kind: 'user', id: 'user:default/alice' },
    credentialGeneration: '1',
    controller: new AbortController(),
  };
}

function request(op: TrustedOperation, substitute = false, query = false) {
  const url = new URL(op.destination);
  if (query) url.searchParams.set('unexpected', 'true');
  // Image generation travels as a non-streaming chat-completions request with
  // a well-formed base64 image reference; the envelope check inspects it.
  return new Request(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      model: substitute ? 'other' : op.resolvedModel,
      stream: false,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: 'a red circle' },
            {
              type: 'image_url',
              image_url: { url: 'data:image/png;base64,QUJD' },
            },
          ],
        },
      ],
    }),
  });
}

if (process.env[CRASH_TEST_CHILD_ENV] === '1') {
  // eslint-disable-next-line jest/expect-expect
  it('sends after durable intent and waits to be killed', async () => {
    await runCrashChild({
      providers,
      async dispatch({ origin, bind }) {
        const bound = bind({
          provider: 'openrouter',
          modelId: 'gpt',
          operation: 'generateImages',
          api: 'openrouter-images',
          destination: `${origin}${PATH}`,
        });
        const adapter = openrouterImages.adapter;
        if (adapter.kind !== 'custom')
          throw new Error('Expected custom adapter');
        await adapter
          .invoke({
            operation: 'generateImages',
            model: {
              provider: 'openrouter',
              id: 'gpt',
              api: 'openrouter-images',
              baseUrl: `${origin}/api/v1`,
              output: ['image'],
            } as never,
            context: {
              input: [
                { type: 'text', text: 'a red circle' },
                { type: 'image', mimeType: 'image/png', data: 'QUJD' },
              ],
            } as never,
            options: { apiKey: 'test-key', fetch: bound.fetch } as never,
          })
          .then(result => {
            const value = result.value as {
              stopReason?: string;
              errorMessage?: string;
            };
            if (value?.stopReason !== 'stop') {
              throw new Error(`dispatch did not send: ${value?.errorMessage}`);
            }
          });
      },
    });
  }, 30000);
} else {
  // One journal database for the whole suite: the crash cell prepares it on
  // first use and the certification harness asserts the durable record.
  let resources:
    | Promise<{
        db: knex.Knex;
        dir: string;
        fixture: Awaited<ReturnType<typeof createCrashTestFixture>>;
      }>
    | undefined;
  const prepare = () => {
    resources ??= (async () => {
      const dir = await mkdtemp(join(tmpdir(), 'cert-openrouterImages-'));
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
    name: 'openrouterImages',
    operation: 'generateImages',
    providers,
    createOperation: () => operation('https://provider.example'),
    request,
    assertCrashUnknown,
  });
}
