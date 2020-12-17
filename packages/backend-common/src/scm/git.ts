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

class SCM {
  constructor(
    private readonly config: { username: string; password: string },
    private readonly logger: Logger,
  ) {}

  async clone({ url, dir }) {
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
        this.logger.info(`status={${event.phase},total={${total}}}`);
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
}

export const fromAuth = ({
  username,
  password,
  logger,
}: {
  username: string;
  password: string;
  logger: Logger;
}) => {
  return new SCM({ username, password });
};
