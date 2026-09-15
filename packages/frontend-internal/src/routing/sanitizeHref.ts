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

import { normalizeTarget } from './isExternalTarget';

/**
 * Schemes a browser executes instead of navigating to. `javascript:` and
 * `vbscript:` run in the current document, and `data:` can carry a document of
 * its own with nothing in the URL to say what is inside it.
 */
const executableSchemePattern = /^(?:javascript|data|vbscript):/i;

/**
 * The href handed back in place of one that must never be followed. Kept a
 * real URL rather than an empty string so the element it lands on stays a
 * link — same focus order, same role, same styling — instead of turning into
 * one that reloads the current page on click.
 */
const blockedHref = 'about:blank';

/**
 * Replaces a target a browser would execute with an inert href, and returns
 * every other target untouched.
 *
 * Only executable schemes are affected — `javascript:`, `data:` and
 * `vbscript:`. `https:`, `mailto:`, `tel:`, protocol-relative `//host` and
 * app-relative paths are all returned exactly as given.
 *
 * The framework renders hrefs built from data an adopter does not control: a
 * catalog annotation, a `spec.links` entry, a value handed to a plugin.
 * `AppHistory.createHref` returns a target it cannot route unchanged — on
 * purpose, since a caller holding an external URL wants it back intact — so
 * without this an `<a>` built from one of those targets executes on click.
 *
 * Nothing throws here. `AppHistory.navigate` can afford to reject the same
 * targets because it runs from an event handler, but an href is produced
 * during render, where a throw takes out the tree the target was only being
 * displayed in — which would turn anyone who can write an annotation into
 * someone who can blank the page that shows it. The inert href goes nowhere
 * instead, and the warning keeps that from being silent.
 *
 * `@backstage/ui` keeps its own copy in `src/utils/linkUtils.ts` because it is
 * a standalone design system with no dependency on the frontend framework.
 * The two must stay behaviourally identical; both are pinned by matching test
 * tables (`sanitizeHref.test.ts` and `linkUtils.test.ts`).
 */
export function sanitizeHref(to: string): string {
  if (!executableSchemePattern.test(normalizeTarget(to))) {
    return to;
  }

  // eslint-disable-next-line no-console
  console.warn(
    `Blocked an href with an executable scheme (javascript:, data: or vbscript:) and rendered "${blockedHref}" instead`,
  );
  return blockedHref;
}
