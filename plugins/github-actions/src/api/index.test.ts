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

import { GithubActionsClient } from './GithubActionsClient';
import { BuildStatus } from './types';

describe('Github Actions API', () => {
  let client: GithubActionsClient;
  beforeEach(() => {
    client = new GithubActionsClient();
  });
  describe('Mock client', () => {
    it('gets a list of builds by a project id', async () => {
      await expect(client.listBuilds()).resolves.toEqual([]);
    });
    it('gets a build info by its id', async () => {
      await expect(client.getBuild()).resolves.toEqual({
        build: {
          commitId: 'TODO',
          branch: 'TODO',
          uri: 'TODO',
          status: BuildStatus.Running,
          message: 'TODO',
        },
        author: 'TODO',
        logUrl: 'TODO',
        overviewUrl: 'TODO',
      });
    });
  });
});
