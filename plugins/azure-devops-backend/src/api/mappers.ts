/*
 * Copyright 2023 The Backstage Authors
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
  RepoBuild,
  BuildStatus,
  BuildResult,
  GitTag,
  PullRequest,
  BuildRun,
} from '@backstage/plugin-azure-devops-common';
import { Build } from 'azure-devops-node-api/interfaces/BuildInterfaces';
import {
  GitRef,
  GitPullRequest,
} from 'azure-devops-node-api/interfaces/GitInterfaces';

export function mappedRepoBuild(build: Build): RepoBuild {
  return {
    id: build.id,
    title: [build.definition?.name, build.buildNumber]
      .filter(Boolean)
      .join(' - '),
    link: build._links?.web.href ?? '',
    status: build.status ?? BuildStatus.None,
    result: build.result ?? BuildResult.None,
    queueTime: build.queueTime?.toISOString(),
    startTime: build.startTime?.toISOString(),
    finishTime: build.finishTime?.toISOString(),
    source: `${build.sourceBranch} (${build.sourceVersion?.slice(0, 8)})`,
    uniqueName: build.requestedFor?.uniqueName ?? 'N/A',
  };
}

export function mappedGitTag(
  gitRef: GitRef,
  linkBaseUrl: string,
  commitBaseUrl: string,
): GitTag {
  return {
    objectId: gitRef.objectId,
    peeledObjectId: gitRef.peeledObjectId,
    name: gitRef.name?.replace('refs/tags/', ''),
    createdBy: gitRef.creator?.displayName ?? 'N/A',
    link: `${linkBaseUrl}${encodeURIComponent(
      gitRef.name?.replace('refs/tags/', '') ?? '',
    )}`,
    commitLink: `${commitBaseUrl}/${encodeURIComponent(
      gitRef.peeledObjectId ?? '',
    )}`,
  };
}

export function mappedPullRequest(
  pullRequest: GitPullRequest,
  linkBaseUrl: string,
): PullRequest {
  return {
    pullRequestId: pullRequest.pullRequestId,
    repoName: pullRequest.repository?.name,
    title: pullRequest.title,
    uniqueName: pullRequest.createdBy?.uniqueName ?? 'N/A',
    createdBy: pullRequest.createdBy?.displayName ?? 'N/A',
    creationDate: pullRequest.creationDate?.toISOString(),
    sourceRefName: pullRequest.sourceRefName,
    targetRefName: pullRequest.targetRefName,
    status: pullRequest.status,
    isDraft: pullRequest.isDraft,
    link: `${linkBaseUrl}/${pullRequest.pullRequestId}`,
  };
}

export function mappedBuildRun(build: Build): BuildRun {
  return {
    id: build.id,
    title: [build.definition?.name, build.buildNumber]
      .filter(Boolean)
      .join(' - '),
    link: build._links?.web.href ?? '',
    status: build.status ?? BuildStatus.None,
    result: build.result ?? BuildResult.None,
    queueTime: build.queueTime?.toISOString(),
    startTime: build.startTime?.toISOString(),
    finishTime: build.finishTime?.toISOString(),
    source: `${build.sourceBranch} (${build.sourceVersion?.slice(0, 8)})`,
    uniqueName: build.requestedFor?.uniqueName ?? 'N/A',
  };
}
