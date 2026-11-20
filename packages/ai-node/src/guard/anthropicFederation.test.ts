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

import { createServer } from 'node:http';
import { once } from 'node:events';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { mockCredentials } from '@backstage/backend-test-utils';
import { anthropicProvider } from '@earendil-works/pi-ai/providers/anthropic';
import { normalizeContext } from '@earendil-works/pi-ai/utils/transcript';
import { streamSimple } from '@earendil-works/pi-ai/api/anthropic-messages';
import type { Fence } from '../contracts';
import type { AttemptDecision } from '../journal/types';
import { createModelOperationGuard as createModelOperationGuardBase } from './createModelOperationGuard';
import type { TrustedOperation } from './types';
import { builtinProviderRegistry } from '@backstage/ai-node-test-utils/alpha';

const createModelOperationGuard = (
  options: Parameters<typeof createModelOperationGuardBase>[0],
) =>
  createModelOperationGuardBase({
    providers: builtinProviderRegistry,
    ...options,
  });

describe('Anthropic federation', () => {
  it('classifies and denies the uncertified token exchange without sending secrets', async () => {
    const directory = await mkdtemp(join(tmpdir(), 'ai-guard-test-'));
    const tokenFile = join(directory, 'identity');
    await writeFile(tokenFile, 'test-identity-token');
    const received: string[] = [];
    const server = createServer((req, res) => {
      received.push(req.url ?? '');
      req.resume();
      res.writeHead(200, { 'content-type': 'application/json' });
      res.end(
        JSON.stringify({
          access_token: 'test-access-token',
          expires_in: 3600,
          token_type: 'Bearer',
        }),
      );
    });
    server.listen(0, '127.0.0.1');
    await once(server, 'listening');
    try {
      const address = server.address();
      if (!address || typeof address === 'string')
        throw new Error('No test port');
      const baseUrl = `http://127.0.0.1:${address.port}`;
      const model = { ...anthropicProvider().getModels()[0], baseUrl };
      const operation: TrustedOperation = {
        actor: 'user:default/alice',
        credentials: mockCredentials.user('user:default/alice'),
        provenance: {
          origin: 'verified',
          conversationId: '1',
          taskId: '2',
          callId: '3',
        },
        fence: {
          namespace: { pluginId: 'test', sessionId: 's' },
          owner: 'owner',
          token: '1',
        },
        definitionVersion: 'v1',
        configVersion: 'v1',
        provider: 'anthropic',
        modelId: model.id,
        resolvedModel: model.id,
        operation: 'streamSimple',
        api: 'anthropic-messages',
        destination: `${baseUrl}/v1/messages`,
        authTokenDestinations: [`${baseUrl}/v1/oauth/token`],
        credentialScope: { kind: 'user', id: 'user:default/alice' },
        credentialGeneration: '1',
        controller: new AbortController(),
      };
      const decisions: AttemptDecision[] = [];
      // Explicitly non-production, non-durable journal test double.
      const journal = {
        recordDecisionAndIntent: async (
          _fence: Fence,
          event: AttemptDecision,
        ) => {
          decisions.push(event);
          return String(decisions.length);
        },
        recordOutcome: async () => {},
        recordRecovery: async () => {},
        read: async () => ({ items: [] }),
      };
      const recheck = jest
        .fn()
        .mockResolvedValueOnce(true)
        .mockResolvedValueOnce(false);
      const guard = createModelOperationGuard({
        transport: globalThis.fetch,
        journal,
        recheck,
      }).bind(operation);
      const result = await streamSimple(
        model,
        normalizeContext({ messages: [] }),
        {
          fetch: guard.fetch,
          signal: operation.controller.signal,
          env: {
            ANTHROPIC_FEDERATION_RULE_ID: 'rule',
            ANTHROPIC_ORGANIZATION_ID: 'org',
            ANTHROPIC_IDENTITY_TOKEN_FILE: tokenFile,
          },
        },
      ).result();
      expect(result.stopReason).toBe('aborted');
      expect(received).toEqual([]);
      expect(recheck).not.toHaveBeenCalled();
      expect(
        decisions.map(d => [d.operation, d.decision, d.destination]),
      ).toEqual([['auth.token-exchange', 'deny', `${baseUrl}/v1/oauth/token`]]);
      expect(JSON.stringify(decisions)).not.toContain('test-identity-token');
    } finally {
      server.close();
      await once(server, 'close');
      await rm(directory, { recursive: true, force: true });
    }
  });
});
