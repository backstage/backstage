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
import { Gitlab } from '@gitbeaker/node';
import { GroupSchema } from '@gitbeaker/rest';

export async function handleAutocompleteRequest({
  resource,
  token,
  context,
}: {
  resource: string;
  token: string;
  context: Record<string, string>;
}): Promise<{
  results: { title: string; context?: { groupId?: string; userId?: string } }[];
}> {
  const client = new Gitlab({
    host: 'https://gitlab.com/',
    token,
  });

  switch (resource) {
    case 'groups': {
      let groups: GroupSchema[] = [];
      let page = 1;
      const perPage = 100;
      let response: GroupSchema[] = [];
      while (response.length < perPage) {
        response = await client.Groups.all({
          page,
          perPage,
          min_access_level: 10, // at least guest access
        });

        groups = groups.concat(response);
        page++;
      }

      const result: {
        results: {
          title: string;
          context?: { groupId?: string; userId?: string };
        }[];
      } = {
        results: groups.map(group => ({
          title: group.full_path,
          context: {
            groupId: `${group.id}`,
          },
        })),
      };
      // append also user context
      const user = await client.Users.current();
      result.results.push({
        title: user.username,
        context: {
          userId: `${user.id}`,
        },
      });

      return result;
    }
    case 'repositories': {
      if (!context.groupId && !context.userId)
        throw new InputError('Missing groupId and userId context parameter');

      let response;
      if (context.userId) {
        response = await client.Users.projects(Number(context.userId));
      } else {
        response = await client.Groups.projects(context.groupId);
      }

      return {
        results: response.map(project => ({
          title: project.name.trim(),
        })),
      };
    }
    default:
      throw new InputError(`Invalid resource: ${resource}`);
  }
}
