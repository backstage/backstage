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

const CANONICAL_BACKSTAGE_REPOSITORY = 'backstage/backstage';
const STABLE_TAG_PATTERN = /^v(\d+\.\d+\.\d+)$/;
const MAX_TAG_PAGES = 5;
const TAGS_PER_PAGE = 100;

function isCanonicalBackstageRepository(
  repository: RepositoryLocation,
): boolean {
  return (
    `${repository.owner}/${repository.repository}`.toLowerCase() ===
    CANONICAL_BACKSTAGE_REPOSITORY
  );
}

const PLUGIN_PACKAGE_NAME_PREFIX = '@backstage/plugin-';
const PACKAGE_ROLE_SUFFIXES = ['backend', 'common', 'node', 'react'] as const;

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// backstage/backstage keeps every plugin's packages flat under `plugins/`
// instead of grouping them into a per-plugin workspace (unlike
// backstage/community-plugins). Package names follow a stable
// `<slug>[-backend|-common|-node|-react]` or `<slug>-backend-module-<x>`
// convention, which lets us reconstruct the plugin's package family from
// directory names alone.
function deriveSlug(name: string): string {
  const backendModuleMatch = /^(.+)-backend-module-.+$/.exec(name);
  if (backendModuleMatch) {
    return backendModuleMatch[1];
  }
  const moduleMatch = /^(.+)-module-.+$/.exec(name);
  if (moduleMatch) {
    return moduleMatch[1];
  }
  for (const suffix of PACKAGE_ROLE_SUFFIXES) {
    const withDash = `-${suffix}`;
    if (name.endsWith(withDash) && name.length > withDash.length) {
      return name.slice(0, -withDash.length);
    }
  }
  return name;
}

function deriveFunctionality(slug: string, name: string): string {
  if (name === slug) {
    return 'frontend';
  }

  const escapedSlug = escapeRegExp(slug);
  if (new RegExp(`^${escapedSlug}-backend-module-.+$`).test(name)) {
    return 'backend-module';
  }
  if (new RegExp(`^${escapedSlug}-module-.+$`).test(name)) {
    return 'module';
  }
  for (const suffix of PACKAGE_ROLE_SUFFIXES) {
    if (name === `${slug}-${suffix}`) {
      return suffix;
    }
  }
  return name;
}

export interface CanonicalPackage {
  functionality: string;
  npmPackageName: string;
  sourcePath: string;
}

export function selectCanonicalPackages(
  treePaths: readonly string[],
  packageDirectory: string,
): CanonicalPackage[] {
  const segments = packageDirectory.split('/').filter(Boolean);
  if (segments.length === 0 || segments[0] !== 'plugins') {
    return [];
  }

  const name0 = segments[segments.length - 1];
  const slug = deriveSlug(name0);
  const prefix = 'plugins/';
  const suffix = '/package.json';

  const packages: CanonicalPackage[] = [];
  for (const path of treePaths) {
    if (!path.startsWith(prefix) || !path.endsWith(suffix)) {
      continue;
    }

    const remainder = path.slice(prefix.length, -suffix.length);
    if (remainder.includes('/') || deriveSlug(remainder) !== slug) {
      continue;
    }

    packages.push({
      functionality: deriveFunctionality(slug, remainder),
      npmPackageName: `${PLUGIN_PACKAGE_NAME_PREFIX}${remainder}`,
      sourcePath: path,
    });
  }

  packages.sort((a, b) => {
    if (a.functionality === 'frontend') {
      return -1;
    }
    if (b.functionality === 'frontend') {
      return 1;
    }
    return a.sourcePath.localeCompare(b.sourcePath);
  });
  return packages;
}

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

  return segments
    .filter(segment => segment !== '' && segment !== '.')
    .join('/');
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
  private readonly latestStableTagPromises = new Map<
    string,
    Promise<string | undefined>
  >();

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

    if (isCanonicalBackstageRepository(repository)) {
      return this.fetchCanonicalBackstageSnapshot(
        repository,
        lastAttemptAt,
        packageDirectory,
      );
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

  private async fetchCanonicalBackstageSnapshot(
    repository: RepositoryLocation,
    lastAttemptAt: string,
    packageDirectory: string,
  ): Promise<BackstageSnapshot> {
    let tagName: string | undefined;
    try {
      tagName = await this.getLatestStableTag(repository);
    } catch {
      return unavailable(lastAttemptAt, 'github-invalid-response');
    }
    if (!tagName) {
      return unavailable(lastAttemptAt, 'backstage-tag-not-found');
    }

    const sourcePath = packageDirectory
      ? `${packageDirectory}/package.json`
      : 'package.json';

    let treePaths: readonly string[];
    try {
      treePaths = await this.getTreePaths(repository, tagName);
    } catch {
      return unavailable(lastAttemptAt, 'github-invalid-response');
    }
    if (!treePaths.includes(sourcePath)) {
      return unavailable(lastAttemptAt, 'backstage-tag-not-found');
    }

    return {
      status: 'fresh',
      lastAttemptAt,
      checkedAt: lastAttemptAt,
      version: tagName.slice(1),
      sourceUrl: `https://github.com/${encodeURIComponent(
        repository.owner,
      )}/${encodeURIComponent(
        repository.repository,
      )}/releases/tag/${encodeURIComponent(tagName)}`,
      sourcePath,
    };
  }

  /**
   * Returns the newest stable (non-prerelease) Backstage release version,
   * e.g. "1.53.1". The root package.json can't be used for this since it
   * tracks the next unreleased minor.
   */
  async fetchLatestBackstageVersion(): Promise<string | undefined> {
    const tagName = await this.getLatestStableTag({
      owner: 'backstage',
      repository: 'backstage',
    });
    return tagName?.slice(1);
  }

  /**
   * Discovers the full family of related npm packages for a plugin hosted in
   * backstage/backstage (frontend, backend, common, node, backend modules,
   * ...). Returns undefined for any other repository, or when the plugin's
   * package family can't be resolved.
   */
  async discoverCanonicalPackages(
    repository: RepositoryLocation,
  ): Promise<CanonicalPackage[] | undefined> {
    if (!isCanonicalBackstageRepository(repository)) {
      return undefined;
    }

    const packageDirectory = normalizePackageDirectory(repository.directory);
    if (!packageDirectory) {
      return undefined;
    }

    let tagName: string | undefined;
    try {
      tagName = await this.getLatestStableTag(repository);
    } catch {
      return undefined;
    }
    if (!tagName) {
      return undefined;
    }

    let treePaths: readonly string[];
    try {
      treePaths = await this.getTreePaths(repository, tagName);
    } catch {
      return undefined;
    }

    return selectCanonicalPackages(treePaths, packageDirectory);
  }

  private getLatestStableTag(
    repository: RepositoryLocation,
  ): Promise<string | undefined> {
    const key = this.repositoryKey(repository);
    let promise = this.latestStableTagPromises.get(key);
    if (!promise) {
      promise = this.loadLatestStableTag(repository);
      this.latestStableTagPromises.set(key, promise);
    }
    return promise;
  }

  private async loadLatestStableTag(
    repository: RepositoryLocation,
  ): Promise<string | undefined> {
    const baseUrl = this.repositoryApiUrl(repository);
    for (let page = 1; page <= MAX_TAG_PAGES; page += 1) {
      const response = await this.request(
        `${baseUrl}/tags?per_page=${TAGS_PER_PAGE}&page=${page}`,
      );
      if (!response.ok) {
        throw new Error(`GitHub tags request failed: ${response.status}`);
      }

      const body: unknown = await response.json();
      if (!Array.isArray(body)) {
        throw new Error('GitHub tags response is not an array');
      }

      for (const entry of body) {
        if (isRecord(entry) && typeof entry.name === 'string') {
          if (STABLE_TAG_PATTERN.test(entry.name)) {
            return entry.name;
          }
        }
      }

      if (body.length < TAGS_PER_PAGE) {
        break;
      }
    }
    return undefined;
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
    if (
      !isRecord(body) ||
      !Array.isArray(body.tree) ||
      body.truncated === true
    ) {
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
