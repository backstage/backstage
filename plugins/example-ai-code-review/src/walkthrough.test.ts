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

import { numberHunks, parseWalkthrough, splitHunks } from './walkthrough';

describe('walkthrough', () => {
  const files = [
    {
      filename: 'a.ts',
      status: 'modified',
      patch: '@@ -1 +1 @@\n-a\n+b\n@@ -9 +9 @@\n-x\n+y',
    },
    { filename: 'img.png', status: 'added' },
    { filename: 'b.ts', status: 'added', patch: '@@ -0,0 +1 @@\n+z' },
  ];

  it('numbers hunks per file, truncates on whole hunks, and drops unknown references', () => {
    const hunks = splitHunks(files);
    expect(hunks.map(h => [h.file, h.hunkIndex])).toEqual([
      ['a.ts', 0],
      ['a.ts', 1],
      ['b.ts', 0],
    ]);

    const full = numberHunks(hunks, 10_000);
    expect(full.truncated).toBe(false);
    expect(full.text).toContain('=== hunk file="a.ts" hunkIndex=1 ===\n@@ -9');

    const cut = numberHunks(hunks, 90);
    expect(cut.truncated).toBe(true);
    expect(cut.included).toHaveLength(1);

    const parsed = parseWalkthrough(
      {
        chapters: [
          {
            title: 'C',
            summary: 'S',
            steps: [
              {
                title: 'T',
                explanation: 'E',
                hunks: [
                  { file: 'a.ts', hunkIndex: 1 },
                  { file: 'a.ts', hunkIndex: 5 },
                ],
              },
              { nonsense: true },
            ],
          },
          { title: 'Empty', summary: '', steps: [] },
        ],
      },
      hunks,
    );
    expect(parsed.chapters).toHaveLength(1);
    expect(parsed.chapters[0].steps).toHaveLength(1);
    expect(parsed.chapters[0].steps[0].hunks).toEqual([
      { file: 'a.ts', hunkIndex: 1 },
    ]);
    expect(() => parseWalkthrough({}, hunks)).toThrow(/unexpected/);
  });
});
