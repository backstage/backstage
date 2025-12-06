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
import { QueryEntitiesRequest } from '@backstage/catalog-client';

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
This allows you to query multiple entities from the software catalog using filters.
You can filter by entity properties like kind, namespace, metadata fields, and more.
Using limit is recommended to avoid fetching too many entities at once. You can use the cursor returned in the response to fetch next set of entities.
The action returns a list of entities matching the specified criteria.
Fields are using dot notation, e.g. "kind", "metadata.name", "spec.type" in the filter, fields, orderFields and fullTextFilter.fields parameters.
    `,
    schema: {
      input: z =>
        z.object({
          filter: z
            .record(z.string())
            .optional()
            .describe(
              'Filter criteria for querying entities. Keys are field paths and values are the expected values.',
            ),
          fields: z
            .array(z.string())
            .optional()
            .describe(
              'Specific fields to include in the response. If not provided, all fields are returned.',
            ),
          limit: z
            .number()
            .int()
            .positive()
            .optional()
            .describe('Maximum number of entities to return.'),
          offset: z
            .number()
            .int()
            .min(0)
            .optional()
            .describe('Number of entities to skip before returning results.'),
          orderFields: z
            .object({
              field: z.string().describe('Field to order by'),
              order: z
                .enum(['asc', 'desc'])
                .optional()
                .default('asc')
                .describe('Sort order'),
            })
            .optional()
            .describe('Ordering criteria for the results.'),
          fullTextFilter: z
            .object({
              term: z.string().describe('Full text search term'),
              fields: z
                .array(z.string())
                .optional()
                .describe('Fields to search within'),
            })
            .optional()
            .describe('Full text search criteria'),
          cursor: z
            .string()
            .optional()
            .describe(
              'Cursor for pagination. This can be used only after first request with response containing a cursor',
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
      let queryRequest: QueryEntitiesRequest;
      if (input.cursor) {
        queryRequest = {
          cursor: input.cursor,
          fields: input.fields,
          limit: input.limit,
        };
      } else {
        queryRequest = {
          filter: input.filter,
          fields: input.fields,
          limit: input.limit,
          offset: input.offset,
          orderFields: input.orderFields,
        };
      }

      const response = await catalog.queryEntities(queryRequest, {
        credentials,
      });

      return {
        output: {
          items: response.items,
          totalItems: response.totalItems,
          hasMoreEntities: response.totalItems > response.items.length,
          nextPageCursor: response.pageInfo.nextCursor,
        },
      };
    },
  });
};
