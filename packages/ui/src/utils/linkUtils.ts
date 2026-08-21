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
 * Rewrites an href into the string a browser will actually act on.
 *
 * A browser does not parse a URL as written. The WHATWG URL standard has it
 * remove every ASCII tab and newline from the input, then trim leading C0
 * control characters and spaces, before parsing anything — so
 * `<tab>javascript:alert(1)` is a `javascript:` URL and ` https://example.com`
 * is an absolute one, however they read in source. Everything below decides on
 * this normalized form, so an href cannot be classified as one thing here and
 * acted on as another by the browser.
 */
function normalizeHref(href: string): string {
  // eslint-disable-next-line no-control-regex
  return href.replace(/[\t\n\r]/g, '').replace(/^[\x00-\x20]+/, '');
}

/**
 * Schemes a browser executes instead of navigating to. `javascript:` and
 * `vbscript:` run in the current document, and `data:` can carry a document of
 * its own with nothing in the URL to say what is inside it.
 */
const executableSchemePattern = /^(?:javascript|data|vbscript):/i;

/**
 * The href rendered in place of one that must never be followed. Kept a real
 * URL rather than dropping the attribute so the element stays a link — same
 * focus order, same role, same styling — instead of silently collapsing into
 * plain text and changing the page around it.
 */
const blockedHref = 'about:blank';

/**
 * Determines if a link is external: an absolute URL
 * (`https://example.com/x`), a protocol-relative URL (`//example.com/x`), or
 * an opaque scheme such as `mailto:` or `tel:`.
 *
 * Only the path portion is inspected — the part before the first `?` or `#`.
 * A query string or fragment may legitimately carry a URL of its own, so
 * `/search?query=https://example.com` is an ordinary app-relative link.
 *
 * A backslash opens an authority exactly like a slash does — for a special
 * scheme the URL parser folds the two together — so `/\evil.com`, `\/evil.com`
 * and `\\evil.com` all resolve to `http://evil.com/` and are external. A lone
 * leading backslash is only a path separator: `\evil.com` is read as
 * `/evil.com`, stays on the app's own origin, and stays app-relative here.
 *
 * This says nothing about whether an href is safe to render — `javascript:` is
 * external, and correctly so, because nothing can client-route to it. Use
 * {@link sanitizeHref} for that.
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

  const [path] = normalizeHref(href).split(/[?#]/);
  return /^[/\\]{2}/.test(path) || /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(path);
}

/**
 * Checks if an href is an internal link (not external and not empty).
 *
 * @internal
 */
export function isInternalLink(href: string | undefined): href is string {
  return !!href && !isExternalLink(href);
}

/**
 * Replaces an href a browser would execute with an inert one, and returns
 * every other href untouched.
 *
 * Only executable schemes are affected — `javascript:`, `data:` and
 * `vbscript:`. `https:`, `mailto:`, `tel:`, protocol-relative `//host` and
 * app-relative paths are all returned exactly as given.
 *
 * BUI renders hrefs that come from data an adopter does not control: a catalog
 * annotation, a `spec.links` entry, a value handed in by a plugin. Nothing
 * upstream of a component guarantees they are navigable, and an `<a>` carrying
 * `javascript:` executes on click.
 *
 * `@backstage/core-components` throws for the same input. BUI returns an inert
 * href instead: it is published as a standalone design system with no promise
 * about its host, so a throw during render takes out whatever tree it happens
 * to be in and turns anyone who can write an annotation into someone who can
 * blank the page that shows it. Trading script execution for a crash is not a
 * trade worth making when the href can simply be made to go nowhere. The
 * warning keeps it from being silent.
 *
 * @internal
 */
export function sanitizeHref(href: string): string;
export function sanitizeHref(href: string | undefined): string | undefined;
export function sanitizeHref(href: string | undefined): string | undefined {
  if (
    href === undefined ||
    !executableSchemePattern.test(normalizeHref(href))
  ) {
    return href;
  }

  console.warn(
    `Blocked an href with an executable scheme (javascript:, data: or vbscript:) and rendered "${blockedHref}" instead`,
  );
  return blockedHref;
}
