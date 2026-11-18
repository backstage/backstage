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
import type {
  PermissionCriteria,
  PermissionCondition,
} from '@backstage/plugin-permission-common';
import {
  aiModelUsePermission,
  aiToolUsePermission,
  RESOURCE_TYPE_AI_MODEL,
  RESOURCE_TYPE_AI_TOOL,
} from '@backstage/plugin-ai-common';
import { createModelAccess, type ModelDescriptor } from './modelAccess';
import {
  aiModelConditions,
  aiModelPermissionRules,
  aiToolConditions,
  aiToolPermissionRules,
  allowsConditional,
  authorizeConditionalDecision,
  evaluatePermissionCriteria,
} from './rules';

const credentials = mockCredentials.user('user:default/alice');

const models: ModelDescriptor[] = [
  { provider: 'openai', modelId: 'first', type: 'chat' },
  { provider: 'openai', modelId: 'second', type: 'chat' },
  { provider: 'anthropic', modelId: 'third', type: 'image' },
];

/** An authorizer whose single conditional answer the test controls. */
function policy(answer: unknown) {
  const authorizeConditional = jest.fn(async () => [answer]);
  return {
    authorizeConditional,
    permissions: { authorizeConditional } as unknown as PermissionsService,
  };
}

describe('permission rule evaluation', () => {
  it('evaluates anyOf, allOf and not against in-hand attributes', () => {
    const pair = { provider: 'openai', modelId: 'first', type: 'chat' };
    const criteria: PermissionCriteria<PermissionCondition> = {
      allOf: [
        { anyOf: [aiModelConditions.isModel(pair)] },
        { not: aiModelConditions.isModelType({ type: 'image' }) },
      ],
    };
    expect(
      evaluatePermissionCriteria(
        criteria,
        Object.values(aiModelPermissionRules),
        pair,
      ),
    ).toBe(true);
    expect(
      evaluatePermissionCriteria(
        { not: aiModelConditions.isProvider({ provider: 'openai' }) },
        Object.values(aiModelPermissionRules),
        pair,
      ),
    ).toBe(false);
  });

  it('denies operators and rules it cannot evaluate', () => {
    const pair = { provider: 'openai', modelId: 'first' };
    const rules = Object.values(aiModelPermissionRules);
    expect(
      evaluatePermissionCriteria(
        {
          rule: 'IS_TOOL',
          resourceType: RESOURCE_TYPE_AI_TOOL,
          params: { serverId: 'files', toolName: 'read' },
        },
        rules,
        pair,
      ),
    ).toBe(false);
    expect(
      evaluatePermissionCriteria(
        {
          rule: 'UNKNOWN_RULE',
          resourceType: RESOURCE_TYPE_AI_MODEL,
          params: { provider: 'openai', modelId: 'first' },
        },
        rules,
        pair,
      ),
    ).toBe(false);
    expect(
      evaluatePermissionCriteria(
        {
          rule: 'IS_MODEL',
          resourceType: RESOURCE_TYPE_AI_MODEL,
          params: { provider: 7, modelId: 'first' },
        } as never,
        rules,
        pair,
      ),
    ).toBe(false);
    expect(
      evaluatePermissionCriteria(
        {
          rule: 'IS_MODEL',
          resourceType: RESOURCE_TYPE_AI_MODEL,
          params: 'not-an-object',
        } as never,
        rules,
        pair,
      ),
    ).toBe(false);
    // A rule of the right name but the wrong resource type never matches.
    expect(
      evaluatePermissionCriteria(
        {
          rule: 'IS_MODEL',
          resourceType: RESOURCE_TYPE_AI_TOOL,
          params: { provider: 'openai', modelId: 'first' },
        },
        rules,
        pair,
      ),
    ).toBe(false);
  });

  it('asks for one conditional decision on the fixed permission with caller credentials', async () => {
    const { permissions, authorizeConditional } = policy({ result: 'ALLOW' });
    await expect(
      authorizeConditionalDecision(
        permissions,
        aiModelUsePermission,
        credentials,
      ),
    ).resolves.toEqual({ result: 'ALLOW' });
    expect(authorizeConditional).toHaveBeenCalledWith(
      [{ permission: aiModelUsePermission }],
      { credentials },
    );

    // A missing decision denies instead of allowing, and a response that is
    // not a decision list at all is a contract violation.
    await expect(
      authorizeConditionalDecision(
        policy(undefined).permissions,
        aiToolUsePermission,
        credentials,
      ),
    ).resolves.toEqual({ result: 'DENY' });
    await expect(
      authorizeConditionalDecision(
        { authorizeConditional: async () => undefined } as never,
        aiToolUsePermission,
        credentials,
      ),
    ).rejects.toThrow('Invalid conditional permission decisions');
  });
});

describe('model access under conditional policies', () => {
  it('grants one model pair and denies the others', async () => {
    const granted = aiModelConditions.isModel({
      provider: 'openai',
      modelId: 'first',
    });
    const { permissions } = policy({
      result: 'CONDITIONAL',
      conditions: granted,
    });
    const access = createModelAccess({ models, authorizer: permissions });

    expect(await access.listModels(credentials)).toEqual([
      { provider: 'openai', modelId: 'first', type: 'chat' },
    ]);
    expect(await access.listProviders(credentials)).toEqual(['openai']);
    expect(
      await access.canUse(
        { provider: 'openai', modelId: 'first' },
        credentials,
      ),
    ).toBe(true);
    expect(
      await access.canUse(
        { provider: 'anthropic', modelId: 'third' },
        credentials,
      ),
    ).toBe(false);
    expect(
      await access.canUse(
        { provider: 'openai', modelId: 'missing' },
        credentials,
      ),
    ).toBe(false);
  });

  it('scopes grants to a provider and honours a blanket grant', async () => {
    const scoped = policy({
      result: 'CONDITIONAL',
      conditions: aiModelConditions.isProvider({ provider: 'anthropic' }),
    });
    const scopedAccess = createModelAccess({
      models,
      authorizer: scoped.permissions,
    });
    expect(await scopedAccess.listProviders(credentials)).toEqual([
      'anthropic',
    ]);
    expect(await scopedAccess.listModels(credentials)).toHaveLength(1);

    const blanket = policy({ result: 'ALLOW' });
    const blanketAccess = createModelAccess({
      models,
      authorizer: blanket.permissions,
    });
    expect(await blanketAccess.listModels(credentials)).toHaveLength(3);
  });

  it('denies on a denial, a missing decision and an unconcrete condition', async () => {
    for (const answer of [
      { result: 'DENY' },
      undefined,
      { result: 'CONDITIONAL', conditions: { rule: 'UNKNOWN_RULE' } },
    ]) {
      const { permissions } = policy(answer);
      const access = createModelAccess({ models, authorizer: permissions });
      expect(await access.listModels(credentials)).toEqual([]);
      expect(
        await access.canUse(
          { provider: 'openai', modelId: 'first' },
          credentials,
        ),
      ).toBe(false);
    }
  });
});

describe('tool access under conditional policies', () => {
  const tool = { serverId: 'files', toolName: 'read' };

  it('grants one tool, one server, or every tool', async () => {
    const cases: Array<[unknown, boolean, boolean]> = [
      [
        { result: 'CONDITIONAL', conditions: aiToolConditions.isTool(tool) },
        true,
        false,
      ],
      [
        {
          result: 'CONDITIONAL',
          conditions: aiToolConditions.isServer({ serverId: 'files' }),
        },
        true,
        true,
      ],
      [{ result: 'ALLOW' }, true, true],
      [{ result: 'DENY' }, false, false],
      [
        { result: 'CONDITIONAL', conditions: { rule: 'UNKNOWN_RULE' } },
        false,
        false,
      ],
    ];
    for (const [answer, read, write] of cases) {
      const { permissions, authorizeConditional } = policy(answer);
      const decision = await authorizeConditionalDecision(
        permissions,
        aiToolUsePermission,
        credentials,
      );
      const rules = Object.values(aiToolPermissionRules);
      expect(allowsConditional(decision, rules, tool)).toBe(read);
      expect(
        allowsConditional(decision, rules, {
          serverId: 'files',
          toolName: 'write',
        }),
      ).toBe(write);
      expect(authorizeConditional).toHaveBeenCalledTimes(1);
    }
  });
});
