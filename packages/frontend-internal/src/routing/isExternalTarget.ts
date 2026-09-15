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

/**
 * Rewrites a target into the string a browser will actually act on.
 *
 * A browser does not parse a URL as written. The WHATWG URL standard has it
 * remove every ASCII tab and newline from the input, then trim leading C0
 * control characters and spaces, before parsing anything — so
 * `<tab>javascript:alert(1)` is a `javascript:` URL and ` https://example.com`
 * is an absolute one, however they read in source. Classifying the raw string
 * would file those as app-relative and hand them to the router, which is the
 * one outcome the predicate below exists to prevent.
 *
 * Shared with `sanitizeHref`, which decides on this same normalized form, so a
 * target cannot be read as one thing here and acted on as another there — or
 * by the browser.
 */
export function normalizeTarget(to: string): string {
  // eslint-disable-next-line no-control-regex
  return to.replace(/[\t\n\r]/g, '').replace(/^[\x00-\x20]+/, '');
}

/**
 * Whether a target points outside the app: an absolute URL
 * (`https://example.com/x`), a protocol-relative URL (`//example.com/x`), or
 * an opaque scheme such as `mailto:` or `tel:`.
 *
 * Only the path portion is inspected — the part before the first `?` or `#`.
 * A query string or fragment may legitimately carry a URL of its own, so
 * `/search?query=https://example.com` is an ordinary app-relative target.
 *
 * A backslash opens an authority exactly like a slash does — for a special
 * scheme the URL parser folds the two together — so `/\evil.com`, `\/evil.com`
 * and `\\evil.com` all resolve to `http://evil.com/` and are external. A lone
 * leading backslash is only a path separator: `\evil.com` is read as
 * `/evil.com`, stays on the app's own origin, and stays app-relative here.
 *
 * This is the single answer for the framework: `AppHistory.createHref` /
 * `navigate`, the app history mock, and `useAppHref` all decide the same way.
 * It deliberately imports nothing — `@internal/frontend` is inlined into
 * `@backstage/frontend-plugin-api`, so anything reached from here would have
 * to be cycle-free from that package too.
 *
 * `@backstage/ui` keeps its own copy in `src/utils/linkUtils.ts` because it is
 * a standalone design system with no dependency on the frontend framework.
 * The two must stay behaviourally identical; both are pinned by matching test
 * tables (`isExternalTarget.test.ts` and `linkUtils.test.ts`).
 */
export function isExternalTarget(to: string): boolean {
  const [path] = normalizeTarget(to).split(/[?#]/);
  return /^[/\\]{2}/.test(path) || /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(path);
}
