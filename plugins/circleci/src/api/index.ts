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

import { CircleCI, GitType, CircleCIOptions, GitInfo, getBuildSummaries } from 'circleci-api';
import { ApiRef } from '@backstage/core';
//import { default } from '../../../../packages/core/src/components/Status/Status.stories';

const defaultVcsOptions: GitInfo = {
  type: GitType.GITHUB, // default: github
  owner: 'CircleCITest3',
  repo: 'circleci-test',
}

const options: Partial<CircleCIOptions> = {
  // Required for all requests
  // token: CIRCLECI_TOKEN, // Set your CircleCi API token

  // Optional
  // Anything set here can be overriden when making the request

  // Git information is required for project/build/etc endpoints
  vcs: defaultVcsOptions
};

export class CircleCIApi {
  api: null | CircleCI = null;
  token: string = '';
  constuctor() {}
  async authenticate(token: string) {
    try {
      if (token === '') return Promise.reject();
      this.api = new CircleCI({ ...options, token});
      // await this.api.me();
      this.token = token;
      return Promise.resolve();
    } catch (e) {
      this.api = null;
      return this.cantAuth();
    }
  }
  async cantAuth() {
    return Promise.reject("Can't auth");
  }
  async getBuilds({repo, owner}: {repo: string, owner: string}) {
    if (!this.api) return this.cantAuth();
    if (owner === '' || repo === '') return Promise.reject();
    return getBuildSummaries(this.token, {vcs: {...defaultVcsOptions, owner, repo}});
  }
}

export const circleCIApiRef = new ApiRef<CircleCIApi>({
  id: 'plugin.circleci.service',
  description: 'Used by the CircleCI plugin to make requests',
});
