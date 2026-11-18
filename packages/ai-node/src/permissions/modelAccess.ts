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

import type { BackstageCredentials } from '@backstage/backend-plugin-api';
import { aiModelUsePermission } from '@backstage/plugin-ai-common';
import {
  aiModelPermissionRules,
  allowsConditional,
  authorizeConditionalDecision,
  type AiPolicyAuthorizer,
} from './rules';

/**
 * A provider and model ID pair identifying one canonical model.
 *
 * @alpha
 */
export type ModelPair = Readonly<{ provider: string; modelId: string }>;

/**
 * One canonical catalog model as discovery reports it: the identity pair
 * plus the catalog fields consumers choose models by. The optional fields
 * are present exactly when the canonical catalog entry carries them; a
 * pair without them still authorizes.
 *
 * @alpha
 */
export type ModelDescriptor = Readonly<{
  provider: string;
  modelId: string;
  /** Certified adapter identifier of the provider module. */
  api?: string;
  /** Model type, e.g. `chat`, `classifier`, or `image`. */
  type?: string;
  /** Context window in tokens. */
  contextWindow?: number;
  /** Output limit in tokens. */
  maxTokens?: number;
}>;

function attributesOf(model: ModelDescriptor) {
  return {
    provider: model.provider,
    modelId: model.modelId,
    ...(model.type === undefined ? {} : { type: model.type }),
  };
}

/**
 * Per-model authorization over the one fixed model-use permission.
 *
 * @remarks
 * Each check asks the policy for a decision on `ai.model.use` — model pairs
 * travel as the resource the caller already holds, never in a permission name
 * or a resource reference — and evaluates the answer against that model's
 * `{ provider, modelId, type }` attributes with the model rules. A blanket
 * `ALLOW` grants every cataloged model; `DENY`, no decision, or a condition
 * that does not match denies. Discovery filters the same way, catalog-list
 * style: one conditional query, then the criteria applied per pair.
 *
 * @internal
 */
export function createModelAccess(options: {
  models: readonly ModelDescriptor[];
  authorizer: AiPolicyAuthorizer;
}) {
  const models = options.models.map(descriptor => Object.freeze(descriptor));

  return {
    async canUse(model: ModelPair, credentials: BackstageCredentials) {
      const entry = models.find(
        candidate =>
          candidate.provider === model.provider &&
          candidate.modelId === model.modelId,
      );
      if (!entry) return false;
      const decision = await authorizeConditionalDecision(
        options.authorizer,
        aiModelUsePermission,
        credentials,
      );
      return allowsConditional(
        decision,
        Object.values(aiModelPermissionRules),
        attributesOf(entry),
      );
    },
    async listModels(
      credentials: BackstageCredentials,
    ): Promise<readonly ModelDescriptor[]> {
      const decision = await authorizeConditionalDecision(
        options.authorizer,
        aiModelUsePermission,
        credentials,
      );
      const rules = Object.values(aiModelPermissionRules);
      return Object.freeze(
        models.filter(entry =>
          allowsConditional(decision, rules, attributesOf(entry)),
        ),
      );
    },
    async listProviders(
      credentials: BackstageCredentials,
    ): Promise<readonly string[]> {
      const decision = await authorizeConditionalDecision(
        options.authorizer,
        aiModelUsePermission,
        credentials,
      );
      const rules = Object.values(aiModelPermissionRules);
      return Object.freeze([
        ...new Set(
          models
            .filter(entry =>
              allowsConditional(decision, rules, attributesOf(entry)),
            )
            .map(entry => entry.provider),
        ),
      ]);
    },
  };
}
