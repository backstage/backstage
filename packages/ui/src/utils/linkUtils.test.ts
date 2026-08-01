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

import { isExternalLink, isInternalLink } from './linkUtils';

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
  // App relative, including targets that merely carry a URL in the query or
  // fragment — only the part before the first `?` or `#` decides
  ['/search?query=https://example.com', false],
  ['/search#https://example.com', false],
  ['/catalog/default/component/foo', false],
  ['catalog/default', false],
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
});
