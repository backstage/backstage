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

const VERSION_PREFIX_GIT_BRANCH = 'GB';

export class AzureUrl {
  /**
   * Parses an azure URL as copied from the browser address bar.
   *
   * Throws an error if the URL is not a valid azure repo URL.
   */
  static fromRepoUrl(repoUrl: string): AzureUrl {
    const url = new URL(repoUrl);

    let owner;
    let project;
    let repo;

    const parts = url.pathname.split('/').map(part => decodeURIComponent(part));
    if (parts[2] === '_git') {
      owner = parts[1];
      project = repo = parts[3];
    } else if (parts[3] === '_git') {
      owner = parts[1];
      project = parts[2];
      repo = parts[4];
    } else if (parts[4] === '_git') {
      owner = `${parts[1]}/${parts[2]}`;
      project = parts[3];
      repo = parts[5];
    }

    if (!owner || !project || !repo) {
      throw new Error('Azure URL must point to a git repository');
    }

    const path = url.searchParams.get('path') ?? undefined;

    let ref;
    const version = url.searchParams.get('version');
    if (version) {
      const prefix = version.slice(0, 2);
      if (prefix !== 'GB') {
        throw new Error('Azure URL version must point to a git branch');
      }
      ref = version.slice(2);
    }

    return new AzureUrl(url.origin, owner, project, repo, path, ref);
  }

  #origin: string;
  #owner: string;
  #project: string;
  #repo: string;
  #path?: string;
  #ref?: string;

  private constructor(
    origin: string,
    owner: string,
    project: string,
    repo: string,
    path?: string,
    ref?: string,
  ) {
    this.#origin = origin;
    this.#owner = owner;
    this.#project = project;
    this.#repo = repo;
    this.#path = path;
    this.#ref = ref;
  }

  #baseUrl = (...parts: string[]): URL => {
    const url = new URL(this.#origin);
    url.pathname = parts.map(part => encodeURIComponent(part)).join('/');
    return url;
  };

  /**
   * Returns a repo URL that can be used to navigate to the resource in azure.
   *
   * Throws an error if the URL is not a valid azure repo URL.
   */
  toRepoUrl(): string {
    let url;
    if (this.#project === this.#repo) {
      url = this.#baseUrl(this.#owner, '_git', this.#repo);
    } else {
      url = this.#baseUrl(this.#owner, this.#project, '_git', this.#repo);
    }

    if (this.#path) {
      url.searchParams.set('path', this.#path);
    }
    if (this.#ref) {
      url.searchParams.set('version', VERSION_PREFIX_GIT_BRANCH + this.#ref);
    }

    return url.toString();
  }

  /**
   * Returns the file download URL for this azure resource.
   *
   * Throws an error if the URL does not point to a file.
   */
  toFileUrl(): string {
    if (!this.#path) {
      throw new Error(
        'Azure URL must point to a specific path to be able to download a file',
      );
    }

    const url = this.#baseUrl(
      this.#owner,
      this.#project,
      '_apis',
      'git',
      'repositories',
      this.#repo,
      'items',
    );
    url.searchParams.set('api-version', '6.0');
    url.searchParams.set('path', this.#path);

    if (this.#ref) {
      url.searchParams.set('version', this.#ref);
    }

    return url.toString();
  }

  /**
   * Returns the archive download URL for this azure resource.
   *
   * Throws an error if the URL does not point to a repo.
   */
  toArchiveUrl(): string {
    const url = this.#baseUrl(
      this.#owner,
      this.#project,
      '_apis',
      'git',
      'repositories',
      this.#repo,
      'items',
    );
    url.searchParams.set('recursionLevel', 'full');
    url.searchParams.set('download', 'true');
    url.searchParams.set('api-version', '6.0');

    if (this.#path) {
      url.searchParams.set('scopePath', this.#path);
    }
    if (this.#ref) {
      url.searchParams.set('version', this.#ref);
    }

    return url.toString();
  }

  /**
   * Returns the API url for fetching commits from a branch for this azure resource.
   *
   * Throws an error if the URL does not point to a commit.
   */
  toCommitsUrl(): string {
    const url = this.#baseUrl(
      this.#owner,
      this.#project,
      '_apis',
      'git',
      'repositories',
      this.#repo,
      'commits',
    );
    url.searchParams.set('api-version', '6.0');

    if (this.#ref) {
      url.searchParams.set('searchCriteria.itemVersion.version', this.#ref);
    }

    return url.toString();
  }

  /**
   * Returns the name of the owner, a user or an organization.
   */
  getOwner(): string {
    return this.#owner;
  }

  /**
   * Returns the name of the project.
   */
  getProject(): string {
    return this.#project;
  }

  /**
   * Returns the name of the repo.
   */
  getRepo(): string {
    return this.#repo;
  }

  /**
   * Returns the file path within the repo if the URL contains one.
   */
  getPath(): string | undefined {
    return this.#path;
  }

  /**
   * Returns the git ref in the repo if the URL contains one.
   */
  getRef(): string | undefined {
    return this.#ref;
  }
}
