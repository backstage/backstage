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
import type { BackstageCredentials } from '@backstage/backend-plugin-api';
import { createPermissionsServiceDouble } from '@backstage/ai-node-test-utils/alpha';
import type {
  QueryPermissionRequest,
  QueryPermissionResponse,
} from '@backstage/plugin-permission-common';
import type {
  PermissionCriteria,
  PermissionCondition,
} from '@backstage/plugin-permission-common';
import {
  aiModelUsePermission,
  aiToolUsePermission,
  RESOURCE_TYPE_AI_FEATURE,
  RESOURCE_TYPE_AI_MODEL,
  RESOURCE_TYPE_AI_TOOL,
} from '@backstage/plugin-ai-common';
import { createModelAccess, type ModelDescriptor } from './modelAccess';
import {
  aiFeatureConditions,
  aiFeaturePermissionRules,
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

/**
 * A permissions client double that answers with a genuine
 * `QueryPermissionResponse` envelope, exactly as the real client does: a
 * conditional decision carries its plugin id and resource type next to the
 * criteria, not inside them.
 */
function envelope(
  conditions: unknown,
  overrides: Record<string, unknown> = {},
): unknown {
  return {
    result: 'CONDITIONAL',
    pluginId: 'ai',
    resourceType: RESOURCE_TYPE_AI_MODEL,
    conditions,
    ...overrides,
  };
}

/** An authorizer whose single conditional answer the test controls. */
function policy(answer: unknown) {
  const queries: Array<{
    requests: QueryPermissionRequest[];
    credentials?: BackstageCredentials;
  }> = [];
  const permissions = createPermissionsServiceDouble({
    // The answer may deliberately be malformed or missing: the evaluator
    // must tolerate both, so the cast stands for the probe it carries.
    query: async (request, callerCredentials) => {
      queries.push({ requests: [request], credentials: callerCredentials });
      return answer as QueryPermissionResponse;
    },
  });
  return { permissions, queries };
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

  it('denies an asynchronous validator without leaving a rejection unhandled', async () => {
    const unhandled: unknown[] = [];
    const listener = (reason: unknown) => unhandled.push(reason);
    process.on('unhandledRejection', listener);
    try {
      for (const validate of [
        () => Promise.resolve({ issues: ['async'] }),
        () => Promise.reject(new Error('validator failed asynchronously')),
      ]) {
        const rule = {
          name: aiModelConditions.isModel(pair).rule,
          resourceType: RESOURCE_TYPE_AI_MODEL,
          paramsSchema: { '~standard': { validate } },
          apply: jest.fn(() => true),
        };
        expect(
          evaluatePermissionCriteria({
            criteria: aiModelConditions.isModel(pair),
            resourceType: RESOURCE_TYPE_AI_MODEL,
            rules: [rule as never],
            resource: pair,
          }),
        ).toBe(false);
        expect(rule.apply).not.toHaveBeenCalled();
      }
      // Let the rejecting validator's rejection reach the event loop.
      await new Promise(resolve => setImmediate(resolve));
      expect(unhandled).toEqual([]);
    } finally {
      process.off('unhandledRejection', listener);
    }
  });

  it('denies when a rule throws, having actually invoked it', () => {
    const apply = jest.fn(() => {
      throw new Error('rule exploded');
    });
    const throwing = {
      name: aiModelConditions.isModel(pair).rule,
      resourceType: RESOURCE_TYPE_AI_MODEL,
      paramsSchema: aiModelPermissionRules.isModel.paramsSchema,
      apply,
    };
    expect(
      evaluatePermissionCriteria({
        criteria: aiModelConditions.isModel(pair),
        resourceType: RESOURCE_TYPE_AI_MODEL,
        rules: [throwing as never],
        resource: pair,
      }),
    ).toBe(false);
    // The denial must come from the throwing apply, not from a missing rule.
    expect(apply).toHaveBeenCalledTimes(1);
  });

  // Reviewer round-2 probe: the response envelope's plugin id and resource
  // type are siblings of `conditions`, so a foreign envelope wrapping a valid
  // leaf must deny at the real authorizer boundary.
  it('denies a foreign response envelope regardless of its criteria', async () => {
    const probes = [
      envelope(aiModelConditions.isModel(pair), {
        pluginId: 'catalog',
        resourceType: 'catalog-entity',
      }),
      envelope(aiModelConditions.isModel(pair), { resourceType: 'ai-tool' }),
      envelope(aiModelConditions.isModel(pair), { pluginId: 'scaffolder' }),
      { result: 'CONDITIONAL', conditions: aiModelConditions.isModel(pair) },
      { result: 'MAYBE', conditions: aiModelConditions.isModel(pair) },
    ];
    for (const answer of probes) {
      const { permissions } = policy(answer);
      expect(
        allowsConditional({
          decision: (answer as never) ?? undefined,
          resourceType: RESOURCE_TYPE_AI_MODEL,
          rules: modelRules,
          resource: pair,
        }),
      ).toBe(false);
      const access = createModelAccess({ models, authorizer: permissions });
      expect(await access.listModels(credentials)).toEqual([]);
    }
  });

  it('asks for one conditional decision on the fixed permission with caller credentials', async () => {
    const { permissions, queries } = policy({ result: 'ALLOW' });
    await expect(
      authorizeConditionalDecision(
        permissions,
        aiModelUsePermission,
        credentials,
      ),
    ).resolves.toEqual({ result: 'ALLOW' });
    expect(queries).toEqual([
      { requests: [{ permission: aiModelUsePermission }], credentials },
    ]);

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
    const { permissions } = policy(envelope(granted));
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
    const scoped = policy(
      envelope(aiModelConditions.isProvider({ provider: 'anthropic' })),
    );
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
      const { permissions, queries } = policy(answer);
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
      for (const query of queries) {
        expect(query.requests).toEqual([{ permission: aiModelUsePermission }]);
        expect(query.credentials).toBe(credentials);
      }
    }
  });

  it('denies on a denial, a missing decision and an unconcrete condition', async () => {
    for (const answer of [
      { result: 'DENY' },
      undefined,
      envelope({ rule: 'UNKNOWN_RULE' }),
      // A conditional answer without the envelope fields is unusable.
      { result: 'CONDITIONAL', conditions: aiModelConditions.isModel(pair) },
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
  const tool = { serverId: 'files', toolName: 'read', pluginId: 'ai' };

  it('grants one tool, one server, or every tool', async () => {
    const toolEnvelope = (conditions: unknown, overrides = {}) => ({
      result: 'CONDITIONAL',
      pluginId: 'ai',
      resourceType: RESOURCE_TYPE_AI_TOOL,
      conditions,
      ...overrides,
    });
    const cases: Array<[unknown, boolean, boolean]> = [
      [toolEnvelope(aiToolConditions.isTool(tool)), true, false],
      [
        toolEnvelope(aiToolConditions.isServer({ serverId: 'files' })),
        true,
        true,
      ],
      [{ result: 'ALLOW' }, true, true],
      [{ result: 'DENY' }, false, false],
      [toolEnvelope({ rule: 'UNKNOWN_RULE' }), false, false],
    ];
    for (const [answer, read, write] of cases) {
      const { permissions, queries } = policy(answer);
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
          resource: {
            serverId: 'files',
            toolName: 'write',
            pluginId: 'ai',
          },
        }),
      ).toBe(write);
      expect(queries).toHaveLength(1);
    }
  });
});

describe('feature and plugin scoping', () => {
  const rules = Object.values(aiFeaturePermissionRules);
  const evaluate = (criteria: unknown, resource: unknown) =>
    evaluatePermissionCriteria({
      criteria: criteria as PermissionCriteria<PermissionCondition>,
      resourceType: RESOURCE_TYPE_AI_FEATURE,
      rules,
      resource: resource as { pluginId: string; feature: string },
    });
  const codemode = { pluginId: 'scaffolder', feature: 'codemode' };

  it('scopes a grant to one feature or one plugin', () => {
    expect(
      evaluate(
        aiFeatureConditions.isFeature({ feature: 'codemode' }),
        codemode,
      ),
    ).toBe(true);
    expect(
      evaluate(aiFeatureConditions.isFeature({ feature: 'tools' }), codemode),
    ).toBe(false);
    expect(
      evaluate(
        aiFeatureConditions.isPlugin({ pluginId: 'scaffolder' }),
        codemode,
      ),
    ).toBe(true);
    expect(
      evaluate(
        {
          allOf: [
            aiFeatureConditions.isPlugin({ pluginId: 'scaffolder' }),
            aiFeatureConditions.isFeature({ feature: 'tools' }),
          ],
        },
        codemode,
      ),
    ).toBe(false);
  });

  it('never satisfies a feature rule with a tool-shaped attribute set', () => {
    // The same rule name over the wrong resource type cannot be smuggled in:
    // the envelope's resource type must be the queried one.
    expect(
      evaluatePermissionCriteria({
        criteria: aiFeatureConditions.isFeature({
          feature: 'codemode',
        }) as unknown as PermissionCriteria<PermissionCondition>,
        resourceType: RESOURCE_TYPE_AI_TOOL,
        rules: Object.values(aiToolPermissionRules),
        resource: { serverId: 'files', toolName: 'read', pluginId: 'ai' },
      }),
    ).toBe(false);
  });

  it('scopes tools to the requesting plugin', () => {
    const tool = {
      serverId: 'files',
      toolName: 'read',
      pluginId: 'scaffolder',
    };
    const toolRules = Object.values(aiToolPermissionRules);
    const allows = (criteria: unknown) =>
      evaluatePermissionCriteria({
        criteria: criteria as PermissionCriteria<PermissionCondition>,
        resourceType: RESOURCE_TYPE_AI_TOOL,
        rules: toolRules,
        resource: tool,
      });
    expect(allows(aiToolConditions.isPlugin({ pluginId: 'scaffolder' }))).toBe(
      true,
    );
    expect(allows(aiToolConditions.isPlugin({ pluginId: 'ai' }))).toBe(false);
    // Denying one plugin leaves every other plugin alone, so "the scaffolder
    // harness never sees a shell tool" is one rule and not a per-plugin setup.
    expect(allows({ not: aiToolConditions.isPlugin({ pluginId: 'ai' }) })).toBe(
      true,
    );
  });
});
