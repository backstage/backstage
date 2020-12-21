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
import git from 'isomorphic-git';
import http from 'isomorphic-git/http/node';
import fs from 'fs-extra';
import { Logger } from 'winston';

/*
provider    username  	    password
GitHub      token	          'x-oauth-basic'
GitHub App 	token	          'x-access-token'
BitBucket	  'x-token-auth'	token
GitLab      'oauth2'	      token
From : https://isomorphic-git.org/docs/en/onAuth
*/
class SCM {
  constructor(
    private readonly config: {
      username?: string;
      password?: string;
      logger?: Logger;
    },
  ) {}

  async clone({ url, dir }: { url: string; dir: string }) {
    this.config.logger?.info(`Cloning repo {dir=${dir},url=${url}}`);
    return git.clone({
      fs,
      http,
      url,
      dir,
      singleBranch: true,
      depth: 1,
      onProgress: event => {
        const total = event.total
          ? `${Math.round((event.loaded / event.total) * 100)}%`
          : event.loaded;
        this.config.logger?.info(`status={${event.phase},total={${total}}}`);
      },
      headers: {
        'user-agent': 'git/@isomorphic-git',
      },
      onAuth: () => ({
        username: this.config.username,
        password: this.config.password,
      }),
    });
  }

  async init({ dir }: { dir: string }) {
    this.config.logger?.info(`Init git repository {dir=${dir}}`);

    return git.init({
      fs,
      dir,
    });
  }

  async add({ dir, filepath }: { dir: string; filepath: string }) {
    this.config.logger?.info(`Adding file {dir=${dir},filepath=${filepath}}`);

    return git.add({ fs, dir, filepath });
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

  async push({ dir, remoteName }: { dir: string; remoteName: string }) {
    this.config.logger?.info(
      `Pushing directory to remote {dir=${dir},remoteName=${remoteName}}`,
    );
    git.push({
      fs,
      dir,
      http,
      onProgress: event => {
        const total = event.total
          ? `${Math.round((event.loaded / event.total) * 100)}%`
          : event.loaded;
        this.config.logger?.info(`status={${event.phase},total={${total}}}`);
      },
      headers: {
        'user-agent': 'git/@isomorphic-git',
      },
      remote: remoteName,
      onAuth: () => ({
        username: this.config.username,
        password: this.config.password,
      }),
    });
  }
}

// TODO(blam): This could potentially become something like for URL
// and use the integrations config for URLReading instead.
// But for now, I don't want to do all that in this PR.
export const fromAuth = ({
  username,
  password,
  logger,
}: {
  username?: string;
  password?: string;
  logger?: Logger;
}) => new SCM({ username, password, logger });
