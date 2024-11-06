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
import { BitbucketCloudClient } from '@backstage/plugin-bitbucket-cloud-common';

export async function handleAutocompleteRequest({
  resource,
  token,
  context,
}: {
  resource: string;
  token: string;
  context: Record<string, string>;
}): Promise<{ results: { title?: string; id: string }[] }> {
  const client = BitbucketCloudClient.fromConfig({
    host: 'bitbucket.org',
    apiBaseUrl: 'https://api.bitbucket.org/2.0',
    token,
  });

  switch (resource) {
    case 'workspaces': {
      const results: { title: string; id: string }[] = [];

      for await (const page of client.listWorkspaces().iteratePages()) {
        const slugs = [...page.values!].map(p => ({
          title: p.slug!,
          id: p.uuid!,
        }));
        results.push(...slugs);
      }

      return { results };
    }
    case 'projects': {
      if (!context.workspace)
        throw new InputError('Missing workspace context parameter');

      const results: { title: string; id: string }[] = [];

      for await (const page of client
        .listProjectsByWorkspace(context.workspace)
        .iteratePages()) {
        const keys = [...page.values!].map(p => ({
          title: p.key!,
          id: p.uuid!,
        }));
        results.push(...keys);
      }

      return { results };
    }
    case 'repositories': {
      if (!context.workspace || !context.project)
        throw new InputError(
          'Missing workspace and/or project context parameter',
        );

      const results: { title: string; id: string }[] = [];

      for await (const page of client
        .listRepositoriesByWorkspace(context.workspace, {
          q: `project.key="${context.project}"`,
        })
        .iteratePages()) {
        const slugs = [...page.values!].map(p => ({
          title: p.slug!,
          id: p.uuid!,
        }));
        results.push(...slugs);
      }

      return { results };
    }
    case 'branches': {
      if (!context.workspace || !context.repository)
        throw new InputError(
          'Missing workspace and/or repository context parameter',
        );

      const results: { title: string; id: string }[] = [];

      for await (const page of client
        .listBranchesByRepository(context.repository, context.workspace)
        .iteratePages()) {
        const names = [...page.values!].map(p => ({
          title: p.name!,
          id: p.name!,
        }));
        results.push(...names);
      }

      return { results };
    }
    default:
      throw new InputError(`Invalid resource: ${resource}`);
  }
}
