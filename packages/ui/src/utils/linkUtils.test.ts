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

import { isExternalLink, isInternalLink, sanitizeHref } from './linkUtils';

/**
 * The parity table shared with `isExternalTarget` in
 * `packages/frontend-internal/src/routing/isExternalTarget.ts`, which the
 * Backstage frontend framework uses for the same decision. BUI is a standalone
 * design system and cannot import that helper, so the two implementations are
 * kept in step by running this identical table on both sides. Change one and
 * you must change the other.
 */
const EXTERNAL_LINK_PARITY_CASES: Array<[string, boolean]> = [
  // Absolute URLs
  ['https://example.com/x', true],
  ['http://example.com', true],
  // Protocol relative
  ['//example.com/x', true],
  // A backslash opens an authority exactly like a slash does, so any pair of
  // them does: a browser resolves every one of these to `http://evil.com/`
  ['/\\evil.com', true],
  ['\\\\evil.com', true],
  ['\\/evil.com', true],
  // Opaque schemes
  ['mailto:someone@example.com', true],
  ['tel:+15555550123', true],
  // Any other scheme is external too — nothing can client-route to it, and
  // an executable scheme must never be handed to a router
  ['ftp://files.example.com', true],
  ['slack://channel?id=1', true],
  ['data:text/plain,hello', true],
  // eslint-disable-next-line no-script-url
  ['javascript:alert(1)', true],
  // Browsers drop every ASCII tab and newline from a URL and trim leading C0
  // controls and spaces before parsing it, so each of these is one of the
  // targets above wearing a disguise and has to be classified the same way
  ['\tjavascript:alert(1)', true],
  ['\njavascript:alert(1)', true],
  ['\u0000javascript:alert(1)', true],
  ['java\tscript:alert(1)', true],
  [' https://example.com', true],
  ['\t//evil.com', true],
  // App relative, including targets that merely carry a URL in the query or
  // fragment — only the part before the first `?` or `#` decides
  ['/search?query=https://example.com', false],
  ['/search#https://example.com', false],
  ['/catalog/default/component/foo', false],
  ['catalog/default', false],
  // A lone backslash is only a path separator — a browser reads these as
  // `/evil.com` and `/catalog/default`, both on the app's own origin
  ['\\evil.com', false],
  ['/catalog\\default', false],
  ['?query=1', false],
  ['#section', false],
  ['', false],
];

describe('linkUtils', () => {
  it('classifies external links by the portion before the first ? or #', () => {
    for (const [href, expected] of EXTERNAL_LINK_PARITY_CASES) {
      expect([href, isExternalLink(href)]).toEqual([href, expected]);
    }

    expect(isExternalLink(undefined)).toBe(false);
  });

  it('treats only non-empty app-relative hrefs as internal', () => {
    for (const [href, external] of EXTERNAL_LINK_PARITY_CASES) {
      expect([href, isInternalLink(href)]).toEqual([
        href,
        href !== '' && !external,
      ]);
    }

    expect(isInternalLink(undefined)).toBe(false);
  });

  it('replaces executable schemes with an inert href, however they are spelled', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});

    // The blocked half of the parity table shared with `sanitizeHref` in
    // `packages/frontend-internal/src/routing/sanitizeHref.ts`, where the same
    // cases run as `BLOCKED_HREF_PARITY_CASES` in `sanitizeHref.test.ts`. BUI
    // is a standalone design system and cannot import that helper, so the two
    // implementations are kept in step by running identical tables on both
    // sides. Change one table and you must change the other.
    const blocked = [
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

    for (const href of blocked) {
      expect([href, sanitizeHref(href)]).toEqual([href, 'about:blank']);
    }

    expect(warn).toHaveBeenCalledTimes(blocked.length);
    warn.mockRestore();
  });

  it('leaves every navigable href exactly as given', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});

    // The other half of the same parity table, running as
    // `UNTOUCHED_HREF_PARITY_CASES` in `sanitizeHref.test.ts`. Kept in step
    // the same way.
    const untouched = [
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

    for (const href of untouched) {
      expect([href, sanitizeHref(href)]).toEqual([href, href]);
    }

    expect(sanitizeHref(undefined)).toBeUndefined();
    expect(warn).not.toHaveBeenCalled();
    warn.mockRestore();
  });
});
