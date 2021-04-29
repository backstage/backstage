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

import { getReleaseStats } from './getReleaseStats';
import { mockSemverProject } from '../../../test-helpers/test-helpers';

describe('getReleaseStats', () => {
  it('should get releases with tags', () => {
    const result = getReleaseStats({
      project: mockSemverProject,
      mappedReleases: {
        releases: {
          '1.0': {
            baseVersion: '1.0',
            createdAt: '2021-01-01T10:11:12Z',
            htmlUrl: 'html_url',
            candidates: [
              {
                tagName: 'rc-1.0.0',
                sha: '',
              },
            ],
            versions: [],
          },
          '1.1': {
            baseVersion: '1.1',
            createdAt: '2021-01-01T10:11:12Z',
            htmlUrl: 'html_url',
            candidates: [
              {
                tagName: 'rc-1.1.0',
                sha: '',
              },
            ],
            versions: [],
          },
        },
        unmappableTags: [],
        unmatchedReleases: [],
        unmatchedTags: [],
      },
      allTags: [
        { sha: 'sha', tagName: 'rc-1.0.0' },
        { sha: 'sha', tagName: 'rc-1.0.1' },
        { sha: 'sha', tagName: 'rc-1.0.2' },
        { sha: 'sha', tagName: 'version-1.0.2' },
        { sha: 'sha', tagName: 'rc-1.1.1' },

        { sha: 'unmatchable', tagName: 'rc-1/2/3' },
        { sha: 'unmappable', tagName: 'rc-123.123.123' },
      ],
    });

    expect(result).toMatchInlineSnapshot(`
      Object {
        "releaseStats": Object {
          "releases": Object {
            "1.0": Object {
              "baseVersion": "1.0",
              "candidates": Array [
                Object {
                  "sha": "sha",
                  "tagName": "rc-1.0.0",
                },
                Object {
                  "sha": "sha",
                  "tagName": "rc-1.0.1",
                },
                Object {
                  "sha": "sha",
                  "tagName": "rc-1.0.2",
                },
              ],
              "createdAt": "2021-01-01T10:11:12Z",
              "htmlUrl": "html_url",
              "versions": Array [
                Object {
                  "sha": "sha",
                  "tagName": "version-1.0.2",
                },
              ],
            },
            "1.1": Object {
              "baseVersion": "1.1",
              "candidates": Array [
                Object {
                  "sha": "",
                  "tagName": "rc-1.1.0",
                },
                Object {
                  "sha": "sha",
                  "tagName": "rc-1.1.1",
                },
              ],
              "createdAt": "2021-01-01T10:11:12Z",
              "htmlUrl": "html_url",
              "versions": Array [],
            },
          },
          "unmappableTags": Array [
            "rc-123.123.123",
          ],
          "unmatchedReleases": Array [],
          "unmatchedTags": Array [
            "rc-1/2/3",
          ],
        },
      }
    `);
  });
});
