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

import type {
  BackstageCredentials,
  PermissionsRegistryService,
  PermissionsService,
} from '@backstage/backend-plugin-api';
import { toolPermissionName } from '@backstage/ai-node/alpha';
import type { ToolIdentity } from '@backstage/ai-node/alpha';

type BasicPermission = Extract<
  Parameters<PermissionsRegistryService['addPermissions']>[0][number],
  { type: 'basic' }
>;

/**
 * Registers one basic permission per declared tool, mirroring model
 * permissions: `ai.tool.<server>.<tool>.use` per tool, following the model
 * permission encoding. Hosts call this with the tool identities of their
 * registered tool modules; the managed AI service itself enforces the
 * permissions, this only registers them and maps authorize requests back
 * to the identities.
 *
 * @alpha
 */
export function createToolPermissions(options: {
  tools: readonly ToolIdentity[];
  authorizer: Pick<PermissionsService, 'authorize'>;
  registry: Pick<PermissionsRegistryService, 'addPermissions'>;
}) {
  const byName = new Map<
    string,
    { identity: ToolIdentity; permission: BasicPermission }
  >();
  for (const identity of options.tools) {
    const name = toolPermissionName(identity);
    if (!byName.has(name)) {
      byName.set(name, {
        identity: Object.freeze({ ...identity }),
        permission: Object.freeze({
          type: 'basic',
          name,
          attributes: Object.freeze({}),
        }),
      });
    }
  }
  options.registry.addPermissions([...byName.values()].map(p => p.permission));

  async function authorize(
    credentials: BackstageCredentials,
    identities: readonly ToolIdentity[],
  ) {
    const requests = identities
      .map(identity => byName.get(toolPermissionName(identity)))
      .filter(
        (
          entry,
        ): entry is { identity: ToolIdentity; permission: BasicPermission } =>
          !!entry,
      )
      .map(({ permission }) => ({
        permission,
        credentials,
      }));
    if (requests.length === 0) return [] as Array<{ result: string }>;
    return options.authorizer.authorize(requests, { credentials });
  }

  return { authorize, toolPermissionName };
}
