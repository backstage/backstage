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

export async function handleBitbucketCloudRequest(
  token: string,
  resource: string,
  parameters: Record<string, string>,
): Promise<string[]> {
  const client = BitbucketCloudClient.fromConfig({
    host: 'bitbucket.org',
    apiBaseUrl: 'https://api.bitbucket.org/2.0',
    accessToken: token,
  });

  switch (resource) {
    case 'workspaces': {
      const result: string[] = [];

      for await (const page of client.listWorkspaces().iteratePages()) {
        const slugs = [...page.values!].map(p => p.slug!);
        result.push(...slugs);
      }

      return result;
    }
    case 'projects': {
      if (!parameters.workspace)
        throw new InputError('Missing workspace query parameter');

      const result: string[] = [];

      for await (const page of client
        .listProjectsByWorkspace(parameters.workspace)
        .iteratePages()) {
        const keys = [...page.values!].map(p => p.key!);
        result.push(...keys);
      }

      return result;
    }
    case 'repositories': {
      if (!parameters.workspace || !parameters.project)
        throw new InputError(
          'Missing workspace and/or project query parameter',
        );

      const result: string[] = [];

      for await (const page of client
        .listRepositoriesByWorkspace(parameters.workspace, {
          q: `project.key="${parameters.project}"`,
        })
        .iteratePages()) {
        const slugs = [...page.values!].map(p => p.slug!);
        result.push(...slugs);
      }

      return result;
    }
    default:
      throw new InputError(`Invalid resource: ${resource}`);
  }
}
