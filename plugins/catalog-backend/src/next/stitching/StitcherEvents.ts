/*
 * Copyright 2021 Spotify AB
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

export type StitchAbortedReason =
  /** The stitch attempt happened before the target entity even existed yet in the refresh state table; no stitching required. */
  | 'did-not-exist'
  /** The entity had no changes compared to its previous version, so there was no need to overwrite it. */
  | 'had-no-changes'
  /** A competing stitch attempt was started later than ours, so we'll yield and assume that their write has newer and better data. */
  | 'yielded-to-later-stitch-attempt';

export type StitcherEvents = {
  stitchStarted: {
    entityRef: string;
    jobId: string;
  };
  stitchCompleted: {
    entityRef: string;
    jobId: string;
    durationMs: number;
  };
  stitchAborted: {
    entityRef: string;
    jobId: string;
    reason: StitchAbortedReason;
  };
  stitchFailed: {
    entityRef: string;
    jobId: string;
    error: Error;
  };
};
