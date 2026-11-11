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

import { isExternalTarget } from './isExternalTarget';

/**
 * The parity table shared with `isExternalLink` in
 * `packages/ui/src/utils/linkUtils.ts`. `@backstage/ui` is a standalone design
 * system with no dependency on the frontend framework, so it cannot import
 * this helper and keeps its own copy — the two are pinned to the same answers
 * by running this exact table in `packages/ui/src/utils/linkUtils.test.ts`.
 * Change one table and you must change the other.
 */
const EXTERNAL_TARGET_PARITY_CASES: Array<[string, boolean]> = [
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

describe('isExternalTarget', () => {
  it('classifies targets by the portion before the first ? or #', () => {
    for (const [target, expected] of EXTERNAL_TARGET_PARITY_CASES) {
      expect([target, isExternalTarget(target)]).toEqual([target, expected]);
    }
  });
});
