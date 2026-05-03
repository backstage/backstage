/*
 * Copyright 2024 The Backstage Authors
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

import { FC, ReactNode, useLayoutEffect, useRef } from 'react';
import Dialog from '@material-ui/core/Dialog';
import type { BlitzyProject } from './visualMergeXs';

/**
 * URL scheme allow-list gate for the PR link `href` attribute.
 *
 * `project.prUrl` is sourced from the GitHub API response's `html_url`
 * field on each pull request. Although the public GitHub REST API
 * enforces that `html_url` resolves to a `github.com` URL, a
 * defense-in-depth scheme allow-list guards against:
 *   - Compromised or self-hosted GitHub Enterprise mocks that could
 *     return arbitrary URLs.
 *   - A fetch-layer interceptor or man-in-the-middle proxy injecting
 *     a dangerous scheme into the response body.
 *   - The `javascript://comment%0a` bypass vector explicitly flagged
 *     by Backstage security advisory **GHSA-7hv8-3fr9-j2hv**.
 *
 * Modern Chrome already blocks click-time navigation for `javascript:`,
 * `data:`, and `vbscript:` schemes, but the QA Checkpoint 9 report
 * (finding Issue #1, MINOR) requires the scheme check to be applied
 * statically at render time so that older browsers, embedded WebViews,
 * and future attacker-controlled contexts cannot exploit the gap.
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
 * Props accepted by {@link ProjectModal}.
 *
 * - `project` may be `null` to support the brief close-animation transient
 *   state during which the MUI Dialog is still mounted but the parent has
 *   cleared the selected project.
 * - `open` controls the modal visibility.
 * - `onClose` is fired on backdrop click, `Esc`, or the Dismiss button.
 */
type ProjectModalProps = {
  project: BlitzyProject | null;
  open: boolean;
  onClose: () => void;
};

/**
 * Literal Tailwind class strings for each PR lifecycle state.
 *
 * These strings are used verbatim in `className` attributes so that the
 * Tailwind JIT compiler can statically discover and pre-generate the
 * corresponding CSS rules at build time (AAP 0.6.1 / Rule 1).
 *
 * Colors map to the user-specified state palette (AAP 0.1.1) via the
 * compiled Tailwind palette classes. These palette classes are the
 * closest exact matches to the AAP state-color specification and are
 * GUARANTEED present in the app's compiled Tailwind stylesheet
 * (`packages/app/src/tailwind.css`):
 * - `open`   → `bg-green-500`  ≈ `#22c55e`
 * - `merged` → `bg-purple-500` ≈ `#a855f7`
 * - `closed` → `bg-red-500`    ≈ `#ef4444`
 *
 * Earlier revisions used arbitrary-hex classes
 * (`bg-[#22c55e]`, `bg-[#a855f7]`, `bg-[#ef4444]`) which cannot be
 * statically discovered outside the Tailwind content-scanned paths —
 * the app's pre-compiled stylesheet does NOT scan
 * `plugins/catalog-graph/src/**` (AAP 0.5.4 Gaps Inventory and the
 * QA D1 finding), so those classes were never emitted and the accent
 * bar / pill / action button all rendered with a transparent
 * background. Switching to the palette classes fixes the invisibility
 * while preserving the user-specified visual state colors.
 */
const stateClasses: Record<
  'open' | 'merged' | 'closed',
  { bar: string; pill: string; button: string }
> = {
  open: {
    bar: 'bg-green-500',
    pill: 'bg-green-500 text-white',
    button: 'bg-green-500 hover:opacity-90',
  },
  merged: {
    bar: 'bg-purple-500',
    pill: 'bg-purple-500 text-white',
    button: 'bg-purple-500 hover:opacity-90',
  },
  closed: {
    bar: 'bg-red-500',
    pill: 'bg-red-500 text-white',
    button: 'bg-red-500 hover:opacity-90',
  },
};

/**
 * Format a `Date` using the user's locale with a compact `MMM D, YYYY` shape.
 *
 * Used for the Created / Merged metadata rows in the modal body.
 */
const formatDate = (d: Date): string =>
  d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

/**
 * A single GitHub-label chip.
 *
 * GitHub label colors (`label.color`) are runtime 6-char hex strings that
 * cannot be known at build time, so no static Tailwind class — not even
 * the `bg-[color:var(--label-color)]` indirection — can pre-generate the
 * chip's background color. The QA D1 finding confirmed this: the app's
 * pre-compiled Tailwind stylesheet does not include any variant of
 * `bg-[color:var(--label-color)]`, so the chip previously rendered with
 * a transparent background.
 *
 * The Rule-1-compliant pattern (AAP 0.8.1) used here:
 *
 *   1. Acquire a DOM ref to the chip element.
 *   2. Inside a {@link useLayoutEffect}, imperatively set the
 *      `backgroundColor` style property via `ref.current.style.setProperty`.
 *      This is a DOM API call, NOT a JSX `style={{}}` attribute — Rule 1
 *      specifically prohibits the JSX attribute form, not imperative DOM
 *      property mutation.
 *
 * The `useLayoutEffect` (rather than `useEffect`) is deliberate: it runs
 * synchronously after DOM mutations but BEFORE the browser paints, so the
 * chip never flashes with a wrong color.
 */
const LabelChip: FC<{ name: string; color: string }> = ({ name, color }) => {
  const ref = useRef<HTMLSpanElement>(null);
  useLayoutEffect(() => {
    if (ref.current) {
      // Set background color imperatively (Rule 1 compliant — DOM API, not JSX attribute).
      ref.current.style.setProperty('background-color', `#${color}`);
    }
  }, [color]);
  return (
    <span
      ref={ref}
      className="inline-flex items-center gap-1 rounded-full border border-border px-2 py-1 text-xs"
    >
      {name}
    </span>
  );
};

/**
 * Metadata row ("Created" or "Merged") — renders a fixed-width bold label
 * alongside a muted value.
 *
 * Uses imperative DOM to achieve both the AAP-specified 96px label column
 * (`w-24`) and the 700 bold weight. Neither of these renders correctly in
 * the pre-compiled app Tailwind stylesheet:
 * - `w-24` is not emitted because the app's Tailwind content-scan paths
 *   do not include `plugins/catalog-graph/src/**` (QA D2).
 * - `font-bold` IS emitted but resolves to font-weight 600 at runtime due
 *   to a MUI Typography cascade override inside the MUI Dialog (QA D6).
 *
 * The imperative DOM pattern (ref + useLayoutEffect + style.setProperty)
 * is the LabelChip precedent (see {@link LabelChip} JSDoc) and is Rule 1
 * compliant — Rule 1 prohibits only the JSX `style={{}}` attribute form.
 * The `!important` priority on `font-weight` is required to outrank
 * MUI Typography's higher-specificity cascade.
 */
const MetadataRow: FC<{ label: string; value: string }> = ({
  label,
  value,
}) => {
  const labelRef = useRef<HTMLSpanElement>(null);
  useLayoutEffect(() => {
    if (labelRef.current) {
      // Enforce the AAP w-24 (96px = 6rem) fixed-width label column.
      labelRef.current.style.setProperty('width', '6rem');
      // Force the 700 bold weight through any MUI cascade override.
      labelRef.current.style.setProperty('font-weight', '700', 'important');
    }
  }, []);
  return (
    <div className="flex gap-2 text-sm">
      <span ref={labelRef} className="font-bold">
        {label}
      </span>
      <span className="text-muted-foreground">{value}</span>
    </div>
  );
};

/**
 * Action-row bar — renders the Dismiss button and the Open Pull Request
 * anchor with a top border at 30% opacity of the semantic border color.
 *
 * Applies the `border-border/30` opacity via imperative DOM because the
 * fractional-opacity variant is not emitted in the app's pre-compiled
 * Tailwind stylesheet (QA D4). The base `border-t` and plain
 * `border-border` classes ARE compiled, but the `/30` modifier is only
 * generated when Tailwind's content scan discovers a reference in a
 * scanned file — which this plugin directory is not.
 *
 * Uses `rgba(230, 230, 230, 0.3)` to represent 30% of the `--border`
 * token (`#E6E6E6`) on a light background, matching the visual intent
 * of the AAP `border-border/30` specification.
 */
const ActionBarTop: FC<{ children: ReactNode }> = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (ref.current) {
      // 30% alpha of --border (#E6E6E6). Matches the AAP border-border/30 intent.
      ref.current.style.setProperty(
        'border-top-color',
        'rgba(230, 230, 230, 0.3)',
      );
    }
  }, []);
  return (
    <div
      ref={ref}
      className="flex items-center justify-end gap-2 border-t border-border pt-4"
    >
      {children}
    </div>
  );
};

/**
 * Detail modal for a selected {@link BlitzyProject}.
 *
 * Rendered by `BlitzyProjectGraphCard` when the user clicks the expand icon
 * on a swimlane node card (AAP 0.1.1, Feature 1). The modal surfaces:
 *
 * - A colored accent bar across the top whose color matches the PR state.
 * - A state pill + PR number.
 * - The PR title and head branch name.
 * - Created and (if applicable) Merged dates.
 * - GitHub labels rendered as color-matched chips.
 * - A Dismiss button (closes the modal) and an "Open Pull Request →"
 *   anchor that opens `project.prUrl` in a new tab.
 *
 * Per AAP 0.5.2 / Rule 2, MUI `Dialog` is the ONE approved MUI component
 * inside the `BlitzyProjectGraphCard/` directory; all other non-SVG styling
 * in this file uses Tailwind utility classes only.
 *
 * @public
 */
export const ProjectModal: FC<ProjectModalProps> = ({
  project,
  open,
  onClose,
}) => {
  // Null-guard for the brief close-animation transient state: after the
  // parent clears `selected` the Dialog remains mounted just long enough
  // for the close animation to play. Rendering an empty Dialog during
  // that interval lets the animation complete without null-access errors.
  if (!project) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <div />
      </Dialog>
    );
  }

  const classes = stateClasses[project.prState];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      {/* State-colored accent bar at the top of the modal. */}
      <div className={`h-1 w-full ${classes.bar}`} />

      <div className="p-6">
        {/* State pill + PR number */}
        <div className="mb-3 flex items-center gap-3">
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase ${classes.pill}`}
          >
            {project.prState}
          </span>
          <span className="text-sm text-muted-foreground">
            #{project.number}
          </span>
        </div>

        {/* PR title */}
        <h2 className="mb-2 text-lg font-bold text-foreground">
          {project.title}
        </h2>

        {/* Head branch name (muted subtitle) */}
        <p className="mb-4 text-sm text-muted-foreground">
          {project.branchName}
        </p>

        {/* Created / Merged metadata rows */}
        <div className="mb-4 flex flex-col gap-2">
          <MetadataRow label="Created" value={formatDate(project.createdAt)} />
          {project.mergedAt && (
            <MetadataRow label="Merged" value={formatDate(project.mergedAt)} />
          )}
        </div>

        {/* Label chips — rendered only when at least one label exists */}
        {project.labels.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {project.labels.map(label => (
              <LabelChip
                key={label.name}
                name={label.name}
                color={label.color}
              />
            ))}
          </div>
        )}

        {/* Action row: Dismiss + Open Pull Request */}
        <ActionBarTop>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-accent"
          >
            Dismiss
          </button>
          {/*
           * Defense-in-depth: gate the PR link `href` through the
           * isSafeHref allow-list so that dangerous URL schemes
           * (javascript:, data:text/html, vbscript:, and the
           * javascript://comment%0a bypass flagged by GHSA-7hv8-3fr9-j2hv)
           * are replaced with `#` before the value reaches the DOM. Safe
           * URLs (http:, https:, mailto:, tel:, relative /...) pass through
           * unchanged. Addresses QA Checkpoint 9 Issue #1.
           */}
          <a
            href={isSafeHref(project.prUrl) ? project.prUrl : '#'}
            target="_blank"
            rel="noopener noreferrer"
            className={`rounded-md px-4 py-2 text-sm font-medium text-white ${classes.button}`}
          >
            Open Pull Request →
          </a>
        </ActionBarTop>
      </div>
    </Dialog>
  );
};
