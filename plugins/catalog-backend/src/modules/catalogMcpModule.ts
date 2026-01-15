/*
 * Copyright 2025 The Backstage Authors
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
import { createBackendModule } from '@backstage/backend-plugin-api';
import { catalogServiceRef } from '@backstage/plugin-catalog-node';
import { mcpExtensionPoint } from '@backstage/plugin-mcp-actions-backend';
import { stringifyEntityRef } from '@backstage/catalog-model';

/**
 * Catalog MCP module - registers prompts and resources for the MCP server.
 * @public
 */
export const catalogMcpModule = createBackendModule({
  pluginId: 'catalog',
  moduleId: 'mcp',
  register(env) {
    env.registerInit({
      deps: {
        mcp: mcpExtensionPoint,
        catalog: catalogServiceRef,
      },
      async init({ mcp, catalog }) {
        // Register prompts that provide context about the catalog
        mcp.addPrompts(
          {
            name: 'explore-catalog',
            title: 'Explore the Software Catalog',
            description:
              'Learn about catalog contents and how to search for entities',
            template: `
The Backstage Software Catalog is a centralized registry of all software in your organization.

**Entity Types:**
- **Components**: Services, libraries, websites, mobile apps, data pipelines
- **APIs**: REST APIs, GraphQL APIs, gRPC services, AsyncAPI definitions
- **Systems**: Groups of related components that work together
- **Resources**: Infrastructure like databases, S3 buckets, Kubernetes clusters
- **Groups**: Teams and organizational units
- **Users**: People in the organization

**Entity References:**
Each entity has a unique reference in the format: \`kind:namespace/name\`
- Default namespace is "default"
- Example: \`component:default/my-service\`, \`api:platform/auth-api\`

**How to Search:**
Use the \`get-catalog-entity\` action with the entity name to retrieve specific entities.
You can also browse by kind, owner, domain, or other metadata fields.
            `.trim(),
          },
          {
            name: 'catalog-metadata',
            title: 'Understanding Catalog Metadata',
            description:
              'Learn about entity metadata, annotations, and relationships',
            template: `
Every catalog entity contains rich metadata:

**Core Metadata Fields:**
- \`metadata.name\`: Unique identifier within a namespace
- \`metadata.title\`: Human-readable display name
- \`metadata.description\`: Purpose and overview
- \`metadata.labels\`: Key-value tags for classification
- \`metadata.annotations\`: Tool-specific configuration
- \`metadata.tags\`: Free-form categorization

**Relationships:**
Entities are connected through relationships:
- \`spec.owner\`: Which team/group owns this entity
- \`spec.system\`: Parent system this belongs to
- \`spec.dependsOn\`: Runtime dependencies on other components
- \`spec.providesApis\`: APIs this component exposes
- \`spec.consumesApis\`: APIs this component depends on

**Common Annotations:**
- \`backstage.io/source-location\`: Link to source code
- \`backstage.io/techdocs-ref\`: Documentation location
- \`github.com/project-slug\`: GitHub repository
            `.trim(),
          },
        );

        // Register resources that allow browsing catalog entities
        mcp.addResources(
          {
            name: 'catalog-entities-by-kind',
            uri: 'catalog://entities/{kind}',
            title: 'Browse Catalog Entities by Kind',
            description:
              'List all entities of a specific kind (Component, API, System, etc.)',
            mimeType: 'application/json',
            handler: async (uri, params, { credentials }) => {
              const kind = params.kind || 'Component';
              const { items } = await catalog.queryEntities(
                { filter: { kind } },
                { credentials },
              );

              return {
                contents: [
                  {
                    uri: uri.href,
                    text: JSON.stringify(
                      {
                        kind,
                        count: items.length,
                        entities: items.map(entity => ({
                          ref: stringifyEntityRef(entity),
                          name: entity.metadata.name,
                          title: entity.metadata.title,
                          description: entity.metadata.description,
                          owner:
                            typeof entity.spec?.owner === 'string'
                              ? entity.spec.owner
                              : undefined,
                        })),
                      },
                      null,
                      2,
                    ),
                    mimeType: 'application/json',
                  },
                ],
              };
            },
          },
          {
            name: 'catalog-summary',
            uri: 'catalog://summary',
            title: 'Catalog Summary Statistics',
            description:
              'Overview of entity counts by kind and other summary statistics',
            mimeType: 'application/json',
            handler: async (uri, _params, { credentials }) => {
              // Fetch all entities to compute summary stats
              const { items } = await catalog.queryEntities(
                { filter: {} },
                { credentials },
              );

              // Count by kind
              const countsByKind = items.reduce((acc, entity) => {
                acc[entity.kind] = (acc[entity.kind] || 0) + 1;
                return acc;
              }, {} as Record<string, number>);

              return {
                contents: [
                  {
                    uri: uri.href,
                    text: JSON.stringify(
                      {
                        totalEntities: items.length,
                        byKind: countsByKind,
                        lastUpdated: new Date().toISOString(),
                      },
                      null,
                      2,
                    ),
                    mimeType: 'application/json',
                  },
                ],
              };
            },
          },
        );
      },
    });
  },
});
