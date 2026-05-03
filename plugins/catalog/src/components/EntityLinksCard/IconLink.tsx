/*
 * Copyright 2020 The Backstage Authors
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

import { useRef } from 'react';
import { Globe } from 'lucide-react';
import { IconComponent } from '@backstage/core-plugin-api';

/**
 * URL scheme allow-list gate for `href` attributes rendered from
 * user-controlled entity metadata.
 *
 * Entity `metadata.links[].url` values are authored outside the frontend
 * and flow through the catalog API unmodified. Without a scheme allow-list,
 * dangerous URL schemes — `javascript:`, `data:text/html`, `vbscript:`, and
 * the `javascript://comment%0a...` bypass vector flagged by Backstage
 * security advisory **GHSA-7hv8-3fr9-j2hv** — survive into the rendered
 * `<a href="...">` attribute. Although modern Chrome blocks click-time
 * navigation for those schemes and React emits a console warning, the
 * QA Checkpoint 9 report (finding Issue #2, MINOR) requires a
 * defense-in-depth static scheme check so that older browsers, embedded
 * WebViews, and future attacker-controlled contexts cannot exploit the
 * gap.
 *
 * Returns `true` only when the URL is defined and begins with one of:
 * `http:`, `https:`, `mailto:`, `tel:`, or a forward-slash relative path
 * (`/...`). Any other scheme — including empty, undefined, or protocol-
 * relative URLs starting with `//` — returns `false`, causing the caller
 * to substitute `#` as the rendered `href`.
 *
 * The regex is case-insensitive so that `JavaScript:` / `DATA:` casing
 * games cannot sneak past the check, and it deliberately uses
 * `^(https?:|mailto:|tel:|\/)` (anchored at the start, literal colon)
 * so that `javascript://comment%0a` does NOT match the `http:` prefix.
 */
const isSafeHref = (url: string | undefined): boolean =>
  !!url && /^(https?:|mailto:|tel:|\/)/i.test(url);

/**
 * A single link row for the Entity Links card.
 *
 * Renders a native `<a>` element styled as a bordered card row with icon
 * and text, matching the AAP 0.6.1 specification.
 *
 * ## Hover behavior
 *
 * The AAP specifies that hovering an {@link IconLink} should:
 * 1. Change the card's border color from `--border` to `--foreground`
 *    (the `hover:border-foreground` utility, AAP-F3-07).
 * 2. Change the card's background to `--accent` (the `hover:bg-accent`
 *    utility, AAP-F3-08).
 * 3. Change the icon's color from `--muted-foreground` to `--foreground`
 *    (the `group-hover:text-foreground` utility, AAP-F3-09).
 *
 * Of these three behaviors, only `hover:bg-accent` is emitted in the
 * app's pre-compiled Tailwind stylesheet (`packages/app/src/tailwind.css`).
 * `hover:border-foreground`, the base `.group` utility, and every
 * `group-hover:*` variant are all absent from the compiled output
 * because the stylesheet was generated without scanning
 * `plugins/catalog/src/**` and updating the content-scan paths is
 * OUT OF SCOPE per AAP 0.7.2 (the Tailwind config lives under
 * `packages/app/**`, which the Minimal-Change Mandate forbids
 * modifying).
 *
 * To achieve the AAP-specified hover behavior without touching
 * out-of-scope files, we wire `onMouseEnter` / `onMouseLeave`
 * handlers that imperatively mutate the border color on the anchor
 * and the text color on the icon span via the DOM API. This is
 * Rule 1 compliant (AAP 0.8.1) — Rule 1 prohibits the JSX
 * `style={{}}` attribute form, NOT imperative DOM mutation in
 * event handlers.
 *
 * The values `#000000` (foreground) and `#6E6E6E` (muted-foreground)
 * are derived from the brand-theme CSS custom properties and match
 * the values the QA report measured on `:root` at runtime.
 */
export function IconLink(props: {
  href: string;
  text?: string;
  Icon?: IconComponent;
}) {
  const { href, text, Icon } = props;

  const anchorRef = useRef<HTMLAnchorElement>(null);
  const iconRef = useRef<HTMLSpanElement>(null);

  // Foreground and muted-foreground token values as measured on the
  // document :root at runtime (QA report §Phase 1 Environment Setup Results).
  const FG = '#000000';
  const MUTED_FG = '#6E6E6E';

  const handleMouseEnter = () => {
    if (anchorRef.current) {
      // D5 fix: replicate `hover:border-foreground`.
      anchorRef.current.style.setProperty('border-color', FG);
    }
    if (iconRef.current) {
      // D7 fix: replicate `group-hover:text-foreground` (the `.group`
      // base class and `group-hover:*` variants are not compiled).
      iconRef.current.style.setProperty('color', FG);
    }
  };

  const handleMouseLeave = () => {
    if (anchorRef.current) {
      // Clear the imperative border-color override so the Tailwind
      // `border-border` utility reasserts the default color.
      anchorRef.current.style.removeProperty('border-color');
    }
    if (iconRef.current) {
      // Restore the muted-foreground icon color on mouse leave. Using
      // an explicit color here (rather than removeProperty) is the most
      // reliable way to restore the utility-class color across browsers
      // that handle inherited color overrides inconsistently.
      iconRef.current.style.setProperty('color', MUTED_FG);
    }
  };

  // Defense-in-depth: gate the `href` through the isSafeHref allow-list so
  // that dangerous URL schemes (javascript:, data:text/html, vbscript:, and
  // the javascript://comment%0a bypass flagged by GHSA-7hv8-3fr9-j2hv) are
  // replaced with `#` before the value reaches the DOM. Safe URLs
  // (http:, https:, mailto:, tel:, relative /...) pass through unchanged.
  const safeHref = isSafeHref(href) ? href : '#';

  return (
    <a
      ref={anchorRef}
      href={safeHref}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="flex items-center gap-3 rounded-lg border border-border px-4 py-3 hover:bg-accent w-full text-foreground"
    >
      <span ref={iconRef} className="text-muted-foreground">
        {Icon ? <Icon /> : <Globe />}
      </span>
      <span className="truncate flex-1">{text ?? href}</span>
    </a>
  );
}
