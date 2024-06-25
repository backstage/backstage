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

export interface AzurePrOptions {
  tenantUrl: string;
  title: string;
  project: string;
  branchName: string;
  repository: string;
  token: string;
  fileContent: string;
  fileName: string;
  description: string;
}

export interface CreateAzurePr {
  sourceRefName: string;
  targetRefName: string;
  title: string;
  description: string;
}

export interface AzureRepo {
  id: string;
  name: string;
  defaultBranch: string;
}

export interface AzureRef {
  name: string;
  objectId: string;
}

interface RefQueryResult {
  value: AzureRef[];
}

export interface AzureCommit {
  comment: string;

  changes: {
    changeType: string;
    item: {
      path: string;
    };
    newContent: {
      content: string;
      contentType: 'rawtext';
    };
  }[];
}

export interface AzureRefUpdate {
  repositoryId: string;
  name: string;
  oldObjectId: string;
  newObjectId: string;
}

export interface AzurePushResult {
  refUpdates: AzureRefUpdate[];
}

export interface AzurePush {
  refUpdates: {
    name: string;
    oldObjectId: string;
  }[];
  commits: AzureCommit[];
}

export interface AzurePrResult {
  pullRequestId: string;
  repository: {
    name: string;
    webUrl: string;
  };
}

const apiVersions = '6.0';

export interface RepoApiClientOptions {
  project: string;
  tenantUrl: string;
}

export interface NewBranchOptions {
  fileContent: string;
  fileName: string;
  title: string;
  branchName: string;
  repoName: string;
  sourceBranch: AzureRef;
}

export interface CreatePrOptions {
  repoName: string;
  sourceName: string;
  targetName: string;
  description: string;
  title: string;
}

export class RepoApiClient {
  private createEndpoint = (
    path: string,
    version: string,
    queryParams: Record<string, string> | undefined = undefined,
  ) => {
    const url = new URL(
      `${this._options.tenantUrl}/${this._options.project}/_apis/git/repositories`,
    );
    url.pathname += path;

    url.searchParams.set('api-version', version);
    Object.entries(queryParams ?? {}).forEach(([key, value]) =>
      url.searchParams.set(key, value),
    );
    return url.toString();
  };

  constructor(private _options: RepoApiClientOptions) {}

  private async get<T>(
    path: string,
    version: string,
    queryParams: Record<string, string> | undefined = undefined,
    token: string,
  ): Promise<T> {
    const endpoint = this.createEndpoint(path, version, queryParams);
    const result = await fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!result.ok) {
      return result.json().then(it => Promise.reject(new Error(it.message)));
    }
    return await result.json();
  }

  private async post<T>(
    path: string,
    version: string,
    payload: unknown,
    token: string,
  ): Promise<T> {
    const endpoint = this.createEndpoint(path, version);
    const result = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    if (!result.ok) {
      return result.json().then(it => Promise.reject(new Error(it.message)));
    }
    return await result.json();
  }

  async getRepository(
    repositoryName: string,
    token: string,
  ): Promise<AzureRepo> {
    return this.get(`/${repositoryName}`, apiVersions, undefined, token);
  }

  async getDefaultBranch(repo: AzureRepo, token: string): Promise<AzureRef> {
    const filter = repo.defaultBranch.replace('refs/', '');
    const result: RefQueryResult = await this.get(
      `/${repo.name}/refs`,
      apiVersions,
      { filter },
      token,
    );
    if (!result.value?.length) {
      return Promise.reject(
        new Error(`The requested ref '${filter}' was not found`),
      );
    }
    return result.value[0];
  }

  async pushNewBranch(
    options: NewBranchOptions,
    token: string,
  ): Promise<AzureRefUpdate> {
    const { sourceBranch, repoName } = options;
    const push: AzurePush = {
      refUpdates: [
        {
          name: `refs/heads/${options.branchName}`,
          oldObjectId: sourceBranch.objectId,
        },
      ],
      commits: [
        {
          comment: options.title,
          changes: [
            {
              changeType: 'add',
              item: {
                path: `/${options.fileName}`,
              },
              newContent: {
                content: options.fileContent,
                contentType: 'rawtext',
              },
            },
          ],
        },
      ],
    };
    const result = await this.post<AzurePushResult>(
      `/${repoName}/pushes`,
      apiVersions,
      push,
      token,
    );
    return result.refUpdates[0];
  }

  async createPullRequest(
    options: CreatePrOptions,
    token: string,
  ): Promise<AzurePrResult> {
    const { repoName, sourceName, targetName } = options;
    const payload: CreateAzurePr = {
      title: options.title,
      description: options.description,
      sourceRefName: sourceName,
      targetRefName: targetName,
    };

    return await this.post<AzurePrResult>(
      `/${repoName}/pullrequests`,
      apiVersions,
      payload,
      token,
    );
  }
}

export async function createAzurePullRequest(
  options: AzurePrOptions,
  client: RepoApiClient | undefined = undefined,
): Promise<AzurePrResult> {
  const {
    title,
    repository,
    token,
    fileContent,
    fileName,
    branchName,
    description,
  } = options;
  const actualClient = client ?? new RepoApiClient(options);
  const repo = await actualClient.getRepository(repository, token);
  const defaultBranch = await actualClient.getDefaultBranch(repo, token);
  const branchOptions: NewBranchOptions = {
    title: title,
    repoName: repo.name,
    sourceBranch: defaultBranch,
    branchName: branchName,
    fileContent: fileContent,
    fileName: fileName,
  };
  const refUpdate = await actualClient.pushNewBranch(branchOptions, token);
  const prOptions: CreatePrOptions = {
    title,
    description,
    repoName: repo.name,
    sourceName: refUpdate.name,
    targetName: defaultBranch.name,
  };
  return actualClient.createPullRequest(prOptions, token);
}
