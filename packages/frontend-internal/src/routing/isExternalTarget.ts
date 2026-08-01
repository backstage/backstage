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
 * Whether a target points outside the app: an absolute URL
 * (`https://example.com/x`), a protocol-relative URL (`//example.com/x`), or
 * an opaque scheme such as `mailto:` or `tel:`.
 *
 * Only the path portion is inspected — the part before the first `?` or `#`.
 * A query string or fragment may legitimately carry a URL of its own, so
 * `/search?query=https://example.com` is an ordinary app-relative target.
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
  const [path] = to.split(/[?#]/);
  return path.startsWith('//') || /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(path);
}
