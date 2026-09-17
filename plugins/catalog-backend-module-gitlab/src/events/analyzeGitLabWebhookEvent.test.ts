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
import { analyzeGitLabWebhookEvent } from './analyzeGitLabWebhookEvent';

const isRelevantPath = (path: string): boolean =>
  path.endsWith('.yaml') || path.endsWith('.yml');

describe('analyzeGitLabWebhookEvent', () => {
  const logger = mockServices.logger.mock();

  describe('push', () => {
    it('handles file add, modify, and delete', async () => {
      const payload = {
        object_kind: 'push',
        ref: 'refs/heads/main',
        project: {
          web_url: 'https://gitlab.example.com/group-a/repo-a',
          path_with_namespace: 'group-a/repo-a',
          default_branch: 'main',
        },
        commits: [
          {
            id: 'c1',
            added: ['catalog-info.yaml'],
            modified: ['docs/catalog-info.yml'],
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
        analyzeGitLabWebhookEvent('push', payload, {
          logger,
          isRelevantPath,
        }),
      ).resolves.toMatchInlineSnapshot(`
        {
          "events": [
            {
              "context": {
                "commitUrl": "https://gitlab.example.com/group-a/repo-a/-/commit/c1",
              },
              "type": "location.updated",
              "url": "https://gitlab.example.com/group-a/repo-a/-/blob/main/docs/catalog-info.yml",
            },
            {
              "context": {
                "commitUrl": "https://gitlab.example.com/group-a/repo-a/-/commit/c1",
              },
              "type": "location.created",
              "url": "https://gitlab.example.com/group-a/repo-a/-/blob/main/catalog-info.yaml",
            },
            {
              "context": {
                "commitUrl": "https://gitlab.example.com/group-a/repo-a/-/commit/c2",
              },
              "type": "location.deleted",
              "url": "https://gitlab.example.com/group-a/repo-a/-/blob/main/old/catalog-info.yaml",
            },
          ],
          "result": "ok",
        }
      `);
    });

    it('handles file add and delete in the same commit as separate events', async () => {
      const payload = {
        object_kind: 'push',
        ref: 'refs/heads/main',
        project: {
          web_url: 'https://gitlab.example.com/group-a/repo-a',
          path_with_namespace: 'group-a/repo-a',
          default_branch: 'main',
        },
        commits: [
          {
            id: 'c3',
            added: ['new/catalog-info.yaml'],
            modified: [],
            removed: ['old/catalog-info.yaml'],
          },
        ],
      };

      await expect(
        analyzeGitLabWebhookEvent('push', payload, {
          logger,
          isRelevantPath,
        }),
      ).resolves.toMatchInlineSnapshot(`
        {
          "events": [
            {
              "context": {
                "commitUrl": "https://gitlab.example.com/group-a/repo-a/-/commit/c3",
              },
              "type": "location.created",
              "url": "https://gitlab.example.com/group-a/repo-a/-/blob/main/new/catalog-info.yaml",
            },
            {
              "context": {
                "commitUrl": "https://gitlab.example.com/group-a/repo-a/-/commit/c3",
              },
              "type": "location.deleted",
              "url": "https://gitlab.example.com/group-a/repo-a/-/blob/main/old/catalog-info.yaml",
            },
          ],
          "result": "ok",
        }
      `);
    });
  });

  describe('repository_update', () => {
    it('handles repository rename as repository move', async () => {
      const payload = {
        object_kind: 'repository_update',
        event_name: 'project_rename',
        old_path_with_namespace: 'group-a/repo-a-old',
        project: {
          web_url: 'https://gitlab.example.com/group-a/repo-a',
          path_with_namespace: 'group-a/repo-a',
        },
      };

      await expect(
        analyzeGitLabWebhookEvent('repository_update', payload, {
          logger,
          isRelevantPath,
        }),
      ).resolves.toMatchInlineSnapshot(`
        {
          "events": [
            {
              "fromUrl": "https://gitlab.example.com/group-a/repo-a-old",
              "toUrl": "https://gitlab.example.com/group-a/repo-a",
              "type": "repository.moved",
            },
          ],
          "result": "ok",
        }
      `);
    });

    it('handles repository transfer as repository move', async () => {
      const payload = {
        object_kind: 'repository_update',
        event_name: 'project_transfer',
        project: {
          web_url: 'https://gitlab.example.com/group-b/repo-a',
          path_with_namespace: 'group-b/repo-a',
        },
        changes: {
          path_with_namespace: {
            from: 'group-a/repo-a',
            to: 'group-b/repo-a',
          },
        },
      };

      await expect(
        analyzeGitLabWebhookEvent('repository_update', payload, {
          logger,
          isRelevantPath,
        }),
      ).resolves.toMatchInlineSnapshot(`
        {
          "events": [
            {
              "fromUrl": "https://gitlab.example.com/group-a/repo-a",
              "toUrl": "https://gitlab.example.com/group-b/repo-a",
              "type": "repository.moved",
            },
          ],
          "result": "ok",
        }
      `);
    });

    it('handles repository delete', async () => {
      const payload = {
        object_kind: 'repository_update',
        event_name: 'project_destroy',
        project: {
          web_url: 'https://gitlab.example.com/group-a/repo-a',
          path_with_namespace: 'group-a/repo-a',
        },
      };

      await expect(
        analyzeGitLabWebhookEvent('repository_update', payload, {
          logger,
          isRelevantPath,
        }),
      ).resolves.toMatchInlineSnapshot(`
        {
          "events": [
            {
              "type": "repository.deleted",
              "url": "https://gitlab.example.com/group-a/repo-a",
            },
          ],
          "result": "ok",
        }
      `);
    });
  });

  it('returns unsupported-event for unsupported event types', async () => {
    await expect(
      analyzeGitLabWebhookEvent(
        'merge_request',
        {
          object_kind: 'merge_request',
        },
        {
          logger,
          isRelevantPath,
        },
      ),
    ).resolves.toEqual({
      result: 'unsupported-event',
      event: 'merge_request',
    });
  });

  it('throws on malformed payloads', async () => {
    await expect(
      analyzeGitLabWebhookEvent('push', undefined, {
        logger,
        isRelevantPath,
      }),
    ).rejects.toBeInstanceOf(InputError);

    await expect(
      analyzeGitLabWebhookEvent('push', [], {
        logger,
        isRelevantPath,
      }),
    ).rejects.toBeInstanceOf(InputError);
  });
});
