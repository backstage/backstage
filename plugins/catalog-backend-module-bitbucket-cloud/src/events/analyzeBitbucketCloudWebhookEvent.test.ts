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

import { analyzeBitbucketCloudWebhookEvent } from './analyzeBitbucketCloudWebhookEvent';

const baseRepository = {
  type: 'repository',
  full_name: 'test-ws/test-repo',
  links: {
    html: {
      href: 'https://bitbucket.org/test-ws/test-repo',
    },
  },
  workspace: {
    type: 'workspace',
    slug: 'test-ws',
  },
};

describe('analyzeBitbucketCloudWebhookEvent', () => {
  describe('repo:push', () => {
    it('emits repository.updated for a push event', async () => {
      await expect(
        analyzeBitbucketCloudWebhookEvent('repo:push', {
          actor: { type: 'user' },
          repository: baseRepository,
          push: { changes: [] },
        }),
      ).resolves.toEqual({
        result: 'ok',
        events: [
          {
            type: 'repository.updated',
            url: 'https://bitbucket.org/test-ws/test-repo',
          },
        ],
      });
    });

    it('aborts when repository URL is missing', async () => {
      await expect(
        analyzeBitbucketCloudWebhookEvent('repo:push', {
          actor: { type: 'user' },
          repository: { type: 'repository' },
          push: { changes: [] },
        }),
      ).resolves.toEqual({
        result: 'aborted',
        reason:
          'Bitbucket Cloud repo:push event did not include repository.links.html.href',
      });
    });
  });

  describe('repo:updated', () => {
    it('emits repository.moved when the URL changes', async () => {
      await expect(
        analyzeBitbucketCloudWebhookEvent('repo:updated', {
          actor: { type: 'user' },
          repository: {
            ...baseRepository,
            full_name: 'test-ws/test-repo-new',
            links: {
              html: {
                href: 'https://bitbucket.org/test-ws/test-repo-new',
              },
            },
          },
          changes: {
            name: { new: 'test-repo-new', old: 'test-repo-old' },
            full_name: {
              new: 'test-ws/test-repo-new',
              old: 'test-ws/test-repo-old',
            },
            links: {
              new: {
                html: {
                  href: 'https://bitbucket.org/test-ws/test-repo-new',
                },
              },
              old: {
                html: {
                  href: 'https://bitbucket.org/test-ws/test-repo-old',
                },
              },
            },
          },
        }),
      ).resolves.toEqual({
        result: 'ok',
        events: [
          {
            type: 'repository.moved',
            fromUrl: 'https://bitbucket.org/test-ws/test-repo-old',
            toUrl: 'https://bitbucket.org/test-ws/test-repo-new',
          },
        ],
      });
    });

    it('falls back to full_name for old URL when links.old is missing', async () => {
      await expect(
        analyzeBitbucketCloudWebhookEvent('repo:updated', {
          actor: { type: 'user' },
          repository: {
            ...baseRepository,
            full_name: 'test-ws/test-repo-new',
            links: {
              html: {
                href: 'https://bitbucket.org/test-ws/test-repo-new',
              },
            },
          },
          changes: {
            full_name: {
              new: 'test-ws/test-repo-new',
              old: 'test-ws/test-repo-old',
            },
          },
        }),
      ).resolves.toEqual({
        result: 'ok',
        events: [
          {
            type: 'repository.moved',
            fromUrl: 'https://bitbucket.org/test-ws/test-repo-old',
            toUrl: 'https://bitbucket.org/test-ws/test-repo-new',
          },
        ],
      });
    });

    it('emits repository.updated when no URL change is detected', async () => {
      await expect(
        analyzeBitbucketCloudWebhookEvent('repo:updated', {
          actor: { type: 'user' },
          repository: baseRepository,
          changes: {
            description: { new: 'new desc', old: 'old desc' },
          },
        }),
      ).resolves.toEqual({
        result: 'ok',
        events: [
          {
            type: 'repository.updated',
            url: 'https://bitbucket.org/test-ws/test-repo',
          },
        ],
      });
    });
  });

  describe('repo:transfer', () => {
    it('emits repository.moved when transferred to a new workspace', async () => {
      await expect(
        analyzeBitbucketCloudWebhookEvent('repo:transfer', {
          actor: { type: 'user' },
          repository: {
            ...baseRepository,
            full_name: 'new-ws/test-repo',
            links: {
              html: {
                href: 'https://bitbucket.org/new-ws/test-repo',
              },
            },
            workspace: {
              type: 'workspace',
              slug: 'new-ws',
            },
          },
          changes: {
            full_name: {
              new: 'new-ws/test-repo',
              old: 'test-ws/test-repo',
            },
            links: {
              new: {
                html: {
                  href: 'https://bitbucket.org/new-ws/test-repo',
                },
              },
              old: {
                html: {
                  href: 'https://bitbucket.org/test-ws/test-repo',
                },
              },
            },
          },
        }),
      ).resolves.toEqual({
        result: 'ok',
        events: [
          {
            type: 'repository.moved',
            fromUrl: 'https://bitbucket.org/test-ws/test-repo',
            toUrl: 'https://bitbucket.org/new-ws/test-repo',
          },
        ],
      });
    });
  });

  describe('repo:deleted', () => {
    it('emits repository.deleted', async () => {
      await expect(
        analyzeBitbucketCloudWebhookEvent('repo:deleted', {
          actor: { type: 'user' },
          repository: baseRepository,
        }),
      ).resolves.toEqual({
        result: 'ok',
        events: [
          {
            type: 'repository.deleted',
            url: 'https://bitbucket.org/test-ws/test-repo',
          },
        ],
      });
    });
  });

  describe('general behavior', () => {
    it('throws on non-object payloads', async () => {
      await expect(
        analyzeBitbucketCloudWebhookEvent('repo:push', undefined),
      ).rejects.toThrow(
        'Bitbucket Cloud webhook event payload is not an object',
      );

      await expect(
        analyzeBitbucketCloudWebhookEvent('repo:push', []),
      ).rejects.toThrow(
        'Bitbucket Cloud webhook event payload is not an object',
      );
    });

    it('returns unsupported-event for unknown event types', async () => {
      await expect(
        analyzeBitbucketCloudWebhookEvent('pullrequest:created', {
          actor: { type: 'user' },
        }),
      ).resolves.toEqual({
        result: 'unsupported-event',
        event: 'pullrequest:created',
      });
    });
  });
});
