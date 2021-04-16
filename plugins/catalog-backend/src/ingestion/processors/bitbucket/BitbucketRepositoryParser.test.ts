/*
 * Copyright 2021 Spotify AB
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
import { defaultRepositoryParser } from './BitbucketRepositoryParser';
import { Project, Repository } from './types';
import { BitbucketClient } from './client';
import { results } from '../index';

describe('BitbucketRepositoryParser', () => {
  describe('defaultRepositoryParser', () => {
    it('emits location', async () => {
      const browseUrl =
        'https://bitbucket.mycompany.com/projects/project-key/repos/repo-slug/browse';
      const path = '/catalog-info.yaml';
      const expected = [
        results.location(
          {
            type: 'url',
            target: `${browseUrl}${path}`,
          },
          true,
        ),
      ];
      const actual = await defaultRepositoryParser({
        client: {} as BitbucketClient,
        repository: {
          project: {} as Project,
          slug: 'repo-slug',
          links: {
            self: [{ href: browseUrl }],
          },
        } as Repository,
        path: path,
      });

      let i = 0;
      for await (const entity of actual) {
        expect(entity).toStrictEqual(expected[i]);
        i++;
      }
    });
  });
});
