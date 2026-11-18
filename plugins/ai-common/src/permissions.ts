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
  createPermission,
  type BasicPermission,
  type ResourcePermission,
} from '@backstage/plugin-permission-common';

/**
 * Permission resource type which corresponds to one cataloged AI model.
 *
 * @public
 */
export const RESOURCE_TYPE_AI_MODEL = 'ai-model';

/**
 * Permission resource type which corresponds to one registered AI tool.
 *
 * @public
 */
export const RESOURCE_TYPE_AI_TOOL = 'ai-tool';

/**
 * The attributes a policy sees for one model: the identity pair plus the
 * catalog type when the installation declares one.
 *
 * @public
 */
export type AiModelResource = Readonly<{
  provider: string;
  modelId: string;
  type?: string;
}>;

/**
 * The attributes a policy sees for one tool.
 *
 * @public
 */
export type AiToolResource = Readonly<{
  serverId: string;
  toolName: string;
}>;

/** Convenience type for model use permissions. @public */
export type AiModelPermission = ResourcePermission<
  typeof RESOURCE_TYPE_AI_MODEL
>;

/** Convenience type for tool use permissions. @public */
export type AiToolPermission = ResourcePermission<typeof RESOURCE_TYPE_AI_TOOL>;

/**
 * Permission required to use a model from the installation catalog.
 *
 * @remarks
 * There is one permission for every model, not one per model: granularity comes
 * from the permission rules (`isModel`, `isProvider`, `isModelType`) that
 * policies apply as conditions. A policy that returns a blanket ALLOW for this
 * permission grants every cataloged model.
 *
 * @public
 */
export const aiModelUsePermission = createPermission({
  name: 'ai.model.use',
  attributes: {},
  resourceType: RESOURCE_TYPE_AI_MODEL,
});

/**
 * Permission required to dispatch a registered tool.
 *
 * @remarks
 * As with model use, one permission covers every tool and granularity comes
 * from the tool rules (`isTool`, `isServer`). A blanket ALLOW grants every
 * registered tool.
 *
 * @public
 */
export const aiToolUsePermission = createPermission({
  name: 'ai.tool.use',
  attributes: {},
  resourceType: RESOURCE_TYPE_AI_TOOL,
});

/**
 * Permission required for every AI HTTP operation on a plugin's own sessions.
 *
 * @public
 */
export const aiSessionUsePermission: BasicPermission = createPermission({
  name: 'ai.session.use',
  attributes: {},
});

/**
 * Permission required to read the attempt journal of a session the caller
 * owns.
 *
 * @public
 */
export const aiAuditReadPermission: BasicPermission = createPermission({
  name: 'ai.audit.read',
  attributes: { action: 'read' },
});
