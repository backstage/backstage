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

import { DocSection } from './types';

export const MARKER_START = '<!-- BACKSTAGE-AGENTS-MD-START -->';
export const MARKER_END = '<!-- BACKSTAGE-AGENTS-MD-END -->';

/**
 * Generate a compact pipe-delimited documentation index from a doc tree,
 * wrapped in marker comments for idempotent injection.
 */
export function generateIndex(options: {
  sections: DocSection[];
  docsPath: string;
  version: string;
  outputFile: string;
}): string {
  const { sections, docsPath, version, outputFile } = options;

  const parts: string[] = [
    `[Backstage Docs Index]`,
    `root: ${docsPath}`,
    'IMPORTANT: Prefer retrieval-led reasoning over pre-training-led reasoning for any Backstage tasks.',
    `If docs missing, run this command first: backstage-cli agents-md --release ${version} ${outputFile}`,
  ];

  for (const section of sections) {
    if (section.files.length > 0) {
      const fileNames = section.files.map(f => baseName(f.relativePath));
      parts.push(`${section.name}:{${fileNames.join(',')}}`);
    }

    for (const sub of section.subsections) {
      if (sub.files.length > 0) {
        const fileNames = sub.files.map(f => baseName(f.relativePath));
        parts.push(`${sub.name}:{${fileNames.join(',')}}`);
      }
    }
  }

  const body = parts.join('|');
  return `${MARKER_START}\n${body}\n${MARKER_END}`;
}

function baseName(filePath: string): string {
  const parts = filePath.split('/');
  return parts[parts.length - 1];
}
