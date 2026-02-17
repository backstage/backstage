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

import { mockServices } from '@backstage/backend-test-utils';
import { analyzeGithubWebhookEvent } from './analyzeGithubWebhookEvent';
import { OctokitProviderService } from '../util/octokitProviderService';

const isRelevantPath = (path: string): boolean => path.endsWith('.yaml');

describe('analyzeGithubWebhookEvent', () => {
  const octokit = {
    rest: {
      repos: {
        getCommit: jest.fn(),
      },
    },
  };
  const octokitProvider = {
    getOctokit: jest.fn(async () => octokit as any),
  } satisfies OctokitProviderService;
  const logger = mockServices.logger.mock();

  function mockGetCommit(
    first: { filename: string; status: string; previous_filename?: string },
    second?: { filename: string; status: string; previous_filename?: string },
  ) {
    octokit.rest.repos.getCommit.mockImplementation(
      async (params: { ref: string }) => {
        if (params.ref === '8e0f23d8853333840f763bd7a87aa17aa6ed4b3d') {
          return {
            data: {
              html_url:
                'https://ghe.example.net/example-owner/example-repo/commit/8e0f23d8853333840f763bd7a87aa17aa6ed4b3d',
              files: [first],
            },
          };
        } else if (params.ref === '677c191848d92449c3d978becc71a59ea3e9777e') {
          return {
            data: {
              html_url:
                'https://ghe.example.net/example-owner/example-repo/commit/677c191848d92449c3d978becc71a59ea3e9777e',
              files: second ? [second] : [],
            },
          };
        }
        throw new Error(`Unexpected commit ref: ${params.ref}`);
      },
    );
  }

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('push', () => {
    it('refreshes on changes, unregisters on deletes, for the simple case', async () => {
      await expect(
        analyzeGithubWebhookEvent(
          'push',
          require('./__fixtures__/push-event-simple.json'),
          { octokitProvider, logger, isRelevantPath },
        ),
      ).resolves.toMatchInlineSnapshot(`
        {
          "events": [
            {
              "context": {
                "commitUrl": "https://ghe.example.net/example-owner/example-repo/commit/8e0f23d8853333840f763bd7a87aa17aa6ed4b3d",
              },
              "type": "location.updated",
              "url": "https://ghe.example.net/example-owner/example-repo/blob/master/catalog-info.yaml",
            },
            {
              "context": {
                "commitUrl": "https://ghe.example.net/example-owner/example-repo/commit/677c191848d92449c3d978becc71a59ea3e9777e",
              },
              "type": "location.deleted",
              "url": "https://ghe.example.net/example-owner/example-repo/blob/master/catalog-info-2.yaml",
            },
            {
              "context": {
                "commitUrl": "https://ghe.example.net/example-owner/example-repo/commit/677c191848d92449c3d978becc71a59ea3e9777e",
              },
              "type": "location.deleted",
              "url": "https://ghe.example.net/example-owner/example-repo/blob/master/catalog-info-3.yaml",
            },
          ],
          "result": "ok",
        }
      `);
    });

    it('handles push - added', async () => {
      mockGetCommit({ filename: 'a.yaml', status: 'added' });

      await expect(
        analyzeGithubWebhookEvent(
          'push',
          require('./__fixtures__/push-event-complex.json'),
          { octokitProvider, logger, isRelevantPath },
        ),
      ).resolves.toMatchInlineSnapshot(`
        {
          "events": [
            {
              "context": {
                "commitUrl": "https://ghe.example.net/example-owner/example-repo/commit/8e0f23d8853333840f763bd7a87aa17aa6ed4b3d",
              },
              "type": "location.created",
              "url": "https://ghe.example.net/example-owner/example-repo/blob/master/a.yaml",
            },
          ],
          "result": "ok",
        }
      `);
    });

    it('handles push - added then added', async () => {
      mockGetCommit(
        { filename: 'a.yaml', status: 'added' },
        { filename: 'a.yaml', status: 'added' },
      );

      await expect(
        analyzeGithubWebhookEvent(
          'push',
          require('./__fixtures__/push-event-complex.json'),
          { octokitProvider, logger, isRelevantPath },
        ),
      ).resolves.toMatchInlineSnapshot(`
        {
          "events": [
            {
              "context": {
                "commitUrl": "https://ghe.example.net/example-owner/example-repo/commit/8e0f23d8853333840f763bd7a87aa17aa6ed4b3d",
              },
              "type": "location.created",
              "url": "https://ghe.example.net/example-owner/example-repo/blob/master/a.yaml",
            },
          ],
          "result": "ok",
        }
      `);
    });

    it('handles push - added then removed', async () => {
      mockGetCommit(
        { filename: 'a.yaml', status: 'added' },
        { filename: 'a.yaml', status: 'removed' },
      );

      await expect(
        analyzeGithubWebhookEvent(
          'push',
          require('./__fixtures__/push-event-complex.json'),
          { octokitProvider, logger, isRelevantPath },
        ),
      ).resolves.toMatchInlineSnapshot(`
        {
          "events": [],
          "result": "ok",
        }
      `);
    });

    it('handles push - added then changed', async () => {
      mockGetCommit(
        { filename: 'a.yaml', status: 'added' },
        { filename: 'a.yaml', status: 'changed' },
      );

      await expect(
        analyzeGithubWebhookEvent(
          'push',
          require('./__fixtures__/push-event-complex.json'),
          { octokitProvider, logger, isRelevantPath },
        ),
      ).resolves.toMatchInlineSnapshot(`
        {
          "events": [
            {
              "context": {
                "commitUrl": "https://ghe.example.net/example-owner/example-repo/commit/8e0f23d8853333840f763bd7a87aa17aa6ed4b3d",
              },
              "type": "location.created",
              "url": "https://ghe.example.net/example-owner/example-repo/blob/master/a.yaml",
            },
          ],
          "result": "ok",
        }
      `);
    });

    it('handles push - added then renamed', async () => {
      mockGetCommit(
        { filename: 'a.yaml', status: 'added' },
        { filename: 'b.yaml', status: 'renamed', previous_filename: 'a.yaml' },
      );

      await expect(
        analyzeGithubWebhookEvent(
          'push',
          require('./__fixtures__/push-event-complex.json'),
          { octokitProvider, logger, isRelevantPath },
        ),
      ).resolves.toMatchInlineSnapshot(`
        {
          "events": [
            {
              "context": {
                "commitUrl": "https://ghe.example.net/example-owner/example-repo/commit/677c191848d92449c3d978becc71a59ea3e9777e",
              },
              "type": "location.created",
              "url": "https://ghe.example.net/example-owner/example-repo/blob/master/b.yaml",
            },
          ],
          "result": "ok",
        }
      `);
    });

    it('handles push - removed', async () => {
      mockGetCommit({ filename: 'a.yaml', status: 'removed' });

      await expect(
        analyzeGithubWebhookEvent(
          'push',
          require('./__fixtures__/push-event-complex.json'),
          { octokitProvider, logger, isRelevantPath },
        ),
      ).resolves.toMatchInlineSnapshot(`
        {
          "events": [
            {
              "context": {
                "commitUrl": "https://ghe.example.net/example-owner/example-repo/commit/8e0f23d8853333840f763bd7a87aa17aa6ed4b3d",
              },
              "type": "location.deleted",
              "url": "https://ghe.example.net/example-owner/example-repo/blob/master/a.yaml",
            },
          ],
          "result": "ok",
        }
      `);
    });

    it('handles push - removed then added', async () => {
      mockGetCommit(
        { filename: 'a.yaml', status: 'removed' },
        { filename: 'a.yaml', status: 'added' },
      );

      await expect(
        analyzeGithubWebhookEvent(
          'push',
          require('./__fixtures__/push-event-complex.json'),
          { octokitProvider, logger, isRelevantPath },
        ),
      ).resolves.toMatchInlineSnapshot(`
        {
          "events": [
            {
              "context": {
                "commitUrl": "https://ghe.example.net/example-owner/example-repo/commit/677c191848d92449c3d978becc71a59ea3e9777e",
              },
              "type": "location.updated",
              "url": "https://ghe.example.net/example-owner/example-repo/blob/master/a.yaml",
            },
          ],
          "result": "ok",
        }
      `);
    });

    it('handles push - removed then removed', async () => {
      mockGetCommit(
        { filename: 'a.yaml', status: 'removed' },
        { filename: 'a.yaml', status: 'removed' },
      );

      await expect(
        analyzeGithubWebhookEvent(
          'push',
          require('./__fixtures__/push-event-complex.json'),
          { octokitProvider, logger, isRelevantPath },
        ),
      ).resolves.toMatchInlineSnapshot(`
        {
          "events": [
            {
              "context": {
                "commitUrl": "https://ghe.example.net/example-owner/example-repo/commit/8e0f23d8853333840f763bd7a87aa17aa6ed4b3d",
              },
              "type": "location.deleted",
              "url": "https://ghe.example.net/example-owner/example-repo/blob/master/a.yaml",
            },
          ],
          "result": "ok",
        }
      `);
    });

    it('handles push - removed then changed', async () => {
      mockGetCommit(
        { filename: 'a.yaml', status: 'removed' },
        { filename: 'a.yaml', status: 'changed' },
      );

      await expect(
        analyzeGithubWebhookEvent(
          'push',
          require('./__fixtures__/push-event-complex.json'),
          { octokitProvider, logger, isRelevantPath },
        ),
      ).resolves.toMatchInlineSnapshot(`
        {
          "events": [
            {
              "context": {
                "commitUrl": "https://ghe.example.net/example-owner/example-repo/commit/8e0f23d8853333840f763bd7a87aa17aa6ed4b3d",
              },
              "type": "location.deleted",
              "url": "https://ghe.example.net/example-owner/example-repo/blob/master/a.yaml",
            },
          ],
          "result": "ok",
        }
      `);
    });

    it('ignores push - removed then renamed', async () => {
      mockGetCommit(
        { filename: 'a.yaml', status: 'removed' },
        { filename: 'b.yaml', status: 'renamed', previous_filename: 'a.yaml' },
      );

      await expect(
        analyzeGithubWebhookEvent(
          'push',
          require('./__fixtures__/push-event-complex.json'),
          { octokitProvider, logger, isRelevantPath },
        ),
      ).resolves.toMatchInlineSnapshot(`
        {
          "events": [],
          "result": "ok",
        }
      `);
    });

    it('handles push - changed', async () => {
      mockGetCommit({ filename: 'a.yaml', status: 'changed' });

      await expect(
        analyzeGithubWebhookEvent(
          'push',
          require('./__fixtures__/push-event-complex.json'),
          { octokitProvider, logger, isRelevantPath },
        ),
      ).resolves.toMatchInlineSnapshot(`
        {
          "events": [
            {
              "context": {
                "commitUrl": "https://ghe.example.net/example-owner/example-repo/commit/8e0f23d8853333840f763bd7a87aa17aa6ed4b3d",
              },
              "type": "location.updated",
              "url": "https://ghe.example.net/example-owner/example-repo/blob/master/a.yaml",
            },
          ],
          "result": "ok",
        }
      `);
    });

    it('handles push - changed then added', async () => {
      mockGetCommit(
        { filename: 'a.yaml', status: 'changed' },
        { filename: 'a.yaml', status: 'added' },
      );

      await expect(
        analyzeGithubWebhookEvent(
          'push',
          require('./__fixtures__/push-event-complex.json'),
          { octokitProvider, logger, isRelevantPath },
        ),
      ).resolves.toMatchInlineSnapshot(`
        {
          "events": [
            {
              "context": {
                "commitUrl": "https://ghe.example.net/example-owner/example-repo/commit/8e0f23d8853333840f763bd7a87aa17aa6ed4b3d",
              },
              "type": "location.updated",
              "url": "https://ghe.example.net/example-owner/example-repo/blob/master/a.yaml",
            },
          ],
          "result": "ok",
        }
      `);
    });

    it('handles push - changed then removed', async () => {
      mockGetCommit(
        { filename: 'a.yaml', status: 'changed' },
        { filename: 'a.yaml', status: 'removed' },
      );

      await expect(
        analyzeGithubWebhookEvent(
          'push',
          require('./__fixtures__/push-event-complex.json'),
          { octokitProvider, logger, isRelevantPath },
        ),
      ).resolves.toMatchInlineSnapshot(`
        {
          "events": [
            {
              "context": {
                "commitUrl": "https://ghe.example.net/example-owner/example-repo/commit/677c191848d92449c3d978becc71a59ea3e9777e",
              },
              "type": "location.deleted",
              "url": "https://ghe.example.net/example-owner/example-repo/blob/master/a.yaml",
            },
          ],
          "result": "ok",
        }
      `);
    });

    it('handles push - changed then changed', async () => {
      mockGetCommit(
        { filename: 'a.yaml', status: 'changed' },
        { filename: 'a.yaml', status: 'changed' },
      );

      await expect(
        analyzeGithubWebhookEvent(
          'push',
          require('./__fixtures__/push-event-complex.json'),
          { octokitProvider, logger, isRelevantPath },
        ),
      ).resolves.toMatchInlineSnapshot(`
        {
          "events": [
            {
              "context": {
                "commitUrl": "https://ghe.example.net/example-owner/example-repo/commit/8e0f23d8853333840f763bd7a87aa17aa6ed4b3d",
              },
              "type": "location.updated",
              "url": "https://ghe.example.net/example-owner/example-repo/blob/master/a.yaml",
            },
          ],
          "result": "ok",
        }
      `);
    });

    it('handles push - changed then renamed', async () => {
      mockGetCommit(
        { filename: 'a.yaml', status: 'changed' },
        { filename: 'b.yaml', status: 'renamed', previous_filename: 'a.yaml' },
      );

      await expect(
        analyzeGithubWebhookEvent(
          'push',
          require('./__fixtures__/push-event-complex.json'),
          { octokitProvider, logger, isRelevantPath },
        ),
      ).resolves.toMatchInlineSnapshot(`
        {
          "events": [
            {
              "context": {
                "commitUrl": "https://ghe.example.net/example-owner/example-repo/commit/677c191848d92449c3d978becc71a59ea3e9777e",
              },
              "fromUrl": "https://ghe.example.net/example-owner/example-repo/blob/master/a.yaml",
              "toUrl": "https://ghe.example.net/example-owner/example-repo/blob/master/b.yaml",
              "type": "location.moved",
            },
          ],
          "result": "ok",
        }
      `);
    });

    it('handles push - renamed', async () => {
      mockGetCommit({
        filename: 'b.yaml',
        status: 'renamed',
        previous_filename: 'a.yaml',
      });

      await expect(
        analyzeGithubWebhookEvent(
          'push',
          require('./__fixtures__/push-event-complex.json'),
          { octokitProvider, logger, isRelevantPath },
        ),
      ).resolves.toMatchInlineSnapshot(`
        {
          "events": [
            {
              "context": {
                "commitUrl": "https://ghe.example.net/example-owner/example-repo/commit/8e0f23d8853333840f763bd7a87aa17aa6ed4b3d",
              },
              "fromUrl": "https://ghe.example.net/example-owner/example-repo/blob/master/a.yaml",
              "toUrl": "https://ghe.example.net/example-owner/example-repo/blob/master/b.yaml",
              "type": "location.moved",
            },
          ],
          "result": "ok",
        }
      `);
    });

    it('handles push - renamed then added', async () => {
      mockGetCommit(
        { filename: 'b.yaml', status: 'renamed', previous_filename: 'a.yaml' },
        { filename: 'b.yaml', status: 'added' },
      );

      await expect(
        analyzeGithubWebhookEvent(
          'push',
          require('./__fixtures__/push-event-complex.json'),
          { octokitProvider, logger, isRelevantPath },
        ),
      ).resolves.toMatchInlineSnapshot(`
        {
          "events": [
            {
              "context": {
                "commitUrl": "https://ghe.example.net/example-owner/example-repo/commit/8e0f23d8853333840f763bd7a87aa17aa6ed4b3d",
              },
              "fromUrl": "https://ghe.example.net/example-owner/example-repo/blob/master/a.yaml",
              "toUrl": "https://ghe.example.net/example-owner/example-repo/blob/master/b.yaml",
              "type": "location.moved",
            },
          ],
          "result": "ok",
        }
      `);
    });

    it('handles push - renamed then removed', async () => {
      mockGetCommit(
        { filename: 'b.yaml', status: 'renamed', previous_filename: 'a.yaml' },
        { filename: 'b.yaml', status: 'removed' },
      );

      await expect(
        analyzeGithubWebhookEvent(
          'push',
          require('./__fixtures__/push-event-complex.json'),
          { octokitProvider, logger, isRelevantPath },
        ),
      ).resolves.toMatchInlineSnapshot(`
        {
          "events": [
            {
              "context": {
                "commitUrl": "https://ghe.example.net/example-owner/example-repo/commit/677c191848d92449c3d978becc71a59ea3e9777e",
              },
              "type": "location.deleted",
              "url": "https://ghe.example.net/example-owner/example-repo/blob/master/a.yaml",
            },
          ],
          "result": "ok",
        }
      `);
    });

    it('handles push - renamed then changed', async () => {
      mockGetCommit(
        { filename: 'b.yaml', status: 'renamed', previous_filename: 'a.yaml' },
        { filename: 'b.yaml', status: 'changed' },
      );

      await expect(
        analyzeGithubWebhookEvent(
          'push',
          require('./__fixtures__/push-event-complex.json'),
          { octokitProvider, logger, isRelevantPath },
        ),
      ).resolves.toMatchInlineSnapshot(`
        {
          "events": [
            {
              "context": {
                "commitUrl": "https://ghe.example.net/example-owner/example-repo/commit/8e0f23d8853333840f763bd7a87aa17aa6ed4b3d",
              },
              "fromUrl": "https://ghe.example.net/example-owner/example-repo/blob/master/a.yaml",
              "toUrl": "https://ghe.example.net/example-owner/example-repo/blob/master/b.yaml",
              "type": "location.moved",
            },
          ],
          "result": "ok",
        }
      `);
    });

    it('handles push - renamed then renamed', async () => {
      mockGetCommit(
        { filename: 'b.yaml', status: 'renamed', previous_filename: 'a.yaml' },
        { filename: 'c.yaml', status: 'renamed', previous_filename: 'b.yaml' },
      );

      await expect(
        analyzeGithubWebhookEvent(
          'push',
          require('./__fixtures__/push-event-complex.json'),
          { octokitProvider, logger, isRelevantPath },
        ),
      ).resolves.toMatchInlineSnapshot(`
        {
          "events": [
            {
              "context": {
                "commitUrl": "https://ghe.example.net/example-owner/example-repo/commit/677c191848d92449c3d978becc71a59ea3e9777e",
              },
              "fromUrl": "https://ghe.example.net/example-owner/example-repo/blob/master/a.yaml",
              "toUrl": "https://ghe.example.net/example-owner/example-repo/blob/master/c.yaml",
              "type": "location.moved",
            },
          ],
          "result": "ok",
        }
      `);
    });
  });

  describe('repository.deleted', () => {
    it('unregisters', async () => {
      await expect(
        analyzeGithubWebhookEvent(
          'repository',
          require('./__fixtures__/repository-deleted-event.json'),
          { octokitProvider, logger, isRelevantPath },
        ),
      ).resolves.toMatchInlineSnapshot(`
        {
          "events": [
            {
              "type": "repository.deleted",
              "url": "https://ghe.example.net/example-owner/example-repo",
            },
          ],
          "result": "ok",
        }
      `);
    });
  });

  describe('repository.archived', () => {
    it('refreshes', async () => {
      await expect(
        analyzeGithubWebhookEvent(
          'repository',
          require('./__fixtures__/repository-archived-event.json'),
          { octokitProvider, logger, isRelevantPath },
        ),
      ).resolves.toMatchInlineSnapshot(`
        {
          "events": [
            {
              "type": "repository.updated",
              "url": "https://ghe.example.net/example-owner/example-repo",
            },
          ],
          "result": "ok",
        }
      `);
    });
  });

  describe('repository.renamed', () => {
    it('moves', async () => {
      await expect(
        analyzeGithubWebhookEvent(
          'repository',
          require('./__fixtures__/repository-renamed-event.json'),
          { octokitProvider, logger, isRelevantPath },
        ),
      ).resolves.toMatchInlineSnapshot(`
        {
          "events": [
            {
              "fromUrl": "https://ghe.example.net/example-owner/foo",
              "toUrl": "https://ghe.example.net/example-owner/example-repo",
              "type": "repository.moved",
            },
          ],
          "result": "ok",
        }
      `);
    });
  });

  describe('repository.transferred', () => {
    it('moves', async () => {
      await expect(
        analyzeGithubWebhookEvent(
          'repository',
          require('./__fixtures__/repository-transferred-event.json'),
          { octokitProvider, logger, isRelevantPath },
        ),
      ).resolves.toMatchInlineSnapshot(`
        {
          "events": [
            {
              "fromUrl": "https://ghe.example.net/foo/example-repo",
              "toUrl": "https://ghe.example.net/example-owner/example-repo",
              "type": "repository.moved",
            },
          ],
          "result": "ok",
        }
      `);
    });
  });
});
