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

import { toPlainText, truncateText } from './plainText';

describe('toPlainText', () => {
  it('strips HTML tags', () => {
    expect(toPlainText('<b>Hello</b> <i>world</i>')).toBe('Hello world');
  });

  it('strips markdown formatting', () => {
    expect(toPlainText('**Bold** and _italic_ and `code`')).toBe(
      'Bold and italic and code',
    );
  });

  it('converts markdown links to plain text', () => {
    expect(toPlainText('[Open docs](https://example.com)')).toBe('Open docs');
  });

  it('strips HTML tags introduced by decoding entities', () => {
    expect(toPlainText('&lt;b&gt;Hello&lt;/b&gt; world')).toBe('Hello world');
  });
});

describe('truncateText', () => {
  it('returns the full text when within maxChars', () => {
    expect(truncateText('Short title', 80)).toEqual({
      display: 'Short title',
      truncated: false,
      full: 'Short title',
    });
  });

  it('truncates long text with an ellipsis', () => {
    const result = truncateText('a'.repeat(100), 80);
    expect(result.display).toBe(`${'a'.repeat(80)}...`);
    expect(result.truncated).toBe(true);
    expect(result.full).toHaveLength(100);
  });

  it('strips markup before truncating', () => {
    const result = truncateText(`<strong>${'x'.repeat(90)}</strong>`, 80);
    expect(result.display).toBe(`${'x'.repeat(80)}...`);
    expect(result.full).toHaveLength(90);
  });
});
