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

import { generateIndex, MARKER_START, MARKER_END } from './generateIndex';

describe('generateIndex', () => {
  it('produces correct pipe-delimited format with markers', () => {
    const result = generateIndex({
      version: '1.35.0',
      docsPath: '.backstage-docs/docs',
      outputFile: 'AGENTS.md',
      sections: [
        {
          name: 'api',
          files: [
            { relativePath: 'api/deprecations.md' },
            { relativePath: 'api/utility-apis.md' },
          ],
          subsections: [],
        },
        {
          name: 'auth',
          files: [{ relativePath: 'auth/index.md' }],
          subsections: [],
        },
      ],
    });

    expect(result).toContain(MARKER_START);
    expect(result).toContain(MARKER_END);
    expect(result).toContain('[Backstage Docs Index]');
    expect(result).toContain('root: .backstage-docs/docs');
    expect(result).toContain(
      'IMPORTANT: Prefer retrieval-led reasoning over pre-training-led reasoning for any Backstage tasks.',
    );
    expect(result).toContain(
      'If docs missing, run this command first: backstage-cli agents-md --release 1.35.0 AGENTS.md',
    );
    expect(result).toContain('api:{deprecations.md,utility-apis.md}');
    expect(result).toContain('auth:{index.md}');
  });

  it('includes subsections with full directory paths', () => {
    const result = generateIndex({
      version: '1.35.0',
      docsPath: '.backstage-docs/docs',
      outputFile: 'CLAUDE.md',
      sections: [
        {
          name: 'backend-system',
          files: [],
          subsections: [
            {
              name: 'backend-system/architecture',
              files: [
                {
                  relativePath: 'backend-system/architecture/01-index.md',
                },
                {
                  relativePath: 'backend-system/architecture/02-backends.md',
                },
              ],
              subsections: [],
            },
          ],
        },
      ],
    });

    expect(result).toContain(
      'backend-system/architecture:{01-index.md,02-backends.md}',
    );
    // Should not include an empty top-level section
    expect(result).not.toContain('backend-system:{}');
  });

  it('handles empty sections gracefully', () => {
    const result = generateIndex({
      version: '1.0.0',
      docsPath: './docs',
      outputFile: 'AGENTS.md',
      sections: [],
    });

    expect(result).toContain(MARKER_START);
    expect(result).toContain(MARKER_END);
    expect(result).toContain('[Backstage Docs Index]');
    expect(result).toContain(
      'backstage-cli agents-md --release 1.0.0 AGENTS.md',
    );
  });
});
