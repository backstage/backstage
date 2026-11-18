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

/**
 * A compile fixture for the README's policy snippet: the snippet is kept
 * verbatim here so root `yarn tsc` proves it against the current surface. Not
 * exported from any entrypoint.
 */
import {
  isPermission,
  type PolicyDecision,
} from '@backstage/plugin-permission-common';
import type {
  PermissionPolicy,
  PolicyQuery,
  PolicyQueryUser,
} from '@backstage/plugin-permission-node';
import {
  aiModelConditions,
  aiToolConditions,
  createAiModelConditionalDecision,
  createAiToolConditionalDecision,
} from '@backstage/ai-node/alpha';
import {
  aiModelUsePermission,
  aiToolUsePermission,
} from '@backstage/plugin-ai-common';

export class AiPolicy implements PermissionPolicy {
  async handle(
    request: PolicyQuery,
    user?: PolicyQueryUser,
  ): Promise<PolicyDecision> {
    if (isPermission(request.permission, aiModelUsePermission)) {
      return createAiModelConditionalDecision(request.permission, {
        anyOf: [
          aiModelConditions.isModel({ provider: 'openai', modelId: 'gpt-5' }),
          aiModelConditions.isProvider({ provider: 'anthropic' }),
          aiModelConditions.isModelType({ type: 'image' }),
        ],
      });
    }
    if (isPermission(request.permission, aiToolUsePermission)) {
      return createAiToolConditionalDecision(
        request.permission,
        aiToolConditions.isServer({ serverId: 'files' }),
      );
    }
    if (user === undefined) {
      return { result: 'DENY' };
    }
    return { result: 'ALLOW' };
  }
}

export const readmePolicySnippet = new AiPolicy();
