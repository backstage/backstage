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

import { useMemo, useState } from 'react';
import { useEntity } from '@backstage/plugin-catalog-react';
import {
  useApi,
  fetchApiRef,
  discoveryApiRef,
} from '@backstage/core-plugin-api';
import useAsync from 'react-use/esm/useAsync';
import { visualMergeXs, BlitzyProject } from './visualMergeXs';
import { ProjectModal } from './ProjectModal';

/**
 * SVG canvas width — width attribute applied to the `<svg>` root element.
 *
 * Preserved verbatim per AAP 0.1.2.
 */
const SVG_W = 940;

/**
 * Y-coordinate of the trunk horizontal line on the SVG canvas.
 *
 * Preserved verbatim per AAP 0.1.2.
 */
const TRUNK_Y = 52;

/**
 * Vertical distance between each branch swimlane row.
 *
 * Preserved verbatim per AAP 0.1.2.
 */
const ROW_H = 82;

/**
 * Width of each PR node card (right-hand card rectangle).
 *
 * Preserved verbatim per AAP 0.1.2.
 */
const NODE_W = 200;

/**
 * Height of each PR node card.
 *
 * Preserved verbatim per AAP 0.1.2.
 */
const NODE_H = 60;

/**
 * Left-most x-coordinate of the trunk (and the earliest possible split
 * x-coordinate produced by `makeTimeScale`).
 *
 * Preserved verbatim per AAP 0.1.2.
 */
const TRUNK_START = 170;

/**
 * Left edge x-coordinate of the PR node card column.
 *
 * Preserved verbatim per AAP 0.1.2.
 */
const NODE_L = 724;

/**
 * Right-most x-coordinate of the trunk (and the latest possible x-coordinate
 * produced by `makeTimeScale`).
 *
 * Preserved verbatim per AAP 0.1.2.
 */
const TIMELINE_END = 696;

/**
 * Literal hex color strings for each PR lifecycle state, matching the
 * user-specified palette from AAP 0.1.1:
 *
 * - `open`   → `#22c55e` (green)  — in-flight PR
 * - `merged` → `#a855f7` (purple) — merged PR
 * - `closed` → `#ef4444` (red)    — closed without merge
 *
 * Applied directly to SVG `stroke` / `fill` attributes, which are exempt
 * from the Tailwind-only rule (Rule 1 / AAP 0.8.1) because SVG geometry
 * and presentation attributes are the idiomatic way to style SVG nodes.
 */
const STATE_COLORS: Record<'open' | 'merged' | 'closed', string> = {
  open: '#22c55e',
  merged: '#a855f7',
  closed: '#ef4444',
};

/**
 * Color of the trunk line, split dots on trunk, and default muted text on
 * the node cards. Grey-500 from the user-specified palette (AAP 0.1.1).
 */
const TRUNK_COLOR = '#6b7280';

/**
 * Shape of a single pull request record as returned by the GitHub REST API
 * (`GET /repos/{owner}/{repo}/pulls`), narrowed to the fields consumed by
 * `mapPRToProject`. All other fields on the response are intentionally
 * ignored.
 */
type GitHubPR = {
  number: number;
  title: string;
  state: 'open' | 'closed';
  html_url: string;
  created_at: string;
  merged_at: string | null;
  head: { ref: string };
  labels: Array<{ name: string; color: string }>;
};

/**
 * Normalize a GitHub PR payload into a {@link BlitzyProject} record suitable
 * for the swimlane diagram.
 *
 * - `branchName` falls back to the PR title when `head.ref` is absent
 *   (extremely rare but defensively guarded).
 * - `prState` collapses GitHub's `state + merged_at` pair into a single
 *   discriminator: `merged` when `merged_at` is non-null, else the raw
 *   `state` ('open' or 'closed').
 * - `createdAt` / `mergedAt` are coerced from ISO strings to `Date` objects.
 * - `labels` defaults to an empty array when GitHub omits the field.
 */
const mapPRToProject = (pr: GitHubPR): BlitzyProject => ({
  branchName: pr.head?.ref || pr.title,
  prState: pr.merged_at ? 'merged' : pr.state,
  createdAt: new Date(pr.created_at),
  mergedAt: pr.merged_at ? new Date(pr.merged_at) : null,
  labels: pr.labels || [],
  prUrl: pr.html_url,
  title: pr.title,
  number: pr.number,
});

/**
 * Build a time-scale mapper that projects a `Date` onto an x-coordinate in
 * the `[TRUNK_START, TIMELINE_END]` range.
 *
 * Collects every `createdAt` / `mergedAt` timestamp in the project set.
 * When at least one PR is still open, includes `Date.now()` so that the
 * open-PR branches extend naturally to "now" on the visible axis.
 *
 * Edge cases:
 * - Zero projects → constant function returning `TRUNK_START`.
 * - All dates identical (span = 0) → every date maps to `TRUNK_START` via
 *   the `span || 1` guard.
 */
const makeTimeScale = (projects: BlitzyProject[]) => {
  const dates: number[] = [];
  let hasOpen = false;
  for (const p of projects) {
    dates.push(p.createdAt.getTime());
    if (p.mergedAt) dates.push(p.mergedAt.getTime());
    if (p.prState === 'open') hasOpen = true;
  }
  if (hasOpen) dates.push(Date.now());
  if (dates.length === 0) {
    return (_d: Date) => TRUNK_START;
  }
  const minT = Math.min(...dates);
  const maxT = Math.max(...dates);
  const span = maxT - minT || 1;
  return (d: Date) =>
    TRUNK_START + ((d.getTime() - minT) / span) * (TIMELINE_END - TRUNK_START);
};

/**
 * Truncate a string to `max` characters, appending an ellipsis if it was
 * clipped. SVG `<text>` does not natively support `text-overflow: ellipsis`,
 * so truncation is performed in JS before render.
 */
const truncate = (s: string, max: number): string =>
  s.length > max ? `${s.slice(0, max - 2)}…` : s;

/**
 * `BlitzyProjectGraphCard`
 *
 * Feature 1 — a brand-new SVG swimlane diagram card for the Backstage entity
 * page. Fetches the entity's GitHub pull requests through the backend proxy
 * (`/api/proxy/github-api/repos/{owner}/{repo}/pulls?state=all&per_page=100`)
 * and plots each PR as a color-coded branch line on a time-scaled axis with a
 * clickable node card that opens a {@link ProjectModal} detail dialog.
 *
 * Key invariants enforced by this component:
 * - **Rule 9 (AAP 0.8.9)**: returns `null` when the entity has no
 *   `github.com/project-slug` annotation — no DOM output, no spinner,
 *   no error state, no empty diagram.
 * - **Rule 4 (AAP 0.8.4)**: the detail modal is triggered only by the
 *   expand-icon `<g>` element's `onClick`; the node-card group is NOT
 *   wrapped in an `<a>` tag.
 * - **Rule 1 (AAP 0.8.1)**: no inline `style={{}}` objects on non-SVG
 *   elements; the cursor affordance uses the `cursor-pointer` Tailwind
 *   utility on the SVG `<g>`, which React forwards to the DOM as a class
 *   attribute.
 * - **Rules of Hooks**: every hook (`useEntity`, `useApi`, `useState`,
 *   `useAsync`, `useMemo`) is called unconditionally at the top of the
 *   function body. The Rule 9 early `return null` happens AFTER all hook
 *   calls, and the `useAsync` callback short-circuits internally when the
 *   slug is absent so the hook invocation is stable across renders.
 *
 * The component is a named export (NOT default) so that `alpha.tsx` can
 * dynamic-import it and pass the named symbol to the EntityCardBlueprint
 * factory (AAP 0.1.2 registration snippet).
 */
export const BlitzyProjectGraphCard = () => {
  // Hook 1 — entity context resolution
  const { entity } = useEntity();
  const slug = entity.metadata.annotations?.['github.com/project-slug'];

  // Hooks 2 & 3 — API service locators (always resolved; stable refs)
  const fetchApi = useApi(fetchApiRef);
  const discoveryApi = useApi(discoveryApiRef);

  // Hook 4 — modal selection state. `null` means no modal open; a
  // BlitzyProject value means that project's detail dialog is visible.
  const [selected, setSelected] = useState<BlitzyProject | null>(null);

  // Hook 5 — async GitHub PR fetch. The callback short-circuits with
  // `undefined` when `slug` is absent so that the hook invocation remains
  // in the same position on every render (preserving hook order) while
  // still satisfying Rule 9's "no network traffic without a slug"
  // expectation. The dependency list rebuilds the fetch only when the
  // slug or API refs change.
  const { value, loading, error } = useAsync(async () => {
    if (!slug) return undefined;
    const [owner, repo] = slug.split('/');
    if (!owner || !repo) return undefined;
    const proxyBase = await discoveryApi.getBaseUrl('proxy');
    const url = `${proxyBase}/github-api/repos/${owner}/${repo}/pulls?state=all&per_page=100`;
    const res = await fetchApi.fetch(url);
    if (!res.ok) {
      throw new Error(`GitHub proxy returned ${res.status}`);
    }
    const prs: GitHubPR[] = await res.json();
    return prs.map(mapPRToProject);
  }, [slug, fetchApi, discoveryApi]);

  // Hook 6 — memoized projects array. `value` is `undefined` while loading,
  // on error, or when the slug is absent; we coerce to a stable empty array
  // so downstream memo hooks receive a reference that only changes when the
  // underlying fetched value changes, satisfying `react-hooks/exhaustive-deps`.
  const projects: BlitzyProject[] = useMemo(() => value ?? [], [value]);

  // Hook 7 — memoized time-scale mapper. Recomputes only when the
  // projects array identity changes (which happens exactly once per
  // successful fetch due to `useAsync` caching the promise result).
  const toX = useMemo(() => makeTimeScale(projects), [projects]);

  // Hook 8 — memoized visual merge-x coordinates. Produces one number
  // per merged PR (or `null` for unmerged PRs), reflecting the Rule 5
  // capping algorithm implemented in `./visualMergeXs`.
  const mergeXs = useMemo(() => visualMergeXs(projects, toX), [projects, toX]);

  // --- Conditional rendering (all hooks above this point are
  //     unconditional, preserving React's Rules of Hooks contract). ---

  // Rule 9 (AAP 0.8.9): absent slug → render nothing. No card DOM, no
  // spinner, no error. This is placed AFTER all hooks so that the hook
  // call order is stable across renders even when the slug transitions
  // from undefined → defined.
  if (!slug) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div
          className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-muted border-t-foreground"
          role="progressbar"
          aria-label="Loading pull requests"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-sm text-red-600">
        Failed to load pull requests: {error.message}
      </div>
    );
  }

  // SVG canvas height: trunk row at `TRUNK_Y`, one swimlane row per
  // project plus one trailing row of padding, and a 40px bottom buffer
  // so the lowest node card is not flush against the SVG edge.
  const svgHeight = TRUNK_Y + ROW_H * (projects.length + 1) + 40;

  return (
    <div className="w-full overflow-x-auto rounded-lg border border-border bg-background p-4">
      <svg
        width={SVG_W}
        height={svgHeight}
        viewBox={`0 0 ${SVG_W} ${svgHeight}`}
        role="img"
        aria-label="Pull requests swimlane"
      >
        {/* Trunk — horizontal grey line spanning the whole timeline. */}
        <line
          x1={TRUNK_START}
          y1={TRUNK_Y}
          x2={TIMELINE_END}
          y2={TRUNK_Y}
          stroke={TRUNK_COLOR}
          strokeWidth={2}
        />
        {projects.map((project, i) => {
          const rowY = TRUNK_Y + ROW_H * (i + 1);
          const splitX = toX(project.createdAt);
          const stateColor = STATE_COLORS[project.prState];
          const mergeX = mergeXs[i];
          const isMerged = project.prState === 'merged' && mergeX !== null;
          // Merged branches terminate at `mergeX` (then rise to trunk);
          // open and closed branches extend to `NODE_L - 4` so the line
          // visually meets the node card's left accent bar.
          const branchEndX = isMerged ? (mergeX as number) : NODE_L - 4;
          const title = truncate(project.title, 24);
          const branchName = truncate(project.branchName, 28);

          return (
            <g key={project.number}>
              {/* Split dot on trunk — the origin point of the branch. */}
              <circle cx={splitX} cy={TRUNK_Y} r={4} fill={TRUNK_COLOR} />
              {/* Vertical descent from trunk down to this branch's row. */}
              <line
                x1={splitX}
                y1={TRUNK_Y}
                x2={splitX}
                y2={rowY}
                stroke={stateColor}
                strokeWidth={2}
              />
              {/* Horizontal branch line in the state color (solid —
                  never dashed, per Per-Story 1.6). */}
              <line
                x1={splitX}
                y1={rowY}
                x2={branchEndX}
                y2={rowY}
                stroke={stateColor}
                strokeWidth={2}
              />
              {/* Merged PRs: vertical rise back to trunk + merge-dot
                  circle. Open/closed PRs render neither — a closed PR
                  branch simply terminates near the node card without
                  reconnecting to the trunk. */}
              {isMerged && (
                <>
                  <line
                    x1={mergeX as number}
                    y1={rowY}
                    x2={mergeX as number}
                    y2={TRUNK_Y}
                    stroke={stateColor}
                    strokeWidth={2}
                  />
                  <circle
                    cx={mergeX as number}
                    cy={TRUNK_Y}
                    r={4}
                    fill={stateColor}
                  />
                </>
              )}
              {/* Node card group — shadow, body, accent bar, text,
                  clickable expand icon. */}
              <g>
                {/* Drop shadow (8% black, offset +2px). Rendered before
                    the body rect so it appears beneath the white card. */}
                <rect
                  x={NODE_L + 2}
                  y={rowY - NODE_H / 2 + 2}
                  width={NODE_W}
                  height={NODE_H}
                  fill="#00000014"
                  rx={6}
                />
                {/* White card body with a thin grey border. */}
                <rect
                  x={NODE_L}
                  y={rowY - NODE_H / 2}
                  width={NODE_W}
                  height={NODE_H}
                  fill="#ffffff"
                  stroke="#e5e7eb"
                  rx={6}
                />
                {/* 4px left accent bar in the state color. */}
                <rect
                  x={NODE_L}
                  y={rowY - NODE_H / 2}
                  width={4}
                  height={NODE_H}
                  fill={stateColor}
                />
                {/* PR title — bold, dark, truncated with ellipsis. */}
                <text
                  x={NODE_L + 12}
                  y={rowY - 8}
                  fontSize={12}
                  fontWeight={700}
                  fill="#111827"
                >
                  {title}
                </text>
                {/* Branch name — muted, smaller, truncated. */}
                <text x={NODE_L + 12} y={rowY + 8} fontSize={10} fill="#6b7280">
                  {branchName}
                </text>
                {/* State label — same state color as the accent bar. */}
                <text
                  x={NODE_L + 12}
                  y={rowY + 22}
                  fontSize={10}
                  fontWeight={600}
                  fill={stateColor}
                >
                  {project.prState}
                </text>
                {/* Expand icon — the ONLY clickable element in this
                    node card (Rule 4 / AAP 0.8.4). Cursor affordance is
                    applied via the `cursor-pointer` Tailwind utility
                    class on the `<g>` (Rule 1 / AAP 0.8.1 — no inline
                    `style` object). An invisible 20×20 hit area rect
                    makes the icon easier to click without affecting
                    visual layout. */}
                <g
                  onClick={() => setSelected(project)}
                  className="cursor-pointer"
                  role="button"
                  aria-label={`Open details for PR ${project.number}`}
                  tabIndex={0}
                >
                  <rect
                    x={NODE_L + NODE_W - 28}
                    y={rowY - NODE_H / 2 + 8}
                    width={20}
                    height={20}
                    fill="transparent"
                  />
                  <path
                    d={`M${NODE_L + NODE_W - 22},${
                      rowY - NODE_H / 2 + 14
                    } h4 v-4 M${NODE_L + NODE_W - 14},${
                      rowY - NODE_H / 2 + 14
                    } h-4 v-4 M${NODE_L + NODE_W - 22},${
                      rowY - NODE_H / 2 + 22
                    } h4 v4 M${NODE_L + NODE_W - 14},${
                      rowY - NODE_H / 2 + 22
                    } h-4 v4`}
                    stroke={stateColor}
                    strokeWidth={1.5}
                    fill="none"
                    strokeLinecap="round"
                  />
                </g>
              </g>
            </g>
          );
        })}
      </svg>
      {/* Detail modal — rendered unconditionally so that MUI's Dialog
          can animate its close transition. `open={!!selected}` drives
          visibility; `project` is passed through even during the brief
          close-animation window when `selected` is still defined. */}
      <ProjectModal
        project={selected}
        open={!!selected}
        onClose={() => setSelected(null)}
      />
    </div>
  );
};
