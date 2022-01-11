/*
 * Copyright 2020 The Backstage Authors
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

import git, {
  ProgressCallback,
  MergeResult,
  ReadCommitResult,
} from 'isomorphic-git';
import http from 'isomorphic-git/http/node';
import fs from 'fs-extra';
import { Logger } from 'winston';

/*
provider    username         password
GitHub      'x-access-token' token
BitBucket   'x-token-auth'   token
GitLab      'oauth2'         token
From : https://isomorphic-git.org/docs/en/onAuth with fix for GitHub

Azure       'notempty'      token
*/

/**
 * A convenience wrapper around the `isomorphic-git` library.
 *
 * @public
 */
export class Git {
  private constructor(
    private readonly config: {
      username?: string;
      password?: string;
      logger?: Logger;
    },
  ) {}

  async add(options: { dir: string; filepath: string }): Promise<void> {
    const { dir, filepath } = options;
    this.config.logger?.info(`Adding file {dir=${dir},filepath=${filepath}}`);

    return git.add({ fs, dir, filepath });
  }

  async addRemote(options: {
    dir: string;
    remote: string;
    url: string;
  }): Promise<void> {
    const { dir, url, remote } = options;
    this.config.logger?.info(
      `Creating new remote {dir=${dir},remote=${remote},url=${url}}`,
    );
    return git.addRemote({ fs, dir, remote, url });
  }

  async commit(options: {
    dir: string;
    message: string;
    author: { name: string; email: string };
    committer: { name: string; email: string };
  }): Promise<string> {
    const { dir, message, author, committer } = options;
    this.config.logger?.info(
      `Committing file to repo {dir=${dir},message=${message}}`,
    );

    return git.commit({ fs, dir, message, author, committer });
  }

  /** https://isomorphic-git.org/docs/en/clone */
  async clone(options: {
    url: string;
    dir: string;
    ref?: string;
    depth?: number;
    noCheckout?: boolean;
  }): Promise<void> {
    const { url, dir, ref, depth, noCheckout } = options;
    this.config.logger?.info(`Cloning repo {dir=${dir},url=${url}}`);
    return git.clone({
      fs,
      http,
      url,
      dir,
      ref,
      singleBranch: true,
      depth: depth ?? 1,
      noCheckout,
      onProgress: this.onProgressHandler(),
      headers: {
        'user-agent': 'git/@isomorphic-git',
      },
      onAuth: this.onAuth,
    });
  }

  /** https://isomorphic-git.org/docs/en/currentBranch */
  async currentBranch(options: {
    dir: string;
    fullName?: boolean;
  }): Promise<string | undefined> {
    const { dir, fullName = false } = options;
    return git.currentBranch({ fs, dir, fullname: fullName }) as Promise<
      string | undefined
    >;
  }

  /** https://isomorphic-git.org/docs/en/fetch */
  async fetch(options: { dir: string; remote?: string }): Promise<void> {
    const { dir, remote = 'origin' } = options;
    this.config.logger?.info(
      `Fetching remote=${remote} for repository {dir=${dir}}`,
    );
    await git.fetch({
      fs,
      http,
      dir,
      remote,
      onProgress: this.onProgressHandler(),
      headers: { 'user-agent': 'git/@isomorphic-git' },
      onAuth: this.onAuth,
    });
  }

  async init(options: { dir: string; defaultBranch?: string }): Promise<void> {
    const { dir, defaultBranch = 'master' } = options;
    this.config.logger?.info(`Init git repository {dir=${dir}}`);

    return git.init({
      fs,
      dir,
      defaultBranch,
    });
  }

  /** https://isomorphic-git.org/docs/en/merge */
  async merge(options: {
    dir: string;
    theirs: string;
    ours?: string;
    author: { name: string; email: string };
    committer: { name: string; email: string };
  }): Promise<MergeResult> {
    const { dir, theirs, ours, author, committer } = options;
    this.config.logger?.info(
      `Merging branch '${theirs}' into '${ours}' for repository {dir=${dir}}`,
    );

    // If ours is undefined, current branch is used.
    return git.merge({
      fs,
      dir,
      ours,
      theirs,
      author,
      committer,
    });
  }

  async push(options: { dir: string; remote: string }) {
    const { dir, remote } = options;
    this.config.logger?.info(
      `Pushing directory to remote {dir=${dir},remote=${remote}}`,
    );
    return git.push({
      fs,
      dir,
      http,
      onProgress: this.onProgressHandler(),
      headers: {
        'user-agent': 'git/@isomorphic-git',
      },
      remote: remote,
      onAuth: this.onAuth,
    });
  }

  /** https://isomorphic-git.org/docs/en/readCommit */
  async readCommit(options: {
    dir: string;
    sha: string;
  }): Promise<ReadCommitResult> {
    const { dir, sha } = options;
    return git.readCommit({ fs, dir, oid: sha });
  }

  /** https://isomorphic-git.org/docs/en/resolveRef */
  async resolveRef(options: { dir: string; ref: string }): Promise<string> {
    const { dir, ref } = options;
    return git.resolveRef({ fs, dir, ref });
  }

  /** https://isomorphic-git.org/docs/en/log */
  async log(options: {
    dir: string;
    ref?: string;
  }): Promise<ReadCommitResult[]> {
    const { dir, ref } = options;
    return git.log({
      fs,
      dir,
      ref: ref ?? 'HEAD',
    });
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

  static fromAuth = (options: {
    username?: string;
    password?: string;
    logger?: Logger;
  }) => {
    const { username, password, logger } = options;
    return new Git({ username, password, logger });
  };
}
