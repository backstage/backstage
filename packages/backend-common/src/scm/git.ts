/*
 * Copyright 2020 Spotify AB
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
import git, { ProgressCallback } from 'isomorphic-git';
import http from 'isomorphic-git/http/node';
import fs from 'fs-extra';
import { Logger } from 'winston';

/*
provider    username        password
GitHub      token           'x-oauth-basic'
GitHub App  token           'x-access-token'
BitBucket   'x-token-auth'  token
GitLab      'oauth2'        token
From : https://isomorphic-git.org/docs/en/onAuth

Azure       'notempty'      token
*/
export class Git {
  private constructor(
    private readonly config: {
      username?: string;
      password?: string;
      logger?: Logger;
    },
  ) {}

  async add({ dir, filepath }: { dir: string; filepath: string }) {
    this.config.logger?.info(`Adding file {dir=${dir},filepath=${filepath}}`);

    return git.add({ fs, dir, filepath });
  }

  async addRemote({
    dir,
    url,
    remoteName,
  }: {
    dir: string;
    remoteName: string;
    url: string;
  }) {
    this.config.logger?.info(
      `Creating new remote {dir=${dir},remoteName=${remoteName},url=${url}}`,
    );
    return git.addRemote({ fs, dir, remote: remoteName, url });
  }

  async commit({
    dir,
    message,
    author,
    committer,
  }: {
    dir: string;
    message: string;
    author: { name: string; email: string };
    committer: { name: string; email: string };
  }) {
    this.config.logger?.info(
      `Committing file to repo {dir=${dir},message=${message}}`,
    );

    return git.commit({ fs, dir, message, author, committer });
  }

  async clone({ url, dir }: { url: string; dir: string }) {
    this.config.logger?.info(`Cloning repo {dir=${dir},url=${url}}`);
    return git.clone({
      fs,
      http,
      url,
      dir,
      singleBranch: true,
      depth: 1,
      onProgress: this.onProgressHandler(),
      headers: {
        'user-agent': 'git/@isomorphic-git',
      },
      onAuth: this.onAuth,
    });
  }

  // https://isomorphic-git.org/docs/en/currentBranch
  async currentBranch({ dir, fullName }: { dir: string; fullName?: boolean }) {
    const fullname = fullName ?? false;
    return git.currentBranch({ fs, dir, fullname });
  }

  // https://isomorphic-git.org/docs/en/fetch
  async fetch({ dir, remote }: { dir: string; remote?: string }) {
    const remoteValue = remote ?? 'origin';
    this.config.logger?.info(
      `Fetching remote=${remoteValue} for repository {dir=${dir}}`,
    );
    return git.fetch({
      fs,
      http,
      dir,
      remote: remoteValue,
      onProgress: this.onProgressHandler(),
      headers: {
        'user-agent': 'git/@isomorphic-git',
      },
      onAuth: this.onAuth,
    });
  }

  async init({ dir }: { dir: string }) {
    this.config.logger?.info(`Init git repository {dir=${dir}}`);

    return git.init({
      fs,
      dir,
    });
  }

  // https://isomorphic-git.org/docs/en/merge
  async merge({
    dir,
    headBranch,
    baseBranch,
    author,
    committer,
  }: {
    dir: string;
    headBranch: string;
    baseBranch?: string;
    author: { name: string; email: string };
    committer: { name: string; email: string };
  }) {
    this.config.logger?.info(
      `Merging branch '${headBranch}' into '${baseBranch}' for repository {dir=${dir}}`,
    );
    // If baseBranch is undefined, current branch is used.
    return git.merge({
      fs,
      dir,
      ours: baseBranch,
      theirs: headBranch,
      author,
      committer,
    });
  }

  async push({ dir, remoteName }: { dir: string; remoteName: string }) {
    this.config.logger?.info(
      `Pushing directory to remote {dir=${dir},remoteName=${remoteName}}`,
    );
    return git.push({
      fs,
      dir,
      http,
      onProgress: this.onProgressHandler(),
      headers: {
        'user-agent': 'git/@isomorphic-git',
      },
      remote: remoteName,
      onAuth: this.onAuth,
    });
  }

  // https://isomorphic-git.org/docs/en/readCommit
  async readCommit({ dir, sha }: { dir: string; sha: string }) {
    return git.readCommit({ fs, dir, oid: sha });
  }

  // https://isomorphic-git.org/docs/en/resolveRef
  async resolveRef({ dir, ref }: { dir: string; ref: string }) {
    return git.resolveRef({ fs, dir, ref });
  }

  private onAuth = () => ({
    username: this.config.username,
    password: this.config.password,
  });

  private onProgressHandler = (): ProgressCallback => {
    let currentPhase = '';

    return event => {
      if (currentPhase !== event.phase) {
        currentPhase = event.phase;
        this.config.logger?.info(event.phase);
      }
      const total = event.total
        ? `${Math.round((event.loaded / event.total) * 100)}%`
        : event.loaded;
      this.config.logger?.debug(`status={${event.phase},total={${total}}}`);
    };
  };

  static fromAuth = ({
    username,
    password,
    logger,
  }: {
    username?: string;
    password?: string;
    logger?: Logger;
  }) => new Git({ username, password, logger });
}
