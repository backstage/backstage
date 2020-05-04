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

import { CircleCI, GitType, CircleCIOptions, GitInfo } from 'circleci-api';
import { ApiRef } from '@backstage/core';
import { default } from '../../../../packages/core/src/components/Status/Status.stories';

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
  constuctor() {}
  async authenticate({token, owner, repo}: {token: string, owner: string, repo: string}) {
    try {
      if (token === '' || owner === '' || repo === '') return Promise.reject();
      this.api = new CircleCI({ ...options, token, vcs: {
        type: GitType.GITHUB, // default: github
        owner,
        repo,
      }});
      // await this.api.me();
      return Promise.resolve();
    } catch (e) {
      this.api = null;
      return this.cantAuth();
    }
  }
  async cantAuth() {
    return Promise.reject("Can't auth");
  }
  async getBuilds() {
    if (!this.api) return this.cantAuth();
    return this.api.builds();
  }
}

export const circleCIApiRef = new ApiRef<CircleCIApi>({
  id: 'plugin.circleci.service',
  description: 'Used by the CircleCI plugin to make requests',
});
