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

import { createCatalogModelLayer } from '../model/createCatalogModelLayer';
import type { ApiEntityV1alpha1 } from './ApiEntityV1alpha1';
import mcpServerSchema from '../schema/kinds/API.v1alpha1.mcp-server.schema.json';
import { ajvCompiledJsonSchemaValidator } from './util';

/**
 * An MCP (Model Context Protocol) server represented as an API entity
 * (spec.type: 'mcp-server').
 *
 * @alpha
 */
export interface McpServerApiEntity extends Omit<ApiEntityV1alpha1, 'spec'> {
  spec: {
    type: 'mcp-server';
    lifecycle: string;
    owner: string;
    system?: string;
    remotes: McpServerRemote[];
  };
}

/**
 * A transport endpoint for an MCP server.
 *
 * @alpha
 */
export type McpServerRemote = {
  type: string;
  url: string;
};

/**
 * {@link KindValidator} for the `mcp-server` specType of API entities.
 *
 * @alpha
 */
export const mcpServerApiEntityValidator =
  ajvCompiledJsonSchemaValidator(mcpServerSchema);

/**
 * Type guard: narrows an entity to the MCP server API subtype.
 *
 * @alpha
 */
export function isMcpServerApiEntity(
  entity: ApiEntityV1alpha1 | McpServerApiEntity,
): entity is McpServerApiEntity {
  return entity.spec.type === 'mcp-server';
}

/**
 * Extends the API kind with the mcp-server specType.
 *
 * @alpha
 */
export const mcpServerApiEntityModel = createCatalogModelLayer({
  layerId: 'catalog.backstage.io/kind-api-mcp-server',
  builder: model => {
    model.addKindVersion({
      kind: 'API',
      versions: [
        {
          name: ['v1alpha1', 'v1beta1'],
          specType: 'mcp-server',
          description:
            'An MCP (Model Context Protocol) server exposed as an API entity.',
          relationFields: [
            {
              selector: { path: 'spec.owner' },
              relation: 'ownedBy',
              defaultKind: 'Group',
              defaultNamespace: 'inherit',
              allowedKinds: ['Group', 'User'],
            },
            {
              selector: { path: 'spec.system' },
              relation: 'partOf',
              defaultKind: 'System',
              defaultNamespace: 'inherit',
            },
          ],
          schema: { jsonSchema: mcpServerSchema },
        },
      ],
    });
  },
});
