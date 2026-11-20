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

import {
  createConditionExports,
  createPermissionResourceRef,
  makeCreatePermissionRule,
} from '@backstage/plugin-permission-node';
import type {
  BackstageCredentials,
  PermissionsService,
} from '@backstage/backend-plugin-api';
import type {
  PermissionCondition,
  PermissionCriteria,
  QueryPermissionResponse,
  ResourcePermission,
} from '@backstage/plugin-permission-common';
import {
  RESOURCE_TYPE_AI_FEATURE,
  RESOURCE_TYPE_AI_MODEL,
  RESOURCE_TYPE_AI_TOOL,
  type AiFeatureResource,
  type AiModelResource,
  type AiToolResource,
} from '@backstage/plugin-ai-common';
import { z } from 'zod/v3';

/**
 * Resource reference for one cataloged model.
 *
 * @alpha
 */
export const aiModelResourceRef = createPermissionResourceRef<
  AiModelResource,
  {}
>().with({ pluginId: 'ai', resourceType: RESOURCE_TYPE_AI_MODEL });

const createModelRule = makeCreatePermissionRule<
  AiModelResource,
  {},
  typeof RESOURCE_TYPE_AI_MODEL
>();

/**
 * Matches exactly one cataloged model.
 *
 * @alpha
 */
export const isModel = createModelRule({
  name: 'IS_MODEL',
  resourceType: RESOURCE_TYPE_AI_MODEL,
  description: 'Match a model by its provider ID and model ID',
  paramsSchema: z.object({
    provider: z.string().describe('Provider ID, e.g. `openai`'),
    modelId: z.string().describe('Model ID as listed in the catalog'),
  }),
  apply: (resource, { provider, modelId }) =>
    resource.provider === provider && resource.modelId === modelId,
  toQuery: ({ provider, modelId }) => ({ provider, modelId }),
});

/**
 * Matches every model of one provider.
 *
 * @alpha
 */
export const isProvider = createModelRule({
  name: 'IS_PROVIDER',
  resourceType: RESOURCE_TYPE_AI_MODEL,
  description: 'Match every model of the given provider',
  paramsSchema: z.object({
    provider: z.string().describe('Provider ID, e.g. `openai`'),
  }),
  apply: (resource, { provider }) => resource.provider === provider,
  toQuery: ({ provider }) => ({ provider }),
});

/**
 * Matches every model of one catalog type.
 *
 * @alpha
 */
export const isModelType = createModelRule({
  name: 'IS_MODEL_TYPE',
  resourceType: RESOURCE_TYPE_AI_MODEL,
  description: 'Match every model of the given catalog type',
  paramsSchema: z.object({
    type: z.string().describe('Catalog type, e.g. `chat` or `image`'),
  }),
  apply: (resource, { type }) => resource.type === type,
  toQuery: ({ type }) => ({ type }),
});

/**
 * Resource reference for one registered tool.
 *
 * @alpha
 */
export const aiToolResourceRef = createPermissionResourceRef<
  AiToolResource,
  {}
>().with({ pluginId: 'ai', resourceType: RESOURCE_TYPE_AI_TOOL });

const createToolRule = makeCreatePermissionRule<
  AiToolResource,
  {},
  typeof RESOURCE_TYPE_AI_TOOL
>();

/**
 * Matches exactly one tool.
 *
 * @alpha
 */
export const isTool = createToolRule({
  name: 'IS_TOOL',
  resourceType: RESOURCE_TYPE_AI_TOOL,
  description: 'Match a tool by its server ID and tool name',
  paramsSchema: z.object({
    serverId: z.string().describe('ID of the tool server, e.g. `files`'),
    toolName: z.string().describe('Name of the tool on that server'),
  }),
  apply: (resource, { serverId, toolName }) =>
    resource.serverId === serverId && resource.toolName === toolName,
  toQuery: ({ serverId, toolName }) => ({ serverId, toolName }),
});

/**
 * Matches every tool served by one tool server.
 *
 * @alpha
 */
export const isServer = createToolRule({
  name: 'IS_SERVER',
  resourceType: RESOURCE_TYPE_AI_TOOL,
  description: 'Match every tool served by the given server',
  paramsSchema: z.object({
    serverId: z.string().describe('ID of the tool server, e.g. `files`'),
  }),
  apply: (resource, { serverId }) => resource.serverId === serverId,
  toQuery: ({ serverId }) => ({ serverId }),
});

/**
 * Matches every tool dispatched from one plugin's harness.
 *
 * @remarks
 * The tool resource carries the requesting plugin id, so tool scoping is a
 * policy rule: a scaffolder harness reaching a shell tool is denied by
 * `not(isPlugin({ pluginId: 'scaffolder' }))` on that server, without any
 * per-plugin wiring.
 *
 * @alpha
 */
export const isPlugin = createToolRule({
  name: 'IS_PLUGIN',
  resourceType: RESOURCE_TYPE_AI_TOOL,
  description: 'Match every tool dispatched from the given plugin',
  paramsSchema: z.object({
    pluginId: z.string().describe('Plugin id, e.g. `scaffolder`'),
  }),
  apply: (resource, { pluginId }) => resource.pluginId === pluginId,
  toQuery: ({ pluginId }) => ({ pluginId }),
});

/**
 * The model permission rules, for registration with the permission backend.
 *
 * @alpha
 */
export const aiModelPermissionRules = { isModel, isProvider, isModelType };

/**
 * The tool permission rules, for registration with the permission backend.
 *
 * @alpha
 */
export const aiToolPermissionRules = { isTool, isServer, isPlugin };

const modelExports = createConditionExports({
  resourceRef: aiModelResourceRef,
  rules: aiModelPermissionRules,
});

const toolExports = createConditionExports({
  resourceRef: aiToolResourceRef,
  rules: aiToolPermissionRules,
});

/**
 * Resource reference for one harness feature.
 *
 * @alpha
 */
export const aiFeatureResourceRef = createPermissionResourceRef<
  AiFeatureResource,
  {}
>().with({ pluginId: 'ai', resourceType: RESOURCE_TYPE_AI_FEATURE });

const createFeatureRule = makeCreatePermissionRule<
  AiFeatureResource,
  {},
  typeof RESOURCE_TYPE_AI_FEATURE
>();

/**
 * Matches exactly one harness feature.
 *
 * @alpha
 */
export const isFeature = createFeatureRule({
  name: 'IS_FEATURE',
  resourceType: RESOURCE_TYPE_AI_FEATURE,
  description: 'Match a harness feature by name',
  paramsSchema: z.object({
    feature: z.string().describe('Feature name, e.g. `tools` or `codemode`'),
  }),
  apply: (resource, { feature }) => resource.feature === feature,
  toQuery: ({ feature }) => ({ feature }),
});

/**
 * Matches every harness feature requested by one plugin.
 *
 * @remarks
 * The feature resource carries the requesting plugin id, so availability is a
 * policy rule per plugin rather than a per-plugin configuration entry.
 *
 * @alpha
 */
export const isFeaturePlugin = createFeatureRule({
  name: 'IS_PLUGIN',
  resourceType: RESOURCE_TYPE_AI_FEATURE,
  description: 'Match every harness feature requested by the given plugin',
  paramsSchema: z.object({
    pluginId: z.string().describe('Plugin id, e.g. `scaffolder`'),
  }),
  apply: (resource, { pluginId }) => resource.pluginId === pluginId,
  toQuery: ({ pluginId }) => ({ pluginId }),
});

/**
 * The feature permission rules, for registration with the permission backend.
 *
 * @alpha
 */
export const aiFeaturePermissionRules = {
  isFeature,
  isPlugin: isFeaturePlugin,
};

const featureExports = createConditionExports({
  resourceRef: aiFeatureResourceRef,
  rules: aiFeaturePermissionRules,
});

/**
 * Conditions policy authors use for feature decisions.
 *
 * @remarks
 * `isFeature` matches one feature name; `isPlugin` matches every feature the
 * given plugin requests.
 *
 * @alpha
 */
export const aiFeatureConditions = featureExports.conditions;

/**
 * Builds a conditional decision for `ai.feature.use`.
 *
 * @alpha
 */
export const createAiFeatureConditionalDecision =
  featureExports.createConditionalDecision;

/**
 * Conditions policy authors use for model decisions.
 *
 * @remarks
 * The three rules are `isModel` for one provider and model ID pair,
 * `isProvider` for every model of one provider, and `isModelType` for every
 * model of one catalog type.
 *
 * @alpha
 */
export const aiModelConditions = modelExports.conditions;

/**
 * Builds a conditional decision for `ai.model.use`.
 *
 * @alpha
 */
export const createAiModelConditionalDecision =
  modelExports.createConditionalDecision;

/**
 * Conditions policy authors use for tool decisions.
 *
 * @remarks
 * `isTool` matches one server and tool name; `isServer` matches every tool
 * served by one tool server; `isPlugin` matches every tool dispatched from one
 * plugin's harness.
 *
 * @alpha
 */
export const aiToolConditions = toolExports.conditions;

/**
 * Builds a conditional decision for `ai.tool.use`.
 *
 * @alpha
 */
export const createAiToolConditionalDecision =
  toolExports.createConditionalDecision;

/**
 * The standard-schema validator every AI rule carries.
 *
 * @alpha
 */
export type AiParamsSchema = {
  '~standard': {
    validate(
      value: unknown,
    ):
      | { value: unknown; issues?: undefined }
      | { issues: readonly unknown[]; value?: undefined }
      | Promise<unknown>;
  };
};

/**
 * One rule as this package evaluates it in process.
 *
 * @alpha
 */
export type AiPermissionRule<TResource> = Readonly<{
  name: string;
  resourceType: string;
  /**
   * The rule's own parameter schema, through its standard-schema validator;
   * every evaluation validates against it. A rule without one, or one whose
   * validator answers asynchronously, cannot be validated and denies.
   */
  paramsSchema?: AiParamsSchema;
  apply(resource: TResource, params: never): boolean;
}>;

/**
 * Evaluates a policy's conditions against resource attributes in process.
 *
 * @remarks
 * This is the client-side half of conditional authorization: the permission
 * backend answers `ai.model.use` and `ai.tool.use` with the policy's
 * `PermissionCriteria`, and the caller — which already holds the model pair or
 * tool identity — applies the rules itself, the same way the catalog evaluates
 * entity conditions without a round trip per entity. The resource attributes
 * never leave the process; only the permission identity and the caller's
 * credentials are sent.
 *
 * This evaluator is the enforcement boundary, so it is fail-closed by
 * construction:
 *
 * - a condition naming a rule this package does not know, or a rule of a
 *   different resource type, denies;
 * - parameters are validated against the rule's own schema before `apply`, so
 *   a type-invalid params object denies instead of evaluating to something the
 *   rule never meant (an inverted `not` around a malformed condition can never
 *   grant);
 * - every node — the envelope, each compound and each leaf — must carry the
 *   queried resource type, and a `pluginId` when present must be this plugin's,
 *   so a foreign-resource response can never be satisfied by a leaf of the
 *   queried type;
 * - an empty `allOf` or `anyOf` denies. The permission framework types compounds
 *   as non-empty, so this case only arises from a degenerate or hand-built
 *   response; where the framework would treat an empty compound as vacuously
 *   true, this guard is deliberately stricter.
 *
 * @alpha
 */
export function evaluatePermissionCriteria<TResource>(options: {
  criteria: PermissionCriteria<PermissionCondition>;
  resourceType: string;
  rules: readonly AiPermissionRule<TResource>[];
  resource: TResource;
}): boolean {
  const context = {
    resourceType: options.resourceType,
    rules: options.rules,
    resource: options.resource,
  };
  try {
    assertValidCriteria(options.criteria, context);
    return evaluateCriteria(options.criteria, context);
  } catch {
    return false;
  }
}

type EvaluationContext<TResource> = Readonly<{
  resourceType: string;
  rules: readonly AiPermissionRule<TResource>[];
  resource: TResource;
}>;

/** The plugin id every AI condition node must carry when it carries one. */
const AI_PLUGIN_ID = 'ai';

const OPERATORS = ['allOf', 'anyOf', 'not'] as const;
const LEAF_KEYS = ['rule', 'params'] as const;

/**
 * Validates the whole criteria tree before any boolean evaluation.
 *
 * @remarks
 * Two passes on purpose: boolean evaluation short-circuits, so a valid first
 * branch would otherwise hide a malformed later one (`anyOf`) or stop before
 * reaching it (`allOf`). Validation visits every node first and any
 * malformation denies the whole response — a mixed operator node, an empty
 * compound, a foreign envelope or leaf, an unknown rule, or parameters the
 * rule's schema rejects.
 */
function assertValidCriteria<TResource>(
  criteria: unknown,
  context: EvaluationContext<TResource>,
  depth = 0,
): void {
  if (depth > 32) {
    throw new Error('Permission criteria nested too deeply');
  }
  if (!criteria || typeof criteria !== 'object' || Array.isArray(criteria)) {
    throw new Error('Invalid permission criteria node');
  }
  const node = criteria as Record<string, unknown>;
  if (
    node.resourceType !== undefined &&
    node.resourceType !== context.resourceType
  ) {
    throw new Error(
      `Permission criteria for a foreign resource type: '${String(
        node.resourceType,
      )}' is not '${context.resourceType}'`,
    );
  }
  if (node.pluginId !== undefined && node.pluginId !== AI_PLUGIN_ID) {
    throw new Error(
      `Permission criteria for a foreign plugin: '${String(
        node.pluginId,
      )}' is not '${AI_PLUGIN_ID}'`,
    );
  }
  const operators = OPERATORS.filter(operator => operator in node);
  const hasLeaf = LEAF_KEYS.some(key => key in node);
  if (operators.length + (hasLeaf ? 1 : 0) !== 1) {
    throw new Error(
      'Malformed permission criteria node: expected one operator',
    );
  }
  const allowedKeys = new Set<string>([
    'resourceType',
    'pluginId',
    ...operators,
    ...(hasLeaf ? LEAF_KEYS : []),
  ]);
  for (const key of Object.keys(node)) {
    if (!allowedKeys.has(key)) {
      throw new Error(`Unknown field in permission criteria node: '${key}'`);
    }
  }
  if (operators.length === 1 && operators[0] !== 'not') {
    const branches = node[operators[0] as 'allOf' | 'anyOf'];
    if (!Array.isArray(branches) || branches.length === 0) {
      throw new Error(
        `Empty or malformed permission criteria compound: '${operators[0]}'`,
      );
    }
    for (const branch of branches) {
      assertValidCriteria(branch, context, depth + 1);
    }
    return;
  }
  if (operators.length === 1) {
    assertValidCriteria(node.not, context, depth + 1);
    return;
  }
  const name = node.rule;
  const rule = context.rules.find(
    entry => entry.name === name && entry.resourceType === context.resourceType,
  );
  if (!rule) {
    throw new Error(
      `Unsupported permission rule '${String(name)}' for resource type '${
        context.resourceType
      }'`,
    );
  }
  if (!isValidParams(rule.paramsSchema, node.params)) {
    throw new Error(
      `Invalid parameters for permission rule '${rule.name}' on resource type '${context.resourceType}'`,
    );
  }
}

/**
 * Validation is synchronous and fail-closed: no validator, a rejected value or
 * an asynchronous answer all count as invalid parameters.
 */
function isValidParams(
  schema: AiParamsSchema | undefined,
  params: unknown,
): boolean {
  const validate = schema?.['~standard']?.validate;
  if (typeof validate !== 'function') {
    return false;
  }
  const result = validate.call(schema?.['~standard'], params);
  if (!result) {
    return false;
  }
  if (typeof (result as Promise<unknown>).then === 'function') {
    // An asynchronous validator cannot be consulted synchronously, so it
    // denies — and its rejection must still be observed: an unobserved
    // rejection here would surface as an unhandled rejection in the backend
    // process (the same callable-thenable discipline the prune runner and the
    // observability emit path follow).
    void Promise.resolve(result).catch(() => undefined);
    return false;
  }
  return !('issues' in result) || !result.issues;
}

/** Evaluates a tree {@link assertValidCriteria} already accepted. */
function evaluateCriteria<TResource>(
  criteria: PermissionCriteria<PermissionCondition>,
  context: EvaluationContext<TResource>,
): boolean {
  const node = criteria as {
    allOf?: readonly PermissionCriteria<PermissionCondition>[];
    anyOf?: readonly PermissionCriteria<PermissionCondition>[];
    not?: PermissionCriteria<PermissionCondition>;
    rule?: string;
    params?: unknown;
  };
  if (node.allOf) {
    return node.allOf.every(entry => evaluateCriteria(entry, context));
  }
  if (node.anyOf) {
    return node.anyOf.some(entry => evaluateCriteria(entry, context));
  }
  if (node.not) {
    return !evaluateCriteria(node.not, context);
  }
  const rule = context.rules.find(
    entry =>
      entry.name === node.rule && entry.resourceType === context.resourceType,
  );
  if (!rule) {
    return false;
  }
  return rule.apply(context.resource, node.params as never);
}

/**
 * The authorizer this package needs: conditional decisions, never names.
 *
 * @alpha
 */
export type AiPolicyAuthorizer = Pick<
  PermissionsService,
  'authorizeConditional'
>;

/**
 * Asks the permission backend for the policy's decision on one fixed
 * permission, with the caller's own credentials.
 *
 * @remarks
 * Exactly one conditional query per check. The policy answers definitively
 * (`ALLOW` or `DENY`) or with conditions, which the caller then evaluates in
 * process against the resource it already holds. Passing the original caller
 * credentials keeps this a per-attempt recheck with the same identity the
 * dispatch runs as.
 *
 * @alpha
 */
export async function authorizeConditionalDecision(
  authorizer: AiPolicyAuthorizer,
  permission: ResourcePermission,
  credentials: BackstageCredentials,
): Promise<QueryPermissionResponse> {
  if (!credentials) throw new Error('Original credentials are required');
  const decisions = await authorizer.authorizeConditional([{ permission }], {
    credentials,
  });
  if (!Array.isArray(decisions)) {
    throw new Error('Invalid conditional permission decisions');
  }
  const decision = decisions[0];
  // A missing or unusable entry is never an allowance: the caller denies.
  if (decisions.length !== 1 || !decision || typeof decision !== 'object') {
    return { result: 'DENY' };
  }
  return decision;
}

/**
 * Reduces one decision to a concrete answer for a resource held in hand.
 *
 * @remarks
 * The response envelope is checked before the criteria tree, and separately
 * from it: a conditional decision carries its `pluginId` and `resourceType` as
 * siblings of `conditions`, so a response describing another plugin's resource
 * type denies even when its criteria happen to contain a matching leaf.
 *
 * `ALLOW` allows; `DENY`, an unknown result kind, a missing condition set, a
 * foreign envelope, and any criteria the evaluator rejects all deny through
 * {@link evaluatePermissionCriteria}. Never a pass-through.
 *
 * @alpha
 */
export function allowsConditional<TResource>(options: {
  decision: QueryPermissionResponse;
  /** The plugin id the queried permission belongs to; defaults to `ai`. */
  pluginId?: string;
  resourceType: string;
  rules: readonly AiPermissionRule<TResource>[];
  resource: TResource;
}): boolean {
  const { decision } = options;
  if (!decision || typeof decision !== 'object') return false;
  const envelope = decision as {
    result?: unknown;
    pluginId?: unknown;
    resourceType?: unknown;
    conditions?: unknown;
  };
  if (envelope.result === 'ALLOW') return true;
  if (envelope.result !== 'CONDITIONAL') return false;
  if (envelope.pluginId !== (options.pluginId ?? AI_PLUGIN_ID)) return false;
  if (envelope.resourceType !== options.resourceType) return false;
  if (!envelope.conditions) return false;
  return evaluatePermissionCriteria({
    criteria: envelope.conditions as PermissionCriteria<PermissionCondition>,
    resourceType: options.resourceType,
    rules: options.rules,
    resource: options.resource,
  });
}
