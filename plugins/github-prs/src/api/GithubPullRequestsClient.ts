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
/*
 * Copyright 2020 RoadieHQ
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

import { GithubPullRequestsApi } from './GithubPullRequestsApi';
import { Octokit } from '@octokit/rest';
import { PullsListResponseData } from '@octokit/types';
import { PullRequestState } from '../types';

export class GithubPullRequestsClient implements GithubPullRequestsApi {
  async listPullRequests({
    token,
    owner,
    repo,
    pageSize = 5,
    page,
    state = 'all',
  }: {
    token: string;
    owner: string;
    repo: string;
    pageSize?: number;
    page?: number;
    state?: PullRequestState;
  }): Promise<{
    maxTotalItems?: number;
    pullRequestsData: PullsListResponseData;
  }> {
    const pullRequestResponse = await new Octokit({ auth: token }).pulls.list({
      repo,
      state,
      per_page: pageSize,
      page,
      owner,
    });
    const paginationLinks = pullRequestResponse.headers.link;
    const lastPage = paginationLinks?.match(/\d+(?!.*page=\d*)/g) || ['1'];
    const maxTotalItems = paginationLinks?.endsWith('rel="last"')
      ? parseInt(lastPage[0], 10) * pageSize
      : undefined;

    return { maxTotalItems, pullRequestsData: pullRequestResponse.data };
  }
}
