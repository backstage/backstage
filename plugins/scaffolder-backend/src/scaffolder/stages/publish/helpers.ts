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

import globby from 'globby';
import { Logger } from 'winston';
import { Git } from '@backstage/backend-common';

export async function initRepoAndPush({
  dir,
  remoteUrl,
  auth,
  logger,
}: {
  dir: string;
  remoteUrl: string;
  auth: { username: string; password: string };
  logger: Logger;
}): Promise<void> {
  const git = Git.fromAuth({
    username: auth.username,
    password: auth.password,
    logger,
  });

  await git.init({
    dir,
  });

  const paths = await globby(['./**', './**/.*', '!.git'], {
    cwd: dir,
    gitignore: true,
    dot: true,
  });

  for (const filepath of paths) {
    await git.add({ dir, filepath });
  }

  await git.commit({
    dir,
    message: 'Initial commit',
    author: { name: 'Scaffolder', email: 'scaffolder@backstage.io' },
    committer: { name: 'Scaffolder', email: 'scaffolder@backstage.io' },
  });

  await git.addRemote({
    dir,
    url: remoteUrl,
    remote: 'origin',
  });

  await git.push({
    dir,
    remote: 'origin',
  });
}
