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

import { getReleaseCommitPairs } from './getReleaseCommitPairs';

describe('getReleaseCommitPairs', () => {
  it('should work', () => {
    const nonPublishedRelease = {
      baseVersion: '1.0',
      createdAt: '2021-01-01T10:11:12Z',
      htmlUrl: 'html_url',
      candidates: [
        {
          tagName: 'rc-1.0.0',
          sha: 'sha-1.0.0',
        },
        {
          tagName: 'rc-1.0.1',
          sha: 'sha-1.0.1',
        },
      ],
      versions: [],
    };

    const releaseWithoutPatches = {
      baseVersion: '2.0',
      createdAt: '2021-01-01T10:11:12Z',
      htmlUrl: 'html_url',
      candidates: [
        {
          tagName: 'rc-2.0.0',
          sha: 'sha-2.0.0',
        },
      ],
      versions: [
        {
          tagName: 'version-2.0.0',
          sha: 'sha-2.0.0',
        },
      ],
    };

    const releaseWithPatches = {
      baseVersion: '3.0',
      createdAt: '2021-01-01T10:11:12Z',
      htmlUrl: 'html_url',
      candidates: [
        {
          tagName: 'rc-3.0.1',
          sha: 'sha-3.0.1',
        },
        {
          tagName: 'rc-3.0.0',
          sha: 'sha-3.0.0',
        },
      ],
      versions: [
        {
          tagName: 'version-3.0.1',
          sha: 'sha-3.0.1',
        },
      ],
    };

    const result = getReleaseCommitPairs({
      releaseStats: {
        releases: {
          nonPublishedRelease, // Should be omitted
          releaseWithoutPatches, // Should be omitted
          releaseWithPatches,
        },
        unmatchedReleases: [],
        unmappableTags: [],
        unmatchedTags: [],
      },
    });

    expect(result).toMatchInlineSnapshot(`
      Object {
        "releaseCommitPairs": Array [
          Object {
            "baseVersion": "3.0",
            "endCommit": Object {
              "sha": "sha-3.0.1",
              "tagName": "version-3.0.1",
            },
            "startCommit": Object {
              "sha": "sha-3.0.0",
              "tagName": "rc-3.0.0",
            },
          },
        ],
      }
    `);
  });
});
