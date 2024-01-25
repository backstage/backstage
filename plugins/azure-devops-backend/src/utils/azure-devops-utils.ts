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
  CreatedBy,
  DashboardPullRequest,
  Policy,
  PolicyEvaluationStatus,
  PolicyType,
  PolicyTypeId,
  PullRequestVoteStatus,
  Repository,
  Reviewer,
} from '@backstage/plugin-azure-devops-common';
import {
  GitPullRequest,
  GitRepository,
  IdentityRefWithVote,
} from 'azure-devops-node-api/interfaces/GitInterfaces';
import mime from 'mime-types';

import { IdentityRef } from 'azure-devops-node-api/interfaces/common/VSSInterfaces';
import { PolicyEvaluationRecord } from 'azure-devops-node-api/interfaces/PolicyInterfaces';
import { UrlReader } from '@backstage/backend-common';

export function convertDashboardPullRequest(
  pullRequest: GitPullRequest,
  baseUrl: string,
  policies: Policy[] | undefined,
): DashboardPullRequest {
  return {
    pullRequestId: pullRequest.pullRequestId,
    title: pullRequest.title,
    description: pullRequest.description,
    repository: convertRepository(pullRequest.repository),
    createdBy: convertCreatedBy(pullRequest.createdBy),
    hasAutoComplete: hasAutoComplete(pullRequest),
    policies,
    reviewers: convertReviewers(pullRequest.reviewers),
    creationDate: pullRequest.creationDate?.toISOString(),
    status: pullRequest.status,
    isDraft: pullRequest.isDraft,
    link: getPullRequestLink(baseUrl, pullRequest),
  };
}

export function getPullRequestLink(
  baseUrl: string,
  pullRequest: GitPullRequest,
): string | undefined {
  const projectName = pullRequest.repository?.project?.name;
  const repoName = pullRequest.repository?.name;
  const pullRequestId = pullRequest.pullRequestId;

  if (!projectName || !repoName || !pullRequestId) {
    return undefined;
  }

  const encodedProjectName = encodeURIComponent(projectName);
  const encodedRepoName = encodeURIComponent(repoName);

  return `${baseUrl}/${encodedProjectName}/_git/${encodedRepoName}/pullrequest/${pullRequestId}`;
}

/**
 * Tries to get the avatar from the new property if not then falls-back to deprecated `imageUrl`.
 * https://docs.microsoft.com/en-us/rest/api/azure/devops/git/pull-requests/get-pull-requests-by-project?view=azure-devops-rest-6.0#identityref
 */
export function getAvatarUrl(identity: IdentityRef): string | undefined {
  return identity._links?.avatar?.href ?? identity.imageUrl;
}

export function getArtifactId(
  projectId: string,
  pullRequestId: number,
): string {
  return `vstfs:///CodeReview/CodeReviewId/${projectId}/${pullRequestId}`;
}

export function convertPolicy(
  policyEvaluationRecord: PolicyEvaluationRecord,
): Policy | undefined {
  const policyConfig = policyEvaluationRecord.configuration;
  const policyStatus = policyEvaluationRecord.status;

  if (!policyConfig) {
    return undefined;
  }

  if (
    !(
      policyConfig.isEnabled &&
      !policyConfig.isDeleted &&
      (policyConfig.isBlocking ||
        policyConfig.type?.id === PolicyType.Status) && // Optional "Status" policies are actually required for automatic completion.
      policyStatus !== PolicyEvaluationStatus.Approved
    )
  ) {
    return undefined;
  }

  const policyTypeId = policyConfig.type?.id;

  if (!policyTypeId) {
    return undefined;
  }

  const policyType: PolicyType | undefined = (
    {
      [PolicyTypeId.Build]: PolicyType.Build,
      [PolicyTypeId.Status]: PolicyType.Status,
      [PolicyTypeId.MinimumReviewers]: PolicyType.MinimumReviewers,
      [PolicyTypeId.Comments]: PolicyType.Comments,
      [PolicyTypeId.RequiredReviewers]: PolicyType.RequiredReviewers,
      [PolicyTypeId.MergeStrategy]: PolicyType.MergeStrategy,
    } as Record<string, PolicyType | undefined>
  )[policyTypeId];

  if (!policyType) {
    return undefined;
  }

  const policyConfigSettings = policyConfig.settings;
  let policyText = policyConfig.type?.displayName;
  let policyLink: string | undefined;

  switch (policyType) {
    case PolicyType.Build: {
      const buildDisplayName = policyConfigSettings.displayName;

      if (buildDisplayName) {
        policyText += `: ${buildDisplayName}`;
      }

      const buildId = policyEvaluationRecord.context?.buildId;
      const policyConfigUrl = policyConfig.url;

      if (buildId && policyConfigUrl) {
        policyLink = policyConfigUrl.replace(
          `_apis/policy/configurations/${policyConfig.id}`,
          `_build/results?buildId=${buildId}`,
        );
      }

      if (!policyStatus) {
        break;
      }

      const buildExpired = Boolean(policyConfigSettings.isExpired);
      const buildPolicyStatus =
        (
          {
            [PolicyEvaluationStatus.Queued]: buildExpired
              ? 'expired'
              : 'queued',
            [PolicyEvaluationStatus.Rejected]: 'failed',
          } as Record<PolicyEvaluationStatus, string | undefined>
        )[policyStatus] ?? PolicyEvaluationStatus[policyStatus].toLowerCase();

      policyText += ` (${buildPolicyStatus})`;

      break;
    }
    case PolicyType.Status: {
      const statusGenre = policyConfigSettings.statusGenre;
      const statusName = policyConfigSettings.statusGenre;

      if (statusName) {
        policyText += `: ${statusGenre}/${statusName}`;
      }

      break;
    }
    case PolicyType.MinimumReviewers: {
      const minimumApproverCount = policyConfigSettings.minimumApproverCount;
      policyText += ` (${minimumApproverCount})`;
      break;
    }
    case PolicyType.Comments:
      break;
    case PolicyType.RequiredReviewers:
      break;
    case PolicyType.MergeStrategy:
    default:
      return undefined;
  }

  return {
    id: policyConfig.id,
    type: policyType,
    status: policyStatus,
    text: policyText,
    link: policyLink,
  };
}

export async function replaceReadme(
  urlReader: UrlReader,
  host: string,
  org: string,
  project: string,
  repo: string,
  readmeContent: string,
) {
  const filesPath = extractAssets(readmeContent);
  if (!filesPath) return readmeContent;
  return await filesPath.reduce(
    async (promise: Promise<string>, filePath: string) =>
      promise.then(async content => {
        const { label, path, ext } = extractPartsFromAsset(filePath);
        const data = mime.lookup(ext);
        const url = buildEncodedUrl(host, org, project, repo, path + ext);
        const response = await urlReader.readUrl(url);
        const buffer = await response.buffer();
        const file = buffer.toString('base64');
        return content.replace(
          filePath,
          `[${label}](data:${data};base64,${file})`,
        );
      }),
    Promise.resolve(readmeContent),
  );
}

export function buildEncodedUrl(
  host: string,
  org: string,
  project: string,
  repo: string,
  path: string,
): string {
  const encodedOrg = encodeURIComponent(org);
  const encodedProject = encodeURIComponent(project);
  const encodedRepo = encodeURIComponent(repo);
  const encodedPath = encodeURIComponent(path);
  return `https://${host}/${encodedOrg}/${encodedProject}/_git/${encodedRepo}?path=${encodedPath}`;
}

function convertReviewer(
  identityRef?: IdentityRefWithVote,
): Reviewer | undefined {
  if (!identityRef) {
    return undefined;
  }

  return {
    id: identityRef.id,
    displayName: identityRef.displayName,
    uniqueName: identityRef.uniqueName,
    imageUrl: getAvatarUrl(identityRef),
    isRequired: identityRef.isRequired,
    isContainer: identityRef.isContainer,
    voteStatus: (identityRef.vote ?? 0) as PullRequestVoteStatus,
  };
}

function convertReviewers(
  identityRefs?: IdentityRefWithVote[],
): Reviewer[] | undefined {
  if (!identityRefs) {
    return undefined;
  }

  return identityRefs
    .map(convertReviewer)
    .filter((reviewer): reviewer is Reviewer => Boolean(reviewer));
}

function convertRepository(repository?: GitRepository): Repository | undefined {
  if (!repository) {
    return undefined;
  }

  return {
    id: repository.id,
    name: repository.name,
    url: repository.url?.replace('_apis/git/repositories', '_git'),
  };
}

function convertCreatedBy(identityRef?: IdentityRef): CreatedBy | undefined {
  if (!identityRef) {
    return undefined;
  }

  return {
    id: identityRef.id,
    displayName: identityRef.displayName,
    uniqueName: identityRef.uniqueName,
    imageUrl: getAvatarUrl(identityRef),
  };
}

function hasAutoComplete(pullRequest: GitPullRequest): boolean {
  return pullRequest.isDraft !== true && !!pullRequest.completionOptions;
}

export function extractAssets(content: string) {
  const regExp =
    /\[([^\[\]]*)\]\((?!https?:\/\/)(.*?)(\.png|\.jpg|\.jpeg|\.gif|\.webp)(.*)\)/gim;
  return content.match(regExp);
}

export function extractPartsFromAsset(content: string): {
  label: string;
  path: string;
  ext: string;
} {
  const regExp =
    /\[(.*?)\]\((?!https?:\/\/)(.*?)(\.png|\.jpg|\.jpeg|\.gif|\.webp)(.*)\)/i;
  const [_, label, path, ext] = regExp.exec(content) || [];
  return {
    ext,
    label,
    path: path.startsWith('./') ? path.substring(1, path.length) : path,
  };
}

export function parseAzureDevOpsUrl(sourceUrl: string) {
  const url = new URL(sourceUrl);

  let host = url.host;
  let org;
  let project;
  let repo;

  const parts = url.pathname.split('/').map(part => decodeURIComponent(part));
  if (parts[2] === '_git') {
    org = parts[1];
    project = repo = parts[3];
  } else if (parts[3] === '_git') {
    org = parts[1];
    project = parts[2];
    repo = parts[4];
  } else if (parts[4] === '_git') {
    host = `${host}/${parts[1]}`;
    org = parts[2];
    project = parts[3];
    repo = parts[5];
  }

  return { host, org, project, repo };
}
