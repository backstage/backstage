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
import { ActionsRegistryService } from '@backstage/backend-plugin-api/alpha';
import { CatalogService } from '@backstage/plugin-catalog-node';
import { createZodV3FilterPredicateSchema } from '@backstage/filter-predicates';

export const createQueryCatalogEntitiesAction = ({
  catalog,
  actionsRegistry,
}: {
  catalog: CatalogService;
  actionsRegistry: ActionsRegistryService;
}) => {
  actionsRegistry.register({
    name: 'query-catalog-entities',
    title: 'Query Catalog Entities',
    attributes: {
      destructive: false,
      readOnly: true,
      idempotent: true,
    },
    description: `
Query entities from the Backstage Software Catalog using predicate filters.

## Catalog Model

The catalog contains entities of different kinds. Every entity has "kind", "apiVersion", "metadata", and optionally "spec" and "relations". Fields use dot notation for querying.

Common metadata fields on all entities: name, namespace (default: "default"), title, description, labels, annotations, tags (string array), links.

Entity references use the format "kind:namespace/name", e.g. "component:default/my-service" or "user:default/jane.doe".

### Entity Kinds

**Component** - A piece of software such as a service, website, or library.
  spec fields: type (e.g. "service", "website", "library"), lifecycle (e.g. "production", "experimental", "deprecated"), owner (entity ref), system, subcomponentOf, providesApis, consumesApis, dependsOn, dependencyOf.

**API** - An interface that components expose, such as REST APIs or event streams.
  spec fields: type (e.g. "openapi", "asyncapi", "graphql", "grpc"), lifecycle, owner (entity ref), definition (the API spec content), system.

**System** - A collection of components, APIs, and resources that together expose some functionality.
  spec fields: owner (entity ref), domain, type.

**Domain** - A grouping of systems that share terminology, domain models, and business purpose.
  spec fields: owner (entity ref), subdomainOf, type.

**Resource** - Infrastructure required to operate a component, such as databases or storage buckets.
  spec fields: type, owner (entity ref), system, dependsOn, dependencyOf.

**Group** - An organizational entity such as a team or business unit.
  spec fields: type (e.g. "team", "business-unit"), children (entity refs), parent (entity ref), members (entity refs), profile (displayName, email, picture).

**User** - A person, such as an employee or contractor.
  spec fields: memberOf (entity refs), profile (displayName, email, picture).

**Location** - A marker that references other catalog descriptor files to be ingested.
  spec fields: type, target, targets, presence.

### Relations

Entities have bidirectional relations stored in the "relations" array. Common relation types: ownedBy/ownerOf, dependsOn/dependencyOf, providesApi/apiProvidedBy, consumesApi/apiConsumedBy, parentOf/childOf, memberOf/hasMember, partOf/hasPart.

Relations can be queried via "relations.<type>" e.g. "relations.ownedby: user:default/jane-doe". The value there must always be a valid entity reference.

When querying for entity relationships, prefer using relations over spec fields. For example, use "relations.ownedby" instead of "spec.owner" to find entities owned by a particular group or user.

## Query Syntax

The query uses predicate expressions with dot-notation field paths.

Simple matching:
  { query: { kind: "Component" } }
  { query: { kind: "Component", "spec.type": "service" } }

Value operators:
  { query: { kind: { "$in": ["API", "Component"] } } }
  { query: { "metadata.annotations.backstage.io/techdocs-ref": { "$exists": true } } }
  { query: { "metadata.tags": { "$contains": "java" } } }
  { query: { "metadata.name": { "$hasPrefix": "team-" } } }

Logical operators:
  { query: { "$all": [{ kind: "Component" }, { "spec.lifecycle": "production" }] } }
  { query: { "$any": [{ "spec.type": "service" }, { "spec.type": "website" }] } }
  { query: { "$not": { kind: "Group" } } }

Querying relations - find all entities owned by a specific group:
  { query: { "relations.ownedby": "group:default/team-alpha" } }

Combined example - find production services or websites with TechDocs:
  { query: { "$all": [
    { kind: "Component", "spec.lifecycle": "production" },
    { "$any": [{ "spec.type": "service" }, { "spec.type": "website" }] },
    { "metadata.annotations.backstage.io/techdocs-ref": { "$exists": true } }
  ] } }

## Other Options

Limit returned fields: { fields: ["kind", "metadata.name", "metadata.namespace"] }
Sort results: { orderFields: { field: "metadata.name", order: "asc" } }
Full text search: { fullTextFilter: { term: "auth", fields: ["metadata.name", "metadata.title"] } }
Pagination: Use limit (e.g. 20) and the returned nextPageCursor for subsequent requests via cursor.
    `,
    schema: {
      input: z =>
        z.object({
          query: createZodV3FilterPredicateSchema(z)
            .optional()
            .describe(
              'Entity predicate query. Supports field matching, $all, $any, $not, $exists, $in, $contains, and $hasPrefix operators.',
            ),
          fields: z
            .array(z.string())
            .optional()
            .describe(
              'Specific fields to include in the response. If not provided, all fields are returned. Each entry is a dot separated path into an entity, e.g. `spec.type`.',
            ),
          limit: z
            .number()
            .int()
            .positive()
            .optional()
            .describe('Maximum number of entities to return at a time.'),
          offset: z
            .number()
            .int()
            .min(0)
            .optional()
            .describe('Number of entities to skip before returning results.'),
          orderFields: z
            .union([
              z.object({
                field: z
                  .string()
                  .describe(
                    'Field to order by. The format is a dot separated path into an entity, e.g. `spec.type`.',
                  ),
                order: z.enum(['asc', 'desc']).describe('Sort order'),
              }),
              z.array(
                z.object({
                  field: z
                    .string()
                    .describe(
                      'Field to order by. The format is a dot separated path into an entity, e.g. `spec.type`.',
                    ),
                  order: z.enum(['asc', 'desc']).describe('Sort order'),
                }),
              ),
            ])
            .optional()
            .describe(
              'Ordering criteria for the results. Can be a single order directive or an array for multi-field sorting.',
            ),
          fullTextFilter: z
            .object({
              term: z.string().describe('Full text search term'),
              fields: z
                .array(z.string())
                .optional()
                .describe(
                  'Fields to search within. Each entry is a dot separated path into an entity, e.g. `spec.type`.',
                ),
            })
            .optional()
            .describe('Full text search criteria'),
          cursor: z
            .string()
            .optional()
            .describe(
              'Cursor for pagination. This can be used only after the first request with a response containing a cursor. If a cursor is given it takes precedence over `offset`.',
            ),
        }),
      output: z =>
        z.object({
          items: z
            .array(z.object({}).passthrough())
            .describe('List of entities'),
          totalItems: z.number().describe('Total number of entities'),
          hasMoreEntities: z
            .boolean()
            .describe('Whether more entities are available'),
          nextPageCursor: z
            .string()
            .optional()
            .describe('Next page cursor used to fetch next page of entities'),
        }),
    },
    action: async ({ input, credentials }) => {
      const response = await catalog.queryEntities(
        {
          ...input,
          query: input.query,
        },
        { credentials },
      );

      return {
        output: {
          items: response.items,
          totalItems: response.totalItems,
          hasMoreEntities: !!response.pageInfo.nextCursor,
          nextPageCursor: response.pageInfo.nextCursor,
        },
      };
    },
  });
};
