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

export class AzureUrl {
  /**
   * Parses an azure URL as copied from the browser address bar.
   *
   * Throws an error if the URL is not a valid azure repo URL.
   */
  static fromRepoUrl(_repoUrl: string): AzureUrl {
    throw new Error('not implemented');
  }

  /**
   * Returns a repo URL that can be used to navigate to the resource in azure.
   *
   * Throws an error if the URL is not a valid azure repo URL.
   */
  toRepoUrl(): string {
    throw new Error('not implemented');
  }

  /**
   * Returns the file download URL for this azure resource.
   *
   * Throws an error if the URL does not point to a file.
   */
  toFileUrl(): string {
    throw new Error('not implemented');
  }

  /**
   * Returns the archive download URL for this azure resource.
   *
   * Throws an error if the URL does not point to a repo.
   */
  toArchiveUrl(): string {
    throw new Error('not implemented');
  }

  /**
   * Returns the API url for fetching commits from a branch for this azure resource.
   *
   * Throws an error if the URL does not point to a commit.
   */
  toCommitsUrl(): string {
    throw new Error('not implemented');
  }

  /**
   * Returns the name of the owner, a user or an organization.
   */
  getOwner(): string {
    throw new Error('not implemented');
  }

  /**
   * Returns the name of the project.
   */
  getProject(): string {
    throw new Error('not implemented');
  }

  /**
   * Returns the name of the repo.
   */
  getRepo(): string {
    throw new Error('not implemented');
  }

  /**
   * Returns the file path within the repo if the URL contains one.
   */
  getPath(): string | undefined {
    throw new Error('not implemented');
  }

  /**
   * Returns the git ref in the repo if the URL contains one.
   */
  getRef(): string | undefined {
    throw new Error('not implemented');
  }
}
