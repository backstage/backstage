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

import { parseTechDocsMarkdown } from './markdown';
import { selectTechDocsRenderer, TechDocsSourceManifest } from './types';

describe('source documentation', () => {
  it('shares headings and text while removing unsafe HTML and preserving supported syntax', () => {
    const result = parseTechDocsMarkdown(
      '# Hello\n\n# Hello\n\n<script>alert(1)</script><img src="javascript:alert(1)" onerror="alert(1)">\n\n<details><summary>Details</summary>Text</details>\n\n!!! note "Notice"\n    Useful\n\n=== "Tab"\n    Content\n',
    );
    expect(result.headings.map(h => h.id)).toEqual([
      'techdocs-hello',
      'techdocs-hello_1',
    ]);
    const serialized = JSON.stringify(result.tree);
    expect(serialized).not.toMatch(/onerror|javascript:|"tagName":"script"/);
    expect(serialized).toContain('details');
    expect(result.text).toContain('Useful');
    expect(result.text).toContain('Content');
    const table = parseTechDocsMarkdown(
      '| A | B |\n| - | - |\n| 1 | 2 |\n\n- [x] Done\n\n$E=mc^2$',
    );
    expect(JSON.stringify(table.tree)).toContain('"tagName":"table"');
    expect(JSON.stringify(table.tree)).toContain('math-inline');
    const explicit = parseTechDocsMarkdown(
      '<h2 id="custom">Heading</h2>\n\n[Go](#custom)\n\nFootnote[^1]\n\n[^1]: Detail',
    );
    expect(explicit.headings[0].id).toBe('techdocs-custom');
    expect(JSON.stringify(explicit.tree)).toContain(
      'user-content-user-content-fn-1',
    );
    expect(JSON.stringify(explicit.tree)).toContain('"href":"#custom"');
  });
  it('enforces rollout policy and strict source behavior', () => {
    const manifest = {
      available: true,
      legacy: true,
      optedIn: false,
    } as TechDocsSourceManifest;
    expect(selectTechDocsRenderer('legacy', manifest)).toBe('legacy');
    expect(selectTechDocsRenderer('legacy', manifest, 'source')).toBe('source');
    expect(selectTechDocsRenderer('opt-in', manifest)).toBe('legacy');
    expect(
      selectTechDocsRenderer('opt-in', { ...manifest, optedIn: true }),
    ).toBe('source');
    expect(selectTechDocsRenderer('prefer-source', manifest)).toBe('source');
    expect(selectTechDocsRenderer('prefer-source')).toBe('legacy');
    expect(selectTechDocsRenderer('source', manifest, 'legacy')).toBe('source');
    expect(selectTechDocsRenderer('source')).toBe('source');
    expect(() => parseTechDocsMarkdown('a'.repeat(1_000_001))).toThrow('limit');
  });
});
