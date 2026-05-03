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

import { visualMergeXs } from './visualMergeXs';
import type { BlitzyProject } from './visualMergeXs';

/**
 * Helper: map a fixed set of Dates to predetermined x-positions for
 * deterministic testing. Mirrors the behavior of the real
 * `makeTimeScale(projects)` output in a deterministic way without needing the
 * full time-scale computation.
 *
 * Throws when called with an unmapped Date, so a test that accidentally
 * probes an unexpected date fails loudly instead of returning `NaN` /
 * `undefined` and producing a silent false-positive assertion.
 */
const makeToXStub = (entries: Array<[Date, number]>) => {
  const m = new Map<number, number>();
  for (const [date, x] of entries) {
    m.set(date.getTime(), x);
  }
  return (d: Date): number => {
    const v = m.get(d.getTime());
    if (v === undefined) {
      throw new Error(`Unmapped date: ${d.toISOString()}`);
    }
    return v;
  };
};

/**
 * Factory for creating `BlitzyProject` test fixtures. The shape is
 * single-sourced from `./visualMergeXs` (via the `Partial<BlitzyProject>`
 * parameter and the `BlitzyProject` return type). If a required field is
 * added to `BlitzyProject`, this factory fails compilation and flags the
 * drift immediately.
 *
 * `visualMergeXs` only strictly consumes `createdAt`, `mergedAt`, and
 * `prState` — the other fields are populated with stable stub values so the
 * fixtures remain type-complete.
 */
const makeProject = (partial: Partial<BlitzyProject>): BlitzyProject => ({
  branchName: partial.branchName ?? 'feature/test',
  prState: partial.prState ?? 'open',
  createdAt: partial.createdAt ?? new Date('2024-01-01T00:00:00Z'),
  mergedAt: partial.mergedAt ?? null,
  labels: partial.labels ?? [],
  prUrl: partial.prUrl ?? 'https://github.com/test/test/pull/1',
  title: partial.title ?? 'Test PR',
  number: partial.number ?? 1,
});

describe('visualMergeXs', () => {
  // Case (a) — Cap Applied (`mergeX < nextSplitAfterSplit − 2`)
  //
  // PR A: created Jan 1 (splitX=200), merged Feb 10 (mergeX=250).
  // PR B: created Feb 27 (splitX=300), never merged.
  //
  // For PR A, nextSplitAfterSplit = 300 (PR B's split > 200+2).
  // Since mergeX (250) < nextSplitAfterSplit - 2 (298), the else branch runs:
  //   max(min(max(250, 200+80=280), 300-6=294), 200+8=208)
  // = max(min(280, 294), 208)
  // = max(280, 208)
  // = 280.
  //
  // PR B is unmerged, so its visualMergeX is null.
  it('applies cap when mergeX < nextSplitAfterSplit - 2', () => {
    const jan1 = new Date('2024-01-01T00:00:00Z');
    const feb10 = new Date('2024-02-10T00:00:00Z');
    const feb27 = new Date('2024-02-27T00:00:00Z');
    const toX = makeToXStub([
      [jan1, 200],
      [feb10, 250],
      [feb27, 300],
    ]);
    const projects: BlitzyProject[] = [
      makeProject({ createdAt: jan1, mergedAt: feb10, prState: 'merged' }),
      makeProject({ createdAt: feb27, mergedAt: null, prState: 'open' }),
    ];

    const result = visualMergeXs(projects, toX);

    expect(result[0]).toBe(280);
    expect(result[1]).toBeNull();
  });

  // Case (b) — NO Cap (`mergeX ≥ nextSplitAfterSplit − 2`) — Rule 5 (AAP 0.8.5)
  //
  // PR A: created Jan 1 (splitX=200), merged Apr 17 (mergeX=400).
  // PR B: created Feb 27 (splitX=300), never merged.
  //
  // For PR A, nextSplitAfterSplit = 300.
  // Since mergeX (400) >= nextSplitAfterSplit - 2 (298), the if branch runs:
  //   max(mergeX, splitX + 8)
  // = max(400, 208)
  // = 400 (UNCAPPED).
  //
  // This is the single strongest guard for Rule 5: a PR merged after a later
  // PR's open date plots to the right of that PR's split x. A broken
  // implementation that accidentally caps both branches would return 294,
  // failing this assertion.
  it('does NOT apply cap when mergeX >= nextSplitAfterSplit - 2 (Rule 5)', () => {
    const jan1 = new Date('2024-01-01T00:00:00Z');
    const feb27 = new Date('2024-02-27T00:00:00Z');
    const apr17 = new Date('2024-04-17T00:00:00Z');
    const toX = makeToXStub([
      [jan1, 200],
      [feb27, 300],
      [apr17, 400],
    ]);
    const projects: BlitzyProject[] = [
      makeProject({ createdAt: jan1, mergedAt: apr17, prState: 'merged' }),
      makeProject({ createdAt: feb27, mergedAt: null, prState: 'open' }),
    ];

    const result = visualMergeXs(projects, toX);

    expect(result[0]).toBe(400);
    expect(result[1]).toBeNull();
  });

  // Case (c) — Single PR (`nextSplitAfterSplit` defaults to `TIMELINE_END=696`)
  //
  // PR: created Jan 1 (splitX=200), merged Jan 15 (mergeX=220).
  // Only one project, so nextSplitAfterSplit falls through to TIMELINE_END=696.
  //
  // Since mergeX (220) < nextSplitAfterSplit - 2 (694), the else branch runs:
  //   max(min(max(220, 200+80=280), 696-6=690), 200+8=208)
  // = max(min(280, 690), 208)
  // = max(280, 208)
  // = 280.
  it('uses TIMELINE_END fallback when only one PR exists', () => {
    const jan1 = new Date('2024-01-01T00:00:00Z');
    const jan15 = new Date('2024-01-15T00:00:00Z');
    const toX = makeToXStub([
      [jan1, 200],
      [jan15, 220],
    ]);
    const projects: BlitzyProject[] = [
      makeProject({ createdAt: jan1, mergedAt: jan15, prState: 'merged' }),
    ];

    const result = visualMergeXs(projects, toX);

    expect(result[0]).toBeGreaterThanOrEqual(208);
    expect(result[0]).toBe(280);
  });

  // Case (d) — Unmerged PR
  //
  // PR: created Jan 1, mergedAt=null. Because the PR has not been merged,
  // visualMergeXs short-circuits with `null` for that index before any
  // arithmetic runs.
  it('returns null for unmerged PRs', () => {
    const jan1 = new Date('2024-01-01T00:00:00Z');
    const toX = makeToXStub([[jan1, 200]]);
    const projects: BlitzyProject[] = [
      makeProject({ createdAt: jan1, mergedAt: null, prState: 'open' }),
    ];

    const result = visualMergeXs(projects, toX);

    expect(result[0]).toBeNull();
  });
});
