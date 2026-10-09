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
  it('preserves callout kinds, disclosure state and safe inline presentation without enabling author styles', () => {
    const result = parseTechDocsMarkdown(
      [
        '!!! warning "Watch out"',
        '    Be careful.',
        '',
        '??? note "Closed"',
        '    Hidden by default.',
        '',
        '???+ tip "Open"',
        '    Visible by default.',
        '',
        'Great :thumbsup: `:heart:`',
        '',
        '![Small](small.png){: style="width: 100px" }',
        '',
        '![Unsafe](unsafe.png){: style="width: 100px; position: fixed" }',
        '',
        '[Download](file.txt){: download }',
      ].join('\n'),
    );
    const nodes = result.tree.children!;
    const callout = nodes.find(node => node.tagName === 'aside')!;
    expect(callout.properties?.className).toEqual(['techdocs-warning']);
    const details = nodes.filter(node => node.tagName === 'details');
    expect(details).toHaveLength(2);
    expect(details[0].properties?.open).toBeUndefined();
    expect(details[1].properties?.open).toBe(true);
    expect(details[0].children?.[0].tagName).toBe('summary');
    expect(result.text).toContain('👍');
    expect(result.text).toContain(':heart:');
    const serialized = JSON.stringify(result.tree);
    expect(serialized).toContain('"width":100');
    expect(serialized).not.toContain('"style":');
    expect(result.text).not.toContain('{: download }');
    expect(result.text).toContain('position: fixed');
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
