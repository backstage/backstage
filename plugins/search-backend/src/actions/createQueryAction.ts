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
import { SearchEngine } from '@backstage/plugin-search-backend-node';

export const createQueryAction = ({
  engine,
  actionsRegistry,
}: {
  engine: SearchEngine;
  actionsRegistry: ActionsRegistryService;
}) => {
  actionsRegistry.register({
    name: 'query',
    title: 'Query Search Engine',
    description: `
This allows you to query the search engine for documents.
Types and filters can be used to narrow down the search results.
Available types can be queried using the \`get-document-types\` action.
Pagination is supported via the \`pageLimit\` and \`pageCursor\` parameters.
Results are returned in a paginated format, along with cursors for navigating to the next and previous pages of results.
    `,
    attributes: {
      readOnly: true,
    },
    schema: {
      input: z =>
        z.object({
          term: z.string().describe('The search term to query for'),
          types: z
            .array(z.string())
            .optional()
            .describe('The types of documents to query for'),
          filters: z
            .record(z.string(), z.string())
            .optional()
            .describe('The filters to apply to the query'),
          pageLimit: z
            .number()
            .optional()
            .describe('The number of results to return per page'),
          pageCursor: z
            .string()
            .optional()
            .describe('The cursor for the next page of results'),
        }),
      output: z =>
        z.object({
          results: z
            .array(
              z.object({
                type: z.string().describe('Document type'),
                document: z.object({
                  title: z.string().describe('Document title'),
                  text: z.string().describe('Document text content'),
                  location: z.string().describe('Document location, e.g. URL'),
                }),
                highlight: z
                  .object({
                    preTag: z.string(),
                    postTag: z.string(),
                    fields: z.record(z.string(), z.string()),
                  })
                  .optional()
                  .describe('Optional result highlight'),
                rank: z.number().optional().describe('The rank of the result'),
              }),
            )
            .describe('The search results'),
          nextPageCursor: z
            .string()
            .optional()
            .describe('The cursor for the next page of results, if any'),
          previousPageCursor: z
            .string()
            .optional()
            .describe('The cursor for the previous page of results, if any'),
          numberOfResults: z
            .number()
            .optional()
            .describe('The total number of results found'),
        }),
    },
    action: async ({ input, credentials }) => {
      const resp = await engine.query(input, { credentials });
      return { output: resp };
    },
  });
};
