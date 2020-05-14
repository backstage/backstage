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

import {
  CircleCIOptions,
  getMe,
  getBuildSummaries,
  getFullBuild,
  postBuildActions,
  BuildAction,
  BuildWithSteps,
  BuildStepAction,
  BuildSummary,
  GitType,
} from 'circleci-api';
import { ApiRef } from '@backstage/core';

export { BuildWithSteps, BuildStepAction, BuildSummary, GitType };

export const circleCIApiRef = new ApiRef<CircleCIApi>({
  id: 'plugin.circleci.service',
  description: 'Used by the CircleCI plugin to make requests',
});

export class CircleCIApi {
  apiUrl: string;
  constructor(apiUrl: string = '/circleci/api') {
    this.apiUrl = apiUrl;
  }

  async retry(buildNumber: number, options: CircleCIOptions) {
    return postBuildActions(options.token, buildNumber, BuildAction.RETRY, {
      circleHost: this.apiUrl,
      ...options.vcs,
    });
  }

  async getBuilds(options: CircleCIOptions) {
    return getBuildSummaries(options.token, {
      vcs: {},
      circleHost: this.apiUrl,
      ...options,
    });
  }

  async getUser(options: CircleCIOptions) {
    return getMe(options.token, { circleHost: this.apiUrl, ...options });
  }

  async getBuild(buildNumber: number, options: CircleCIOptions) {
    return getFullBuild(options.token, buildNumber, {
      circleHost: this.apiUrl,
      ...options.vcs,
    });
  }
}
