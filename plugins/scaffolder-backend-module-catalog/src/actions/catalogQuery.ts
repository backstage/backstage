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

import type { CatalogService } from '@backstage/plugin-catalog-node';
import { createTemplateAction } from '@backstage/plugin-scaffolder-node';

export const createCatalogQueryAction = ({
  catalog,
}: {
  catalog: CatalogService;
}) =>
  createTemplateAction({
    id: 'catalog:entities:query',
    description: 'Query catalog entities',
    schema: {
      input: {
        filter: z =>
          z
            .union([
              z.record(z.union([z.string(), z.array(z.string())])),
              z.array(z.record(z.union([z.string(), z.array(z.string())]))),
            ])
            .optional()
            .describe('A key-value based filter expression for entities'),
        fields: z =>
          z
            .array(z.string())
            .optional()
            .describe(
              'If given, return only the parts of each entity that match the field declarations',
            ),
        order: z =>
          z
            .array(
              z.object({
                field: z.string().describe('dot-separated field'),
                order: z
                  .enum(['asc', 'desc'])
                  .describe('Valid values: asc, desc'),
              }),
            )
            .optional()
            .describe('Control the sort order of the output entities'),
        fullTextFilter: z =>
          z
            .object({
              term: z.string().describe('Search term'),
              fields: z
                .array(z.string())
                .optional()
                .describe('Full text search fields'),
            })
            .optional(),
        offset: z =>
          z
            .number()
            .optional()
            .describe(
              'Offset to skip over the first N items in the result set',
            ),
        cursor: z => z.string().optional().describe('Pagination cursor'),
        limit: z =>
          z
            .number()
            .optional()
            .describe('returns at most N items from the result set'),
      },
      output: {
        entities: z => z.array(z.any()).describe('Entities'),
        totalItems: z =>
          z.number().describe('The number of entities among all the requests'),
        pageInfo: z =>
          z.object({
            nextCursor: z
              .string()
              .optional()
              .describe('The cursor for the next batch of entities'),
            prevCursor: z
              .string()
              .optional()
              .describe('The cursor for the previous batch of entities'),
          }),
      },
    },
    async handler(ctx) {
      const { filter, fields, order, limit, offset, fullTextFilter, cursor } =
        ctx.input;

      const credentials = await ctx.getInitiatorCredentials();

      const { items, totalItems, pageInfo } = await catalog.queryEntities(
        {
          filter,
          fields,
          limit,
          offset,
          cursor,
          fullTextFilter,
          orderFields: order,
        },
        {
          credentials,
        },
      );
      ctx.output('entities', items);
      ctx.output('totalItems', totalItems);
      ctx.output('pageInfo', pageInfo);
    },
  });
