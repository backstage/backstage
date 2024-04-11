/*
 * Copyright 2024 The Backstage Authors
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
import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import { Config } from '@backstage/config';

export const AddRepoToCodacyAction = (options: { config: Config }) => {
  const { config } = options;
  return createTemplateAction<{
    provider: string;
    owner: string;
    repository: string;
  }>({
    id: 'codacy:add-repo',
    schema: {
      input: {
        provider: 'string',
        owner: 'string',
        repository: 'string',
      },
    },
    async handler(ctx) {
      const codacyApiKey = config.getString('codacy.apiKey');
      const { provider, owner, repository } = ctx.input;
      const response = await fetch(
        'https://app.codacy.com/api/v3/repositories',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'api-token': codacyApiKey,
          },
          body: JSON.stringify({
            repositoryFullPath: `${owner}/${repository}`,
            provider: provider,
          }),
        },
      );
      if (!response.ok) {
        throw new Error(
          `Failed to add repository to Codacy: ${response.statusText}`,
        );
      }

      const data = await response.json();
      console.log('Repository added to Codacy:', data);
    },
  });
};
