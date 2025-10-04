/*
 * Copyright 2025 The Backstage Authors
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
import { IGitApi } from 'azure-devops-node-api/GitApi';
import {
  GitChange,
  GitRepository,
  ItemContentType,
  VersionControlChangeType,
} from 'azure-devops-node-api/interfaces/GitInterfaces';
import { LoggerService } from '@backstage/backend-plugin-api';
import path from 'path';

export async function getLatestCommit(
  gitApi: IGitApi,
  repo: string,
  project: string,
  branch: string,
): Promise<string> {
  const branchRef = await gitApi.getBranch(repo, branch, project);
  if (!branchRef || !branchRef.commit || !branchRef.commit.commitId) {
    throw new Error(`Branch ${branch} not found in repository ${repo}.`);
  }
  return branchRef.commit.commitId;
}

export async function resolveTargetBranch(
  targetBranchName: string | undefined,
  repository: GitRepository,
  repo: string,
  logger: LoggerService,
): Promise<string> {
  if (targetBranchName) {
    return targetBranchName;
  }
  if (!repository.defaultBranch) {
    throw new Error(
      `No target branch specified, and the repository ${repo} does not have a default branch.`,
    );
  }
  const defaultBranch = repository.defaultBranch.replace('refs/heads/', '');
  logger.info(
    `No target branch specified. Using the default branch: ${defaultBranch}.`,
  );
  return defaultBranch;
}

export async function createSourceBranchIfNotExists(
  gitApi: IGitApi,
  repo: string,
  sourceBranchName: string,
  project: string,
  logger: LoggerService,
  resolvedTargetBranchName: string,
  repositoryId: string,
): Promise<boolean> {
  try {
    await gitApi.getBranch(repo, sourceBranchName, project);
    logger.info(
      `Source branch ${sourceBranchName} already exists. Skipping branch creation.`,
    );
    return false;
  } catch (error) {
    logger.info(
      `Source branch ${sourceBranchName} does not exist. Creating...`,
    );
    const refUpdate = {
      name: `refs/heads/${sourceBranchName}`,
      oldObjectId: '0000000000000000000000000000000000000000',
      newObjectId: await getLatestCommit(
        gitApi,
        repo,
        project,
        resolvedTargetBranchName,
      ),
    };
    await gitApi.updateRefs([refUpdate], repositoryId, project);
    logger.info(`Source branch ${sourceBranchName} created successfully.`);
    return true;
  }
}

export function getAzureRemotePullRequestUrl(
  host: string,
  organization: string,
  project: string,
  repo: string,
  pullRequestId: number,
) {
  return `https://${host}/${organization}/${project}/${repo}/pullrequest/${pullRequestId}`;
}

export function generateGitChanges(
  directoryContents: any[],
  fileRoot: string,
  targetPath?: string,
  filesToDelete?: string[],
): GitChange[] {
  const changes = directoryContents.map(file => {
    const relativePath = path.isAbsolute(file.path)
      ? path.relative(fileRoot, file.path)
      : file.path;
    const fullPath = path.posix.join('/', targetPath ?? '', relativePath);
    return {
      changeType: VersionControlChangeType.Add,
      item: {
        path: fullPath,
      },
      newContent: {
        content: file.content.toString('base64'),
        contentType: ItemContentType.Base64Encoded,
      },
    };
  });

  if (filesToDelete) {
    changes.push(
      ...filesToDelete.map(file => ({
        changeType: VersionControlChangeType.Delete,
        item: {
          path: path.posix.join('/', targetPath ?? '', file),
        },
        newContent: { content: '', contentType: ItemContentType.RawText },
      })),
    );
  }

  return changes.filter(
    change =>
      (change.newContent && change.newContent.content) ||
      change.changeType === VersionControlChangeType.Delete,
  );
}
