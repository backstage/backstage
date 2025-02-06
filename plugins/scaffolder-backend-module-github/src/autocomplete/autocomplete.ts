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

import { InputError } from '@backstage/errors';
import { getOctokitOptions } from '../util';
import { Octokit } from 'octokit';
import { ScmIntegrationRegistry } from '@backstage/integration';

export function createHandleAutocompleteRequest(options: {
  integrations: ScmIntegrationRegistry;
}) {
  return async function handleAutocompleteRequest({
    resource,
    token,
    context,
  }: {
    resource: string;
    token: string;
    context: Record<string, string>;
  }): Promise<{ results: { title?: string; id: string }[] }> {
    const { integrations } = options;
    const octokitOptions = await getOctokitOptions({
      integrations,
      token,
      host: context.host ?? 'github.com',
    });
    const client = new Octokit(octokitOptions);

    switch (resource) {
      case 'repositoriesWithOwner': {
        const repositoriesWithOwner = await client.paginate(
          client.rest.repos.listForAuthenticatedUser,
        );

        const results = repositoriesWithOwner.map(r => ({ id: r.full_name }));

        return { results };
      }
      case 'branches': {
        if (!context.owner || !context.repository)
          throw new InputError(
            'Missing owner and/or repository context parameter',
          );

        const branches = await client.paginate(client.rest.repos.listBranches, {
          owner: context.owner,
          repo: context.repository,
        });

        const results = branches.map(r => ({ id: r.name }));

        return { results };
      }
      default:
        throw new InputError(`Invalid resource: ${resource}`);
    }
  };
}
