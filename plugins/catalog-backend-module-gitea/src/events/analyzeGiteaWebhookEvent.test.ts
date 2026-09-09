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

import { mockServices } from '@backstage/backend-test-utils';
import { InputError } from '@backstage/errors';
import { analyzeGiteaWebhookEvent } from './analyzeGiteaWebhookEvent';

const isRelevantPath = (path: string): boolean =>
  path.endsWith('.yaml') || path.endsWith('.yml');

describe('analyzeGiteaWebhookEvent', () => {
  const logger = mockServices.logger.mock();
  const repository = {
    html_url: 'https://gitea.example.com/org-a/repo-a',
    full_name: 'org-a/repo-a',
    default_branch: 'main',
  };

  describe('push', () => {
    it('handles file add, modify, and delete', async () => {
      const payload = {
        ref: 'refs/heads/main',
        compare_url: 'https://gitea.example.com/org-a/repo-a/compare/c0...c2',
        repository,
        total_commits: 2,
        commits: [
          {
            id: 'c1',
            url: 'https://gitea.example.com/org-a/repo-a/commit/c1',
            added: ['catalog-info.yaml'],
            modified: ['docs/catalog-info.yml', 'src/main.ts'],
            removed: [],
          },
          {
            id: 'c2',
            added: [],
            modified: [],
            removed: ['old/catalog-info.yaml'],
          },
        ],
      };

      await expect(
        analyzeGiteaWebhookEvent('push', payload, {
          logger,
          isRelevantPath,
        }),
      ).resolves.toEqual({
        result: 'ok',
        events: [
          {
            type: 'location.updated',
            url: 'https://gitea.example.com/org-a/repo-a/src/branch/main/docs/catalog-info.yml',
            context: {
              commitUrl: 'https://gitea.example.com/org-a/repo-a/commit/c1',
            },
          },
          {
            type: 'location.created',
            url: 'https://gitea.example.com/org-a/repo-a/src/branch/main/catalog-info.yaml',
            context: {
              commitUrl: 'https://gitea.example.com/org-a/repo-a/commit/c1',
            },
          },
          {
            type: 'location.deleted',
            url: 'https://gitea.example.com/org-a/repo-a/src/branch/main/old/catalog-info.yaml',
            context: {
              commitUrl: 'https://gitea.example.com/org-a/repo-a/commit/c2',
            },
          },
        ],
      });
    });

    it('collapses add followed by remove of the same path, but keeps separate add and delete', async () => {
      const payload = {
        ref: 'refs/heads/main',
        repository,
        total_commits: 2,
        commits: [
          {
            id: 'c1',
            url: 'https://gitea.example.com/org-a/repo-a/commit/c1',
            added: ['temporary/catalog-info.yaml', 'new/catalog-info.yaml'],
            modified: [],
            removed: ['old/catalog-info.yaml'],
          },
          {
            id: 'c2',
            url: 'https://gitea.example.com/org-a/repo-a/commit/c2',
            added: [],
            modified: [],
            removed: ['temporary/catalog-info.yaml'],
          },
        ],
      };

      await expect(
        analyzeGiteaWebhookEvent('push', payload, {
          logger,
          isRelevantPath,
        }),
      ).resolves.toEqual({
        result: 'ok',
        events: [
          {
            type: 'location.created',
            url: 'https://gitea.example.com/org-a/repo-a/src/branch/main/new/catalog-info.yaml',
            context: {
              commitUrl: 'https://gitea.example.com/org-a/repo-a/commit/c1',
            },
          },
          {
            type: 'location.deleted',
            url: 'https://gitea.example.com/org-a/repo-a/src/branch/main/old/catalog-info.yaml',
            context: {
              commitUrl: 'https://gitea.example.com/org-a/repo-a/commit/c1',
            },
          },
        ],
      });
    });

    it('falls back to a coarse repository.updated event if the commits array was truncated', async () => {
      const payload = {
        ref: 'refs/heads/main',
        repository,
        total_commits: 50,
        commits: [
          {
            id: 'c1',
            url: 'https://gitea.example.com/org-a/repo-a/commit/c1',
            added: [],
            modified: ['src/main.ts'],
            removed: [],
          },
        ],
      };

      await expect(
        analyzeGiteaWebhookEvent('push', payload, {
          logger,
          isRelevantPath,
        }),
      ).resolves.toEqual({
        result: 'ok',
        events: [
          {
            type: 'repository.updated',
            url: 'https://gitea.example.com/org-a/repo-a',
          },
        ],
      });
    });

    it('ignores pushes to other branches, without commits, or without relevant paths', async () => {
      const commits = [
        {
          id: 'c1',
          added: ['catalog-info.yaml'],
          modified: [],
          removed: [],
        },
      ];

      await expect(
        analyzeGiteaWebhookEvent(
          'push',
          { ref: 'refs/heads/feature-a', repository, commits },
          { logger, isRelevantPath },
        ),
      ).resolves.toEqual({
        result: 'ignored',
        reason:
          'Gitea push event did not target the default branch, found "refs/heads/feature-a" but expected "refs/heads/main": https://gitea.example.com/org-a/repo-a',
      });

      await expect(
        analyzeGiteaWebhookEvent(
          'push',
          { ref: 'refs/heads/main', repository, commits: [] },
          { logger, isRelevantPath },
        ),
      ).resolves.toEqual({
        result: 'ignored',
        reason:
          'Gitea push event did not contain any commits: https://gitea.example.com/org-a/repo-a',
      });

      await expect(
        analyzeGiteaWebhookEvent(
          'push',
          {
            ref: 'refs/heads/main',
            repository,
            commits: [
              { id: 'c1', added: [], modified: ['src/main.ts'], removed: [] },
            ],
          },
          { logger, isRelevantPath },
        ),
      ).resolves.toEqual({
        result: 'ignored',
        reason:
          'Gitea push event did not affect any relevant paths: https://gitea.example.com/org-a/repo-a',
      });
    });

    it('aborts if the repository url is missing', async () => {
      await expect(
        analyzeGiteaWebhookEvent(
          'push',
          {
            ref: 'refs/heads/main',
            commits: [
              {
                id: 'c1',
                added: ['catalog-info.yaml'],
                modified: [],
                removed: [],
              },
            ],
          },
          { logger, isRelevantPath },
        ),
      ).resolves.toEqual({
        result: 'aborted',
        reason: 'Gitea push event did not include repository.html_url',
      });
    });
  });

  describe('repository', () => {
    it('handles repository created and deleted', async () => {
      await expect(
        analyzeGiteaWebhookEvent(
          'repository',
          { action: 'created', repository },
          { logger, isRelevantPath },
        ),
      ).resolves.toEqual({
        result: 'ok',
        events: [
          {
            type: 'repository.created',
            url: 'https://gitea.example.com/org-a/repo-a',
          },
        ],
      });

      await expect(
        analyzeGiteaWebhookEvent(
          'repository',
          { action: 'deleted', repository },
          { logger, isRelevantPath },
        ),
      ).resolves.toEqual({
        result: 'ok',
        events: [
          {
            type: 'repository.deleted',
            url: 'https://gitea.example.com/org-a/repo-a',
          },
        ],
      });
    });

    it('handles repository rename as repository move', async () => {
      await expect(
        analyzeGiteaWebhookEvent(
          'repository',
          {
            action: 'renamed',
            repository,
            changes: { name: { from: 'repo-a-old' } },
          },
          { logger, isRelevantPath },
        ),
      ).resolves.toEqual({
        result: 'ok',
        events: [
          {
            type: 'repository.moved',
            fromUrl: 'https://gitea.example.com/org-a/repo-a-old',
            toUrl: 'https://gitea.example.com/org-a/repo-a',
          },
        ],
      });

      await expect(
        analyzeGiteaWebhookEvent(
          'repository',
          { action: 'renamed', repository },
          { logger, isRelevantPath },
        ),
      ).resolves.toEqual({
        result: 'aborted',
        reason:
          'Gitea repository renamed event did not include repository.html_url and changes.name.from',
      });
    });

    it('marks unknown repository actions as unsupported', async () => {
      await expect(
        analyzeGiteaWebhookEvent(
          'repository',
          { action: 'starred', repository },
          { logger, isRelevantPath },
        ),
      ).resolves.toEqual({
        result: 'unsupported-event',
        event: 'repository.starred',
      });
    });
  });

  it('marks unknown event types as unsupported and rejects non-object payloads', async () => {
    await expect(
      analyzeGiteaWebhookEvent(
        'issues',
        { action: 'opened' },
        { logger, isRelevantPath },
      ),
    ).resolves.toEqual({
      result: 'unsupported-event',
      event: 'issues',
    });

    await expect(
      analyzeGiteaWebhookEvent('push', 'not-an-object', {
        logger,
        isRelevantPath,
      }),
    ).rejects.toThrow(InputError);
  });
});
