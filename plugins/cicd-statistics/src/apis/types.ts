/*
 * Copyright 2022 The Backstage Authors
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

import { Entity } from '@backstage/catalog-model';

/**
 * This is a generic enum of build statuses.
 *
 * If all of these aren't applicable to the underlying CI/CD, these can be
 * configured to be hidden, using the `availableStatuses` in `CicdConfiguration`.
 *
 * @public
 */
export type FilterStatusType =
  | 'unknown'
  | 'enqueued'
  | 'scheduled'
  | 'running'
  | 'aborted'
  | 'succeeded'
  | 'failed'
  | 'stalled'
  | 'expired';

/**
 * @public
 */
export const statusTypes: Array<FilterStatusType> = [
  'succeeded',
  'failed',
  'enqueued',
  'scheduled',
  'running',
  'aborted',
  'stalled',
  'expired',
  'unknown',
];

/**
 * The branch enum of either 'master' or 'branch' (or possibly the meta 'all').
 *
 * The concept of what constitutes a master branch is generic. It might be called
 * something like 'release' or 'main' or 'trunk' in the underlying CI/CD system,
 * which is then up to the Api to map accordingly.
 *
 * @public
 */
export type FilterBranchType = 'master' | 'branch';

/**
 * @public
 */
export type TriggerReason =
  /** Triggered by source code management, e.g. a Github hook */
  | 'scm'
  /** Triggered manually */
  | 'manual'
  /** Triggered internally (non-scm, or perhaps after being delayed/enqueued) */
  | 'internal'
  /** Triggered for some other reason */
  | 'other';

/**
 * @public
 */
export const triggerReasons: Array<TriggerReason> = [
  'scm',
  'manual',
  'internal',
  'other',
];

/**
 * A Stage is a part of either a Build or a parent Stage.
 *
 * This may be called things like Stage or Step or Task in CI/CD systems, but is
 * generic here. There's also no concept of parallelism which might exist within
 * some stages.
 *
 * @public
 */
export interface Stage {
  name: string;

  /** The status of the stage */
  status: FilterStatusType;

  /** Stage duration in milliseconds */
  duration: number;

  /** Sub stages within this stage */
  stages?: Array<Stage>;
}

/**
 * Generic Build type.
 *
 * A build has e.g. a build type (master/branch), a status and (possibly) sub stages.
 *
 * @public
 */
export interface Build {
  raw?: unknown;

  /** Build id */
  id: string;

  /** The reason this build was started */
  triggeredBy?: TriggerReason;

  /** The status of the build */
  status: FilterStatusType;

  /** Branch type */
  branchType: FilterBranchType;

  /** Time when the build started */
  requestedAt: Date;

  /** The overall duration of the build */
  duration: number;

  /** Top-level build stages */
  stages: Array<Stage>;
}

/**
 * Helper type which is a Build with a certain typed 'raw' field.
 *
 * This can be useful in an Api to use while mapping internal data structures
 * (raw) into generic builds.
 *
 * @public
 */
export type BuildWithRaw<T = any> = Build & {
  raw: T;
};

/**
 * Chart type.
 *
 * Values are:
 *  * `duration`: shows an area chart of the duration over time
 *  * `count`: shows a bar chart of the number of build per day
 *
 * @public
 */
export type ChartType = 'duration' | 'count';

/**
 * Chart types.
 *
 * @public
 */
export type ChartTypes = Array<ChartType>;

/**
 * Default settings for the fetching options and view options.
 *
 * These are all optional, but can be overridden from the Api to whatever makes
 * most sense for that implementation.
 *
 * @public
 */
export interface CicdDefaults {
  timeFrom: Date;
  timeTo: Date;
  filterStatus: Array<FilterStatusType>;
  filterType: FilterBranchType | 'all';

  /** Lower-case all stage names (to potentially merge stages with different cases) */
  lowercaseNames: boolean;
  /** Normalize the from-to date range in all charts */
  normalizeTimeRange: boolean;
  /** Default collapse the stages with a max-duration below this value */
  collapsedLimit: number;
  /** Default hide stages with a max-duration below this value */
  hideLimit: number;
  /** Chart types per status */
  chartTypes: Record<FilterStatusType, ChartTypes>;
}

/**
 * A configuration interface which the Api must implement.
 *
 * When the UI for the CI/CD Statistics is loaded, it begins with fetching the
 * configuration before anything else.
 *
 * All of these fields are optional though, and will fallback to hard-coded defaults.
 *
 * @public
 */
export interface CicdConfiguration {
  /**
   * This field can be used to override what statuses are available
   */
  availableStatuses: ReadonlyArray<FilterStatusType>;

  /**
   * When transposing the list of builds into a tree of stages, the stage names
   * will be transformed through this function.
   *
   * Override this for a custom implementation. The default will try to remove
   * parent names off of child names, if they are prepended by them.
   *
   * For example; if a stage has the name 'Install' and a child stage has the
   * name 'Install - Fetch dependencies', the child name will be replaced with
   * 'Fetch dependencies'.
   */
  formatStageName: (parentNames: Array<string>, stageName: string) => string;

  /**
   * Default options for the UI
   */
  defaults: Partial<CicdDefaults>;
}

/**
 * If the Api implements support for aborting the fetching of builds, throw an
 * AbortError of this type (or any other error with name === 'AbortError').
 *
 * @public
 */
export class AbortError extends Error {}

/**
 * The result type for `fetchBuilds`.
 *
 * @public
 */
export interface CicdState {
  builds: Array<Build>;
}

/**
 * When fetching, if applicable, the Api can feedback progress back to the UI.
 *
 * Use the `updateProgress(completed, total, started?)` to signal that
 * `completed` builds out of a `total` has finished. Optionally use the
 * `started` to signal how many builds have been started in total (i.e. at least
 * the amount of `completed`).
 *
 * This can be called at any rate. Rate limiting (debouncing) is implemented in
 * the UI.
 *
 * Optionally this can signal multiple progresses in several steps
 *
 * @public
 */
export interface UpdateProgress {
  (completed: number, total: number, started?: number): void;
  (
    steps: Array<{
      title: string;
      completed: number;
      total: number;
      started?: number;
    }>,
  ): void;
}

/**
 * When reading configuration, the Api can return a custom settings depending on
 * the entity being viewed.
 *
 * @public
 */
export interface GetConfigurationOptions {
  entity: Entity;
}

/**
 * When fetching, the Api should fetch build information about the `entity` and
 * respect the `timeFrom`, `timeTo`, `filterStatus` and `filterType`.
 *
 * Optionally implement support for `updateProgress` and `abortSignal` if
 * preferred.
 *
 * When the UI re-fetches, it will abort any previous fetching, so polling
 * `abortSignal.aborted`, and possibly throwing an `AbortError`, can be useful.
 *
 * @public
 */
export interface FetchBuildsOptions {
  entity: Entity;
  updateProgress: UpdateProgress;
  abortSignal: AbortSignal;
  timeFrom: Date;
  timeTo: Date;
  filterStatus: Array<FilterStatusType | 'all'>;
  filterType: FilterBranchType | 'all';
}

/**
 * The interface which is mapped to the `cicdStatisticsApiRef` which is used by
 * the UI.
 *
 * @public
 */
export interface CicdStatisticsApi {
  getConfiguration(
    options: GetConfigurationOptions,
  ): Promise<Partial<CicdConfiguration>>;
  fetchBuilds(options: FetchBuildsOptions): Promise<CicdState>;
}
