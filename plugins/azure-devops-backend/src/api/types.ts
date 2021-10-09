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

import {
  BuildResult,
  BuildStatus,
} from 'azure-devops-node-api/interfaces/BuildInterfaces';
import { PullRequestStatus } from 'azure-devops-node-api/interfaces/GitInterfaces';

export type RepoBuild = {
  id?: number;
  title: string;
  link?: string;
  status?: BuildStatus;
  result?: BuildResult;
  queueTime?: Date;
  source: string;
};

export type PullRequest = {
  pullRequestId?: number;
  repoName?: string;
  title?: string;
  createdBy?: string;
  creationDate?: Date;
  sourceRefName?: string;
  targetRefName?: string;
  status?: PullRequestStatus;
  isDraft?: boolean;
  link: string;
};
