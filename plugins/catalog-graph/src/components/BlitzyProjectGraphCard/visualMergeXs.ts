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

/**
 * The lifecycle state of a GitHub pull request, as projected into a
 * {@link BlitzyProject}.
 *
 * - `'open'`   — PR is still open; not yet merged or closed.
 * - `'merged'` — PR has been merged to the target branch (`mergedAt` is set).
 * - `'closed'` — PR has been closed without being merged (`mergedAt` is null).
 */
export type PRState = 'open' | 'merged' | 'closed';

/**
 * Normalized project record derived from a GitHub pull request, suitable for
 * plotting on the SVG swimlane diagram and for surfacing in the ProjectModal.
 */
export type BlitzyProject = {
  /** The head branch name of the pull request (e.g., `feature/my-branch`). */
  branchName: string;
  /** The lifecycle state of the pull request. */
  prState: PRState;
  /** The UTC timestamp the pull request was created. */
  createdAt: Date;
  /**
   * The UTC timestamp the pull request was merged, or `null` if the pull
   * request is still open or was closed without merging.
   */
  mergedAt: Date | null;
  /** The labels attached to the pull request. */
  labels: Array<{ name: string; color: string }>;
  /** The HTML URL of the pull request on GitHub. */
  prUrl: string;
  /** The title of the pull request. */
  title: string;
  /** The numeric identifier of the pull request within its repository. */
  number: number;
};

/**
 * Minimum visual width of a branch segment before it merges back to trunk.
 *
 * Matches `MIN_BOX_W` in `BlitzyProjectGraphCard.tsx` — kept in sync so the
 * clamp in {@link visualMergeXs} produces geometry consistent with the node
 * card layout.
 */
const MIN_BOX_W = 80;

/**
 * Right-most x-coordinate of the timeline.
 *
 * Matches `TIMELINE_END` in `BlitzyProjectGraphCard.tsx`. Used as the fallback
 * upper bound for `nextSplitAfterSplit` when no subsequent project split
 * exists.
 */
const TIMELINE_END = 696;

/**
 * Compute the visual merge-x coordinate for each project in the swimlane
 * diagram.
 *
 * For each project:
 * - If the PR is not merged (`mergedAt` is `null`), returns `null` at that
 *   index.
 * - Otherwise, computes:
 *   - `splitX`: x-position where the branch splits from trunk
 *     (`project.createdAt`).
 *   - `mergeX`: x-position where the branch merges back to trunk
 *     (`project.mergedAt`).
 *   - `nextSplitAfterSplit`: the minimum `splitX` among OTHER projects whose
 *     `splitX` is strictly greater than this project's `splitX + 2`. Falls
 *     back to {@link TIMELINE_END} if no such subsequent split exists.
 *
 * Rule 5 (AAP 0.8.5) — CRITICAL CAP SEMANTICS:
 * - When `mergeX >= nextSplitAfterSplit - 2`: return
 *   `Math.max(mergeX, splitX + 8)` UNCAPPED, letting the merge plot past
 *   subsequent splits. A PR merged Apr 17 MUST plot to the right of a PR
 *   opened Feb 27.
 * - When `mergeX <  nextSplitAfterSplit - 2`: apply the full clamp
 *   `max(min(max(mergeX, splitX + MIN_BOX_W), nextSplitAfterSplit - 6), splitX + 8)`.
 *
 * The function is pure and deterministic: calling it with the same
 * `(projects, toX)` always yields the same result. This is essential for
 * `React.useMemo` correctness in the consuming component.
 *
 * @param projects - Array of {@link BlitzyProject} records.
 * @param toX      - Function mapping a `Date` to its x-coordinate on the SVG
 *                   axis.
 * @returns An array the same length as `projects`; each entry is either
 *          `null` (unmerged PR) or the computed visual merge-x number.
 */
export function visualMergeXs(
  projects: BlitzyProject[],
  toX: (d: Date) => number,
): Array<number | null> {
  // Pre-compute splitX for every project once so the inner "min split x among
  // other PRs" loop is O(N) per project rather than calling `toX` repeatedly.
  const splitXs = projects.map(p => toX(p.createdAt));

  return projects.map((project, i) => {
    // "if not merged → null"
    if (!project.mergedAt) {
      return null;
    }

    // "splitX = toX(project.createdAt)"
    const splitX = splitXs[i];
    // "mergeX = toX(project.mergedAt)"
    const mergeX = toX(project.mergedAt);

    // "nextSplitAfterSplit = min split x among other PRs where
    //  split > splitX + 2, else TIMELINE_END"
    let nextSplitAfterSplit = TIMELINE_END;
    for (let j = 0; j < projects.length; j++) {
      // "among OTHER PRs" — exclude the current project.
      if (j === i) {
        continue;
      }
      const otherSplit = splitXs[j];
      if (otherSplit > splitX + 2 && otherSplit < nextSplitAfterSplit) {
        nextSplitAfterSplit = otherSplit;
      }
    }

    // Rule 5: when mergeX >= nextSplitAfterSplit - 2, return the uncapped
    // `max(mergeX, splitX + 8)` so a PR merged after a later PR's open date
    // plots to the right of that PR's split.
    if (mergeX >= nextSplitAfterSplit - 2) {
      return Math.max(mergeX, splitX + 8);
    }

    // Otherwise apply the full clamp:
    // max(min(max(mergeX, splitX + MIN_BOX_W), nextSplitAfterSplit - 6), splitX + 8)
    return Math.max(
      Math.min(Math.max(mergeX, splitX + MIN_BOX_W), nextSplitAfterSplit - 6),
      splitX + 8,
    );
  });
}
