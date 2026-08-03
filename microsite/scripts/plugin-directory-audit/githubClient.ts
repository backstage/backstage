/*
 * Copyright 2026 The Backstage Authors
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
import type { BackstageSnapshot } from '../../src/pluginDirectory/manifest';

export interface RepositoryLocation {
  owner: string;
  repository: string;
  directory?: string;
}

interface RepositoryMetadata {
  defaultBranch: string;
}

type UnavailableReason = Extract<
  BackstageSnapshot,
  { status: 'unavailable' }
>['reason'];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function encodePath(path: string): string {
  return path.split('/').map(encodeURIComponent).join('/');
}

function normalizePackageDirectory(directory?: string): string | null {
  if (directory === undefined) {
    return '';
  }
  if (directory.startsWith('/')) {
    return null;
  }

  const withoutLeadingDots = directory.replace(/^(?:\.\/)+/, '');
  const segments = withoutLeadingDots.split('/');
  if (segments.includes('..')) {
    return null;
  }

  return segments.filter(segment => segment !== '' && segment !== '.').join('/');
}

export function selectBackstageJsonPath(
  treePaths: readonly string[],
  packageDirectory?: string,
): string | undefined {
  const rootPath = treePaths.includes('backstage.json')
    ? 'backstage.json'
    : undefined;
  if (!packageDirectory) {
    return rootPath;
  }

  let nearestPath: string | undefined;
  let nearestDirectoryLength = -1;
  for (const path of treePaths) {
    if (!path.endsWith('/backstage.json')) {
      continue;
    }

    const directory = path.slice(0, -'/backstage.json'.length);
    if (
      (packageDirectory === directory ||
        packageDirectory.startsWith(`${directory}/`)) &&
      directory.length > nearestDirectoryLength
    ) {
      nearestPath = path;
      nearestDirectoryLength = directory.length;
    }
  }

  return nearestPath ?? rootPath;
}

function unavailable(
  lastAttemptAt: string,
  reason: UnavailableReason,
): BackstageSnapshot {
  return { status: 'unavailable', lastAttemptAt, reason };
}

export class GitHubSnapshotClient {
  private readonly fetchImpl: typeof fetch;
  private readonly authorizationHeaders: Readonly<Record<string, string>>;
  private readonly repositoryPromises = new Map<
    string,
    Promise<RepositoryMetadata>
  >();
  private readonly treePromises = new Map<string, Promise<readonly string[]>>();

  constructor(options: { fetchImpl?: typeof fetch; token?: string } = {}) {
    this.fetchImpl = options.fetchImpl ?? fetch;
    this.authorizationHeaders = options.token
      ? { Authorization: `Bearer ${options.token}` }
      : {};
  }

  async fetchBackstageSnapshot(
    repository: RepositoryLocation,
  ): Promise<BackstageSnapshot> {
    const lastAttemptAt = new Date().toISOString();
    const packageDirectory = normalizePackageDirectory(repository.directory);
    if (packageDirectory === null) {
      return unavailable(lastAttemptAt, 'repository-directory-invalid');
    }

    let metadata: RepositoryMetadata;
    let treePaths: readonly string[];
    try {
      metadata = await this.getRepositoryMetadata(repository);
      treePaths = await this.getTreePaths(repository, metadata.defaultBranch);
    } catch {
      return unavailable(lastAttemptAt, 'github-invalid-response');
    }

    const sourcePath = selectBackstageJsonPath(
      treePaths,
      packageDirectory || undefined,
    );
    if (!sourcePath) {
      return unavailable(lastAttemptAt, 'backstage-json-not-found');
    }

    const baseUrl = this.repositoryApiUrl(repository);
    let response: Response;
    try {
      response = await this.request(
        `${baseUrl}/contents/${encodePath(sourcePath)}?ref=${encodeURIComponent(
          metadata.defaultBranch,
        )}`,
        'application/vnd.github.raw+json',
      );
    } catch {
      return unavailable(lastAttemptAt, 'github-invalid-response');
    }

    if (!response.ok) {
      return unavailable(lastAttemptAt, 'github-invalid-response');
    }

    let backstageJson: unknown;
    try {
      backstageJson = await response.json();
    } catch {
      return unavailable(lastAttemptAt, 'backstage-json-invalid');
    }
    if (
      !isRecord(backstageJson) ||
      typeof backstageJson.version !== 'string' ||
      backstageJson.version.length === 0
    ) {
      return unavailable(lastAttemptAt, 'backstage-json-invalid');
    }

    return {
      status: 'fresh',
      lastAttemptAt,
      checkedAt: lastAttemptAt,
      version: backstageJson.version,
      sourceUrl: `https://github.com/${encodeURIComponent(
        repository.owner,
      )}/${encodeURIComponent(repository.repository)}/blob/${encodeURIComponent(
        metadata.defaultBranch,
      )}/${encodePath(sourcePath)}`,
      sourcePath,
    };
  }

  private getRepositoryMetadata(
    repository: RepositoryLocation,
  ): Promise<RepositoryMetadata> {
    const key = this.repositoryKey(repository);
    let promise = this.repositoryPromises.get(key);
    if (!promise) {
      promise = this.loadRepositoryMetadata(repository);
      this.repositoryPromises.set(key, promise);
    }
    return promise;
  }

  private getTreePaths(
    repository: RepositoryLocation,
    defaultBranch: string,
  ): Promise<readonly string[]> {
    const key = this.repositoryKey(repository);
    let promise = this.treePromises.get(key);
    if (!promise) {
      promise = this.loadTreePaths(repository, defaultBranch);
      this.treePromises.set(key, promise);
    }
    return promise;
  }

  private async loadRepositoryMetadata(
    repository: RepositoryLocation,
  ): Promise<RepositoryMetadata> {
    const response = await this.request(this.repositoryApiUrl(repository));
    if (!response.ok) {
      throw new Error(`GitHub repository request failed: ${response.status}`);
    }

    const body: unknown = await response.json();
    if (
      !isRecord(body) ||
      typeof body.default_branch !== 'string' ||
      body.default_branch.length === 0
    ) {
      throw new Error('GitHub repository response has no default branch');
    }

    return { defaultBranch: body.default_branch };
  }

  private async loadTreePaths(
    repository: RepositoryLocation,
    defaultBranch: string,
  ): Promise<readonly string[]> {
    const response = await this.request(
      `${this.repositoryApiUrl(repository)}/git/trees/${encodeURIComponent(
        defaultBranch,
      )}?recursive=1`,
    );
    if (!response.ok) {
      throw new Error(`GitHub tree request failed: ${response.status}`);
    }

    const body: unknown = await response.json();
    if (!isRecord(body) || !Array.isArray(body.tree) || body.truncated === true) {
      throw new Error('GitHub tree response is incomplete');
    }

    const paths: string[] = [];
    for (const entry of body.tree) {
      if (
        isRecord(entry) &&
        entry.type === 'blob' &&
        typeof entry.path === 'string'
      ) {
        paths.push(entry.path);
      }
    }
    return paths;
  }

  private request(
    url: string,
    accept = 'application/vnd.github+json',
  ): Promise<Response> {
    return this.fetchImpl(url, {
      headers: {
        Accept: accept,
        'X-GitHub-Api-Version': '2022-11-28',
        ...this.authorizationHeaders,
      },
    });
  }

  private repositoryApiUrl(repository: RepositoryLocation): string {
    return `https://api.github.com/repos/${encodeURIComponent(
      repository.owner,
    )}/${encodeURIComponent(repository.repository)}`;
  }

  private repositoryKey(repository: RepositoryLocation): string {
    return `${repository.owner}/${repository.repository}`;
  }
}
