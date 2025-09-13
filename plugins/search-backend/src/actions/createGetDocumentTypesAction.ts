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
import { SearchIndexService } from '@backstage/plugin-search-backend-node/alpha';

export const createGetDocumentTypesAction = ({
  searchIndexService,
  actionsRegistry,
}: {
  searchIndexService: SearchIndexService;
  actionsRegistry: ActionsRegistryService;
}) => {
  actionsRegistry.register({
    name: 'get-document-types',
    title: 'Query Search Engine Document Types',
    description: `
This allows you to query the supported search engine document types.
These types can be used to filter search results when performing a search query using the \`query\` action.
    `,
    attributes: {
      readOnly: true,
    },
    schema: {
      input: z => z.object({}),
      output: z =>
        z.object({
          types: z.array(z.string()).describe('The supported document types'),
        }),
    },
    action: async () => {
      const types = searchIndexService.getDocumentTypes();
      return { output: { types: Object.keys(types) } };
    },
  });
};
