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

import { analyzeGerritWebhookEvent } from './analyzeGerritWebhookEvent';

const options = { gitilesBaseUrl: 'https://gerrit.example.com/gitiles' };

function refUpdated(refName: string) {
  return {
    type: 'ref-updated',
    submitter: { name: 'Admin', username: 'admin' },
    refUpdate: {
      oldRev: 'c3c8ccbe0f4f4a6e2b2b1f3e8b5b0c5f2c3c0e1a',
      newRev: '8f0b7d5a1a9b4d3e2c1f0e9d8c7b6a5f4e3d2c1b',
      refName,
      project: 'team/repository',
    },
    eventCreatedOn: 1700000000,
  };
}

describe('analyzeGerritWebhookEvent', () => {
  it('emits repository.updated for branch updates', async () => {
    await expect(
      analyzeGerritWebhookEvent(
        'ref-updated',
        refUpdated('refs/heads/main'),
        options,
      ),
    ).resolves.toEqual({
      result: 'ok',
      events: [
        {
          type: 'repository.updated',
          url: 'https://gerrit.example.com/gitiles/team/repository/+/refs/heads/main',
        },
      ],
    });

    // Older Gerrit versions send short branch names, and branches can
    // contain slashes
    await expect(
      analyzeGerritWebhookEvent('ref-updated', refUpdated('feature/x'), {
        gitilesBaseUrl: 'https://gerrit.example.com/gitiles/',
      }),
    ).resolves.toEqual({
      result: 'ok',
      events: [
        {
          type: 'repository.updated',
          url: 'https://gerrit.example.com/gitiles/team/repository/+/refs/heads/feature/x',
        },
      ],
    });
  });

  it('ignores updates to refs that are not branches', async () => {
    for (const refName of [
      'refs/tags/v1.0.0',
      'refs/changes/01/1/1',
      'refs/meta/config',
    ]) {
      await expect(
        analyzeGerritWebhookEvent('ref-updated', refUpdated(refName), options),
      ).resolves.toEqual({
        result: 'ignored',
        reason: `Gerrit ref-updated event for ${refName} is not a branch update`,
      });
    }
  });

  it('aborts when the ref update is incomplete', async () => {
    await expect(
      analyzeGerritWebhookEvent(
        'ref-updated',
        { type: 'ref-updated', refUpdate: { refName: 'refs/heads/main' } },
        options,
      ),
    ).resolves.toEqual({
      result: 'aborted',
      reason:
        'Gerrit ref-updated event did not include refUpdate.project and refUpdate.refName',
    });
  });

  it('handles unsupported events and bad payloads', async () => {
    await expect(
      analyzeGerritWebhookEvent(
        'change-merged',
        { type: 'change-merged' },
        options,
      ),
    ).resolves.toEqual({ result: 'unsupported-event', event: 'change-merged' });

    await expect(
      analyzeGerritWebhookEvent('ref-updated', 'nope', options),
    ).rejects.toThrow('Gerrit webhook event payload is not an object');
  });
});
