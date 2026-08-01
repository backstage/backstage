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

/**
 * Determines if a link is external: an absolute URL
 * (`https://example.com/x`), a protocol-relative URL (`//example.com/x`), or
 * an opaque scheme such as `mailto:` or `tel:`.
 *
 * Only the path portion is inspected — the part before the first `?` or `#`.
 * A query string or fragment may legitimately carry a URL of its own, so
 * `/search?query=https://example.com` is an ordinary app-relative link.
 *
 * This is deliberately a copy of `isExternalTarget` in `@internal/frontend`,
 * which the Backstage frontend framework uses for the same decision. BUI is a
 * standalone design system with no dependency on the frontend framework, so it
 * cannot import that helper — but the two must answer identically, or a link
 * routes internally in one layer and escapes the app in the other. Both are
 * pinned to the same table of cases; see `linkUtils.test.ts`.
 *
 * @param href - The href of the link.
 * @returns True if the link is external, false otherwise.
 * @internal
 */
export function isExternalLink(href?: string): boolean {
  if (!href) return false;

  const [path] = href.split(/[?#]/);
  return path.startsWith('//') || /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(path);
}

/**
 * Checks if an href is an internal link (not external and not empty).
 *
 * @internal
 */
export function isInternalLink(href: string | undefined): href is string {
  return !!href && !isExternalLink(href);
}
