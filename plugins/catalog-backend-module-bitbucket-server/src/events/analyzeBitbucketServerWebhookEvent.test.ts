/*
 * Copyright 2026 The Backstage Authors
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

import { analyzeBitbucketServerWebhookEvent } from './analyzeBitbucketServerWebhookEvent';

function repository(slug: string) {
  return {
    slug,
    id: 84,
    name: slug,
    project: { key: 'PROJ', id: 12, name: 'project' },
    links: {
      clone: [
        {
          href: `https://bitbucket.example.com/scm/proj/${slug}.git`,
          name: 'http',
        },
      ],
      self: [
        {
          href: `https://bitbucket.example.com/projects/PROJ/repos/${slug}/browse`,
        },
      ],
    },
  };
}

describe('analyzeBitbucketServerWebhookEvent', () => {
  describe('repo:refs_changed', () => {
    it('emits repository.updated for a push event', async () => {
      await expect(
        analyzeBitbucketServerWebhookEvent('repo:refs_changed', {
          actor: { name: 'admin', id: 1 },
          repository: repository('repository'),
          changes: [
            {
              ref: {
                id: 'refs/heads/master',
                displayId: 'master',
                type: 'BRANCH',
              },
              refId: 'refs/heads/master',
              fromHash: '...',
              toHash: '...',
              type: 'UPDATE',
            },
          ],
        }),
      ).resolves.toEqual({
        result: 'ok',
        events: [
          {
            type: 'repository.updated',
            url: 'https://bitbucket.example.com/projects/PROJ/repos/repository/browse',
          },
        ],
      });
    });

    it('aborts when repository URL is missing', async () => {
      await expect(
        analyzeBitbucketServerWebhookEvent('repo:refs_changed', {
          actor: { name: 'admin', id: 1 },
          repository: { slug: 'repository', project: { key: 'PROJ' } },
          changes: [],
        }),
      ).resolves.toEqual({
        result: 'aborted',
        reason:
          'Bitbucket Server repo:refs_changed event did not include repository.links.self[0].href',
      });
    });
  });

  describe('repo:modified', () => {
    it('emits repository.moved when the repository is renamed', async () => {
      await expect(
        analyzeBitbucketServerWebhookEvent('repo:modified', {
          actor: { name: 'admin', id: 1 },
          old: repository('old-repository'),
          new: repository('new-repository'),
        }),
      ).resolves.toEqual({
        result: 'ok',
        events: [
          {
            type: 'repository.moved',
            fromUrl:
              'https://bitbucket.example.com/projects/PROJ/repos/old-repository/browse',
            toUrl:
              'https://bitbucket.example.com/projects/PROJ/repos/new-repository/browse',
          },
        ],
      });
    });

    it('emits repository.updated when the URL is unchanged', async () => {
      await expect(
        analyzeBitbucketServerWebhookEvent('repo:modified', {
          actor: { name: 'admin', id: 1 },
          old: repository('repository'),
          new: repository('repository'),
        }),
      ).resolves.toEqual({
        result: 'ok',
        events: [
          {
            type: 'repository.updated',
            url: 'https://bitbucket.example.com/projects/PROJ/repos/repository/browse',
          },
        ],
      });
    });

    it('aborts when the new repository URL is missing', async () => {
      await expect(
        analyzeBitbucketServerWebhookEvent('repo:modified', {
          actor: { name: 'admin', id: 1 },
          old: repository('repository'),
          new: { slug: 'repository', project: { key: 'PROJ' } },
        }),
      ).resolves.toEqual({
        result: 'aborted',
        reason:
          'Bitbucket Server repo:modified event did not include new.links.self[0].href',
      });
    });
  });

  describe('general behavior', () => {
    it('throws on non-object payloads', async () => {
      await expect(
        analyzeBitbucketServerWebhookEvent('repo:refs_changed', undefined),
      ).rejects.toThrow(
        'Bitbucket Server webhook event payload is not an object',
      );

      await expect(
        analyzeBitbucketServerWebhookEvent('repo:refs_changed', []),
      ).rejects.toThrow(
        'Bitbucket Server webhook event payload is not an object',
      );
    });

    it('returns unsupported-event for unknown event types', async () => {
      await expect(
        analyzeBitbucketServerWebhookEvent('repo:forked', {
          actor: { name: 'admin', id: 1 },
        }),
      ).resolves.toEqual({
        result: 'unsupported-event',
        event: 'repo:forked',
      });
    });
  });
});
