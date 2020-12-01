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

export async function pushToRemoteCred(
  dir: string,
  remote: string,
  auth?: { username: string; password: string },
): Promise<void> {
  await git.init({
    fs,
    dir,
  });

  const paths = await globby(['./**', './**/.*'], { gitignore: true });
  for (const filepath of paths) {
    await git.add({ fs, dir, filepath });
  }

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

  await git.push({
    fs,
    dir,
    http,
    remote: 'origin',
    onAuth: () => auth,
  });
}
