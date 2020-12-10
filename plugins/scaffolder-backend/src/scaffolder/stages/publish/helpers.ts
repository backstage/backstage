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
import globby from 'globby';
import fs from 'fs';
import http from 'isomorphic-git/http/node';
import { Logger } from 'winston';
/*
username	password
GitHub	| token	'x-oauth-basic'
GitHub App |	token	'x-access-token'
BitBucket	| 'x-token-auth'	token
GitLab	| 'oauth2'	token
From : https://isomorphic-git.org/docs/en/onAuth
*/
export async function push(
  dir: string,
  remote: string,
  logger: Logger,
  auth: { username: string; password: string },
): Promise<void> {
  logger.info('Initializing Git Repo', dir);
  await git.init({
    fs,
    dir,
  });

  const paths = await globby(['./**', './**/.*'], {
    cwd: dir,
    gitignore: true,
  });

  logger.info('Adding files to repository', dir);
  for (const filepath of paths) {
    await git.add({ fs, dir, filepath });
  }

  logger.info('Creating commit', dir);
  await git.commit({
    fs,
    dir,
    message: 'Initial commit',
    author: { name: 'Scaffolder', email: 'scaffolder@backstage.io' },
    committer: { name: 'Scaffolder', email: 'scaffolder@backstage.io' },
  });

  await git.addRemote({
    fs,
    dir,
    remote: 'origin',
    url: remote,
  });

  logger.info('Pushing code to remote', remote);
  await git.push({
    fs,
    dir,
    http,
    headers: {
      'user-agent': 'git/@isomorphic-git',
    },
    onProgress: event => {
      const total = event.total
        ? `${Math.round((event.loaded / event.total) * 100)}%`
        : event.loaded;
      logger.info(`status={${event.phase},total={${total}}}`);
    },
    remote: 'origin',
    onAuth: () => auth,
  });
}
