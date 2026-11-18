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

/** The model rule table under test, and one in-hand model to evaluate. */
const modelRules = Object.values(aiModelPermissionRules);
const pair = { provider: 'openai', modelId: 'first', type: 'chat' };

function modelDecision(criteria: unknown) {
  return evaluatePermissionCriteria({
    criteria: criteria as PermissionCriteria<PermissionCondition>,
    resourceType: RESOURCE_TYPE_AI_MODEL,
    rules: modelRules,
    resource: pair,
  });
}

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
    const criteria: PermissionCriteria<PermissionCondition> = {
      allOf: [
        { anyOf: [aiModelConditions.isModel(pair)] },
        { not: aiModelConditions.isModelType({ type: 'image' }) },
      ],
    };
    expect(modelDecision(criteria)).toBe(true);
    expect(
      modelDecision({
        not: aiModelConditions.isProvider({ provider: 'openai' }),
      }),
    ).toBe(false);
  });

  it('denies unknown rules, foreign resource types and invalid parameters', () => {
    expect(
      modelDecision({
        rule: 'UNKNOWN_RULE',
        resourceType: RESOURCE_TYPE_AI_MODEL,
        params: { provider: 'openai', modelId: 'first' },
      }),
    ).toBe(false);
    // A rule of the right name on the wrong resource type never matches.
    expect(
      modelDecision({
        rule: 'IS_MODEL',
        resourceType: RESOURCE_TYPE_AI_TOOL,
        params: { provider: 'openai', modelId: 'first' },
      }),
    ).toBe(false);
    expect(
      modelDecision({
        rule: 'IS_MODEL',
        resourceType: RESOURCE_TYPE_AI_MODEL,
        params: { provider: 7, modelId: 'first' },
      }),
    ).toBe(false);
    expect(
      modelDecision({
        rule: 'IS_MODEL',
        resourceType: RESOURCE_TYPE_AI_MODEL,
        params: 'not-an-object',
      }),
    ).toBe(false);
  });

  // Reviewer probe 1: parameters were never validated against the rule's own
  // schema, so a malformed condition inside `not` inverted into an allow.
  it('denies malformed parameters that a negation would otherwise invert', () => {
    expect(
      modelDecision({
        not: {
          rule: 'IS_PROVIDER',
          resourceType: RESOURCE_TYPE_AI_MODEL,
          params: { provider: 42 },
        },
      }),
    ).toBe(false);
    expect(
      modelDecision({
        anyOf: [{ rule: 'IS_MODEL', resourceType: RESOURCE_TYPE_AI_MODEL }],
      }),
    ).toBe(false);
    expect(
      modelDecision({
        allOf: [
          {
            rule: 'IS_MODEL',
            resourceType: RESOURCE_TYPE_AI_MODEL,
            params: { provider: 'openai', modelId: 5 },
          },
        ],
      }),
    ).toBe(false);
  });

  // Reviewer probe 2: a foreign envelope could carry one valid leaf.
  it('denies a foreign top-level envelope even with a valid leaf', () => {
    expect(
      modelDecision({
        resourceType: RESOURCE_TYPE_AI_TOOL,
        allOf: [aiModelConditions.isModel(pair)],
      }),
    ).toBe(false);
    expect(
      modelDecision({
        pluginId: 'catalog',
        allOf: [
          {
            pluginId: 'catalog',
            allOf: [aiModelConditions.isModel(pair)],
          },
        ],
      }),
    ).toBe(false);
    expect(
      modelDecision({
        anyOf: [
          aiModelConditions.isModel(pair),
          {
            rule: 'IS_MODEL',
            resourceType: RESOURCE_TYPE_AI_TOOL,
            params: { provider: 'openai', modelId: 'first' },
          },
        ],
      }),
    ).toBe(false);
  });

  // Reviewer probe 3: an empty compound is vacuously true.
  it('denies empty compounds and malformed nodes', () => {
    expect(modelDecision({ allOf: [] })).toBe(false);
    expect(modelDecision({ anyOf: [] })).toBe(false);
    expect(modelDecision({ not: {} })).toBe(false);
    expect(modelDecision({})).toBe(false);
    expect(modelDecision(null)).toBe(false);
    expect(modelDecision([])).toBe(false);
    expect(modelDecision({ not: { not: {} } })).toBe(false);
  });

  // Reviewer probe 5: boolean evaluation short-circuits, so a valid first
  // branch hid a malformed later one. The whole tree is validated first.
  it('validates every branch, not just the ones evaluation reaches', () => {
    expect(
      modelDecision({
        anyOf: [
          aiModelConditions.isModel(pair),
          { rule: 'UNKNOWN_RULE', resourceType: RESOURCE_TYPE_AI_MODEL },
        ],
      }),
    ).toBe(false);
    expect(
      modelDecision({
        anyOf: [
          aiModelConditions.isModel(pair),
          {
            rule: 'IS_MODEL',
            resourceType: RESOURCE_TYPE_AI_MODEL,
            params: { provider: 42 },
          },
        ],
      }),
    ).toBe(false);
    expect(
      modelDecision({
        allOf: [
          aiModelConditions.isModelType({ type: 'image' }),
          { rule: 'UNKNOWN_RULE', resourceType: RESOURCE_TYPE_AI_MODEL },
        ],
      }),
    ).toBe(false);
    expect(
      modelDecision({
        not: {
          anyOf: [
            aiModelConditions.isProvider({ provider: 'elsewhere' }),
            { rule: 'UNKNOWN_RULE', resourceType: RESOURCE_TYPE_AI_MODEL },
          ],
        },
      }),
    ).toBe(false);
    // A node carrying two operators, or an operator plus a leaf, is malformed.
    expect(
      modelDecision({
        anyOf: [aiModelConditions.isModel(pair)],
        allOf: [aiModelConditions.isModel(pair)],
      }),
    ).toBe(false);
    expect(
      modelDecision({
        anyOf: [aiModelConditions.isModel(pair)],
        ...aiModelConditions.isModel(pair),
      }),
    ).toBe(false);
    expect(
      modelDecision({
        ...aiModelConditions.isModel(pair),
        unexpected: true,
      }),
    ).toBe(false);
  });

  it('denies when a rule throws', () => {
    const throwing = {
      name: 'THROWS',
      resourceType: RESOURCE_TYPE_AI_MODEL,
      paramsSchema: aiModelPermissionRules.isModel.paramsSchema,
      apply: () => {
        throw new Error('rule exploded');
      },
    };
    expect(
      evaluatePermissionCriteria({
        criteria: aiModelConditions.isModel(pair),
        resourceType: RESOURCE_TYPE_AI_MODEL,
        rules: [throwing as never],
        resource: pair,
      }),
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

  // Reviewer discovery probe: a malformed criteria that would invert through
  // `not` must not leak the descriptor through the discovery boundary either.
  it('leaks no descriptor through discovery for malformed criteria', async () => {
    const malformed = [
      {
        result: 'CONDITIONAL',
        conditions: {
          not: {
            rule: 'IS_PROVIDER',
            resourceType: RESOURCE_TYPE_AI_MODEL,
            params: { provider: 42 },
          },
        },
      },
      {
        result: 'CONDITIONAL',
        conditions: {
          allOf: [
            aiModelConditions.isModel({
              provider: 'openai',
              modelId: 'first',
            }),
            { rule: 'UNKNOWN_RULE', resourceType: RESOURCE_TYPE_AI_MODEL },
          ],
        },
      },
      {
        result: 'CONDITIONAL',
        conditions: {
          resourceType: RESOURCE_TYPE_AI_TOOL,
          anyOf: [
            aiModelConditions.isModel({ provider: 'openai', modelId: 'first' }),
          ],
        },
      },
      { result: 'CONDITIONAL', conditions: { allOf: [] } },
    ];
    for (const answer of malformed) {
      const { permissions, authorizeConditional } = policy(answer);
      const access = createModelAccess({ models, authorizer: permissions });
      expect(await access.listModels(credentials)).toEqual([]);
      expect(await access.listProviders(credentials)).toEqual([]);
      expect(
        await access.canUse(
          { provider: 'openai', modelId: 'first' },
          credentials,
        ),
      ).toBe(false);
      // One query per check, with the caller's own credentials and no
      // resource attributes leaving the process.
      expect(authorizeConditional).toHaveBeenCalledWith(
        [{ permission: aiModelUsePermission }],
        { credentials },
      );
    }
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
      expect(
        allowsConditional({
          decision,
          resourceType: RESOURCE_TYPE_AI_TOOL,
          rules,
          resource: tool,
        }),
      ).toBe(read);
      expect(
        allowsConditional({
          decision,
          resourceType: RESOURCE_TYPE_AI_TOOL,
          rules,
          resource: { serverId: 'files', toolName: 'write' },
        }),
      ).toBe(write);
      expect(authorizeConditional).toHaveBeenCalledTimes(1);
    }
  });
});
