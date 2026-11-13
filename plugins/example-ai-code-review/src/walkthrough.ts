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

import { JsonObject } from '@backstage/types';
import { PullRequestFile } from './githubPr';

export type Hunk = {
  file: string;
  hunkIndex: number;
  /** The raw hunk, starting with its @@ header line. */
  text: string;
};

export type WalkthroughStep = {
  title: string;
  explanation: string;
  hunks: Array<{ file: string; hunkIndex: number }>;
};

export type WalkthroughChapter = {
  title: string;
  summary: string;
  steps: WalkthroughStep[];
};

export type Walkthrough = { chapters: WalkthroughChapter[] };

/** Splits the patch of every file into hunks, numbered per file from 0. */
export function splitHunks(files: PullRequestFile[]): Hunk[] {
  const hunks: Hunk[] = [];
  for (const file of files) {
    if (!file.patch) {
      continue;
    }
    let current: string[] | undefined;
    const flush = () => {
      if (current) {
        hunks.push({
          file: file.filename,
          hunkIndex: hunks.filter(h => h.file === file.filename).length,
          text: current.join('\n'),
        });
      }
    };
    for (const line of file.patch.split('\n')) {
      if (line.startsWith('@@')) {
        flush();
        current = [line];
      } else {
        current?.push(line);
      }
    }
    flush();
  }
  return hunks;
}

/**
 * Renders the hunks with an id header each, so that the model can refer to a
 * hunk by file and index instead of repeating its text. Whole hunks are
 * dropped once the character budget is used up.
 */
export function numberHunks(
  hunks: Hunk[],
  maxCharacters: number,
): { text: string; included: Hunk[]; truncated: boolean } {
  const included: Hunk[] = [];
  let text = '';
  for (const hunk of hunks) {
    const section = `=== hunk file="${hunk.file}" hunkIndex=${hunk.hunkIndex} ===\n${hunk.text}\n\n`;
    if (text.length + section.length > maxCharacters) {
      return { text, included, truncated: true };
    }
    text += section;
    included.push(hunk);
  }
  return { text, included, truncated: false };
}

export const walkthroughSchema: JsonObject = {
  type: 'object',
  additionalProperties: false,
  properties: {
    chapters: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          title: { type: 'string' },
          summary: { type: 'string' },
          steps: {
            type: 'array',
            items: {
              type: 'object',
              additionalProperties: false,
              properties: {
                title: { type: 'string' },
                explanation: { type: 'string' },
                hunks: {
                  type: 'array',
                  items: {
                    type: 'object',
                    additionalProperties: false,
                    properties: {
                      file: { type: 'string' },
                      hunkIndex: { type: 'integer' },
                    },
                    required: ['file', 'hunkIndex'],
                  },
                },
              },
              required: ['title', 'explanation', 'hunks'],
            },
          },
        },
        required: ['title', 'summary', 'steps'],
      },
    },
  },
  required: ['chapters'],
};

/**
 * Model output is untrusted, so validate it rather than casting. Hunk
 * references that do not exist in the diff are dropped, and chapters without
 * any valid step are removed.
 */
export function parseWalkthrough(value: unknown, known: Hunk[]): Walkthrough {
  const root = value as { chapters?: unknown } | null;
  if (!root || !Array.isArray(root.chapters)) {
    throw new Error('The model returned an unexpected walkthrough format');
  }
  const exists = (file: string, hunkIndex: number) =>
    known.some(h => h.file === file && h.hunkIndex === hunkIndex);
  const chapters: WalkthroughChapter[] = [];
  for (const rawChapter of root.chapters) {
    if (
      !rawChapter ||
      typeof rawChapter.title !== 'string' ||
      typeof rawChapter.summary !== 'string' ||
      !Array.isArray(rawChapter.steps)
    ) {
      continue;
    }
    const steps: WalkthroughStep[] = [];
    for (const rawStep of rawChapter.steps) {
      if (
        !rawStep ||
        typeof rawStep.title !== 'string' ||
        typeof rawStep.explanation !== 'string'
      ) {
        continue;
      }
      const hunks = (Array.isArray(rawStep.hunks) ? rawStep.hunks : []).filter(
        (h: any) =>
          h && typeof h.file === 'string' && exists(h.file, h.hunkIndex),
      );
      steps.push({
        title: rawStep.title,
        explanation: rawStep.explanation,
        hunks: hunks.map((h: any) => ({
          file: h.file,
          hunkIndex: h.hunkIndex,
        })),
      });
    }
    if (steps.length > 0) {
      chapters.push({
        title: rawChapter.title,
        summary: rawChapter.summary,
        steps,
      });
    }
  }
  if (chapters.length === 0) {
    throw new Error('The model returned a walkthrough without any steps');
  }
  return { chapters };
}
