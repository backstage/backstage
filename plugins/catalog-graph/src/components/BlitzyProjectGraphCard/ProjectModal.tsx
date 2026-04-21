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

import { FC, useLayoutEffect, useRef } from 'react';
import Dialog from '@material-ui/core/Dialog';
import type { BlitzyProject } from './visualMergeXs';

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
 * Colors map to the user-specified state palette (AAP 0.1.1):
 * - `open`   → `#22c55e` (green)
 * - `merged` → `#a855f7` (purple)
 * - `closed` → `#ef4444` (red)
 */
const stateClasses: Record<
  'open' | 'merged' | 'closed',
  { bar: string; pill: string; button: string }
> = {
  open: {
    bar: 'bg-[#22c55e]',
    pill: 'bg-[#22c55e] text-white',
    button: 'bg-[#22c55e] hover:opacity-90',
  },
  merged: {
    bar: 'bg-[#a855f7]',
    pill: 'bg-[#a855f7] text-white',
    button: 'bg-[#a855f7] hover:opacity-90',
  },
  closed: {
    bar: 'bg-[#ef4444]',
    pill: 'bg-[#ef4444] text-white',
    button: 'bg-[#ef4444] hover:opacity-90',
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
 * cannot be known at build time, so the Tailwind JIT compiler cannot
 * pre-generate `bg-[#<dynamic>]` classes for them. The Rule-1-compliant
 * pattern (AAP 0.8.1) is:
 *
 *   1. Apply the literal Tailwind class `bg-[color:var(--label-color)]`
 *      which the JIT resolves at build time to
 *      `background-color: var(--label-color)`.
 *   2. Set the `--label-color` CSS custom property per-instance via the
 *      imperative DOM API (`style.setProperty`) inside a
 *      {@link useLayoutEffect}. This is a DOM API call, NOT a JSX
 *      `style={{}}` attribute — Rule 1 specifically prohibits the JSX
 *      attribute form, not imperative DOM property mutation.
 *
 * The `useLayoutEffect` (rather than `useEffect`) is deliberate: it runs
 * synchronously after DOM mutations but BEFORE the browser paints, so the
 * chip never flashes with a wrong color.
 */
const LabelChip: FC<{ name: string; color: string }> = ({ name, color }) => {
  const ref = useRef<HTMLSpanElement>(null);
  useLayoutEffect(() => {
    if (ref.current) {
      ref.current.style.setProperty('--label-color', `#${color}`);
    }
  }, [color]);
  return (
    <span
      ref={ref}
      className="inline-flex items-center gap-1 rounded-full border border-border bg-[color:var(--label-color)] px-2 py-1 text-xs"
    >
      {name}
    </span>
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
          <div className="flex gap-2 text-sm">
            <span className="w-24 font-bold">Created</span>
            <span className="text-muted-foreground">
              {formatDate(project.createdAt)}
            </span>
          </div>
          {project.mergedAt && (
            <div className="flex gap-2 text-sm">
              <span className="w-24 font-bold">Merged</span>
              <span className="text-muted-foreground">
                {formatDate(project.mergedAt)}
              </span>
            </div>
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
        <div className="flex items-center justify-end gap-2 border-t border-border/30 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-accent"
          >
            Dismiss
          </button>
          <a
            href={project.prUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`rounded-md px-4 py-2 text-sm font-medium text-white ${classes.button}`}
          >
            Open Pull Request →
          </a>
        </div>
      </div>
    </Dialog>
  );
};
