/*
 * Copyright 2021 The Backstage Authors
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

export enum BuildResult {
  /**
   * No result
   */
  None = 0,
  /**
   * The build completed successfully.
   */
  Succeeded = 2,
  /**
   * The build completed compilation successfully but had other errors.
   */
  PartiallySucceeded = 4,
  /**
   * The build completed unsuccessfully.
   */
  Failed = 8,
  /**
   * The build was canceled before starting.
   */
  Canceled = 32,
}

export enum BuildStatus {
  /**
   * No status.
   */
  None = 0,
  /**
   * The build is currently in progress.
   */
  InProgress = 1,
  /**
   * The build has completed.
   */
  Completed = 2,
  /**
   * The build is cancelling
   */
  Cancelling = 4,
  /**
   * The build is inactive in the queue.
   */
  Postponed = 8,
  /**
   * The build has not yet started.
   */
  NotStarted = 32,
  /**
   * All status.
   */
  All = 47,
}

export type RepoBuild = {
  id?: number;
  title: string;
  link?: string;
  status?: BuildStatus;
  result?: BuildResult;
  queueTime?: Date;
  startTime?: Date;
  finishTime?: Date;
  source: string;
  uniqueName?: string;
};
