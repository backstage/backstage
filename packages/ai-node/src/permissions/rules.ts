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
  RESOURCE_TYPE_AI_MODEL,
  RESOURCE_TYPE_AI_TOOL,
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
export const aiToolPermissionRules = { isTool, isServer };

const modelExports = createConditionExports({
  resourceRef: aiModelResourceRef,
  rules: aiModelPermissionRules,
});

const toolExports = createConditionExports({
  resourceRef: aiToolResourceRef,
  rules: aiToolPermissionRules,
});

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
 * served by one tool server.
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
 * One rule as this package evaluates it in process.
 *
 * @alpha
 */
export type AiPermissionRule<TResource> = Readonly<{
  name: string;
  resourceType: string;
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
 * entity conditions without a round trip per entity.
 *
 * Fail-closed by construction: a condition naming a rule this package does not
 * know, naming a rule of a different resource type, carrying parameters the
 * rule rejects, or a rule that throws all evaluate to `false`. Only a criteria
 * that evaluates positively allows.
 *
 * @alpha
 */
export function evaluatePermissionCriteria<TResource>(
  criteria: PermissionCriteria<PermissionCondition>,
  rules: readonly AiPermissionRule<TResource>[],
  resource: TResource,
): boolean {
  try {
    return evaluate(criteria, rules, resource);
  } catch {
    return false;
  }
}

function evaluate<TResource>(
  criteria: PermissionCriteria<PermissionCondition>,
  rules: readonly AiPermissionRule<TResource>[],
  resource: TResource,
): boolean {
  if ('anyOf' in criteria) {
    return criteria.anyOf.some(entry => evaluate(entry, rules, resource));
  }
  if ('allOf' in criteria) {
    return criteria.allOf.every(entry => evaluate(entry, rules, resource));
  }
  if ('not' in criteria) {
    return !evaluate(criteria.not, rules, resource);
  }
  const rule = rules.find(
    entry =>
      entry.name === criteria.rule &&
      entry.resourceType === criteria.resourceType,
  );
  if (!rule) {
    throw new Error(
      `Unsupported permission rule '${criteria.rule}' for resource type '${criteria.resourceType}'`,
    );
  }
  return rule.apply(resource, criteria.params as never);
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
 * `ALLOW` allows, `DENY` and any non-decision deny, and a conditional decision
 * is evaluated with {@link evaluatePermissionCriteria}, so an unknown rule, a
 * mismatched resource type or unusable parameters deny. Never a pass-through.
 *
 * @alpha
 */
export function allowsConditional<TResource>(
  decision: QueryPermissionResponse,
  rules: readonly AiPermissionRule<TResource>[],
  resource: TResource,
): boolean {
  if (!decision || typeof decision !== 'object') return false;
  if (decision.result === 'ALLOW') return true;
  if (decision.result !== 'CONDITIONAL') return false;
  return evaluatePermissionCriteria(decision.conditions, rules, resource);
}
