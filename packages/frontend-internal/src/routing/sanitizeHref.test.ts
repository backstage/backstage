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

import { sanitizeHref } from './sanitizeHref';

/**
 * The blocked half of the parity table shared with `sanitizeHref` in
 * `packages/ui/src/utils/linkUtils.ts`. `@backstage/ui` is a standalone design
 * system with no dependency on the frontend framework, so it cannot import
 * this helper and keeps its own copy — the two are pinned to the same answers
 * by running this exact table in `packages/ui/src/utils/linkUtils.test.ts`.
 * Change one table and you must change the other.
 */
const BLOCKED_HREF_PARITY_CASES: string[] = [
  // eslint-disable-next-line no-script-url
  'javascript:alert(1)',
  // Schemes are case-insensitive
  // eslint-disable-next-line no-script-url
  'JavaScript:alert(1)',
  // eslint-disable-next-line no-script-url
  'JAVASCRIPT:alert(1)',
  // Browsers strip these before parsing, so they run just the same
  '\tjavascript:alert(1)',
  '\njavascript:alert(1)',
  '\u0000javascript:alert(1)',
  ' javascript:alert(1)',
  'java\tscript:alert(1)',
  'j\na\tv\ra\tscript:alert(1)',
  // A data: URL can carry a document of its own
  'data:text/html,<script>alert(1)</script>',
  'DATA:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==',
  'vbscript:msgbox(1)',
  ' VBScript:msgbox(1)',
];

/**
 * The other half of the same parity table: every target that has to come back
 * exactly as it went in, executable-looking or not. Kept in step with
 * `packages/ui/src/utils/linkUtils.test.ts` the same way.
 */
const UNTOUCHED_HREF_PARITY_CASES: string[] = [
  // Ordinary external links have to keep working unchanged
  'https://example.com/x',
  'HTTPS://example.com/x',
  'http://example.com',
  '//example.com/x',
  'mailto:someone@example.com',
  'tel:+15555550123',
  'ftp://files.example.com',
  'slack://channel?id=1',
  // App-relative targets
  '/catalog/default/component/foo',
  'catalog/default',
  '?query=1',
  '#section',
  '',
  // Near misses: the scheme has to match up to and including the colon,
  // so neither of these is a `data:` or `javascript:` URL
  'database://host/table',
  'javascripty://example.com',
  // A path that merely contains a scheme-looking segment is still a path
  '/redirect/javascript:alert(1)',
  // Only a leading run is stripped, so this stays an ordinary path
  '/search?q=javascript:alert(1)',
];

describe('sanitizeHref', () => {
  it('replaces executable schemes with an inert href, however they are spelled', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});

    for (const to of BLOCKED_HREF_PARITY_CASES) {
      expect([to, sanitizeHref(to)]).toEqual([to, 'about:blank']);
    }

    expect(warn).toHaveBeenCalledTimes(BLOCKED_HREF_PARITY_CASES.length);
    warn.mockRestore();
  });

  it('leaves every navigable target exactly as given', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});

    for (const to of UNTOUCHED_HREF_PARITY_CASES) {
      expect([to, sanitizeHref(to)]).toEqual([to, to]);
    }

    expect(warn).not.toHaveBeenCalled();
    warn.mockRestore();
  });
});
