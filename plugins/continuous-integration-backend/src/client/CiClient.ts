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

import { Entity } from '@backstage/catalog-model';

export interface JenkinsBuild {
  timestamp: number;
  building: boolean;
  duration: number;
  result?: string;
  fullDisplayName: string;
  displayName: string;
  url: string;
  number: number;
}

export interface CircleCiBuild {
  outcome?: string;
  status?: string;
  build_num?: number;
  vcs_revision?: string;
  pushed_at?: string;
  is_workflow_job?: boolean;
  added_at?: string;
}

/** @public */
export type ActionsGetWorkflowResponseData = {
  id: string;
  status: string;
  createTime: string;
  startTime: string;
  timeout: string;
  projectId: string;
  logsBucket: string;
  buildTriggerId: string;
  logUrl: string;
  tags: string[];
  queueTtl: string;
  name: string;
  finishTime: any;
};

export type Status = 'Passed' | 'Failed';

export interface Build {
  /** Stuff to point back to your service with. */
  displayName: string;
  url: string;

  /** ISO timestamp */
  timestamp: string;
  /** Duration in ms */
  duration: number;

  source: {
    url: string;
    commit: {
      hash: string;
    };
    author: string;
  };

  status: Status;
}

export interface CiClient {
  /** This should return the last n builds that completed either with a failure or a success on a given branch. */
  getBuilds(branch: string, limit: number): Promise<Build[]>;

  matcher(entity: Entity): boolean;
}
