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

import { GithubActionsApi } from './GithubActionsApi';
import { Build, BuildDetails, BuildStatus, WorkflowRun } from './types';

const statusToBuildStatus: { [status: string]: BuildStatus } = {
  success: BuildStatus.Success,
  failure: BuildStatus.Failure,
  pending: BuildStatus.Pending,
  running: BuildStatus.Running,
  in_progress: BuildStatus.Running,
  completed: BuildStatus.Success,
};

const conclusionToStatus = (conslusion: string): BuildStatus =>
  statusToBuildStatus[conslusion] ?? BuildStatus.Null;

export class GithubActionsClient implements GithubActionsApi {
  async listBuilds({
    owner,
    repo,
    token,
  }: {
    owner: string;
    repo: string;
    token: string;
  }): Promise<Build[]> {
    const url = `https://api.github.com/repos/${owner}/${repo}/actions/runs`;

    const response = await fetch(url, {
      headers: new Headers({
        Authorization: `Bearer ${token}`,
      }),
    });

    if (response.status > 200) {
      return [
        {
          commitId: 'Error',
          message: 'ResponseCode > 200',
          branch: 'Error',
          status: BuildStatus.Failure,
          uri: 'Error',
        },
      ];
    }

    const data = await response.json();

    const newData: WorkflowRun[] = data.workflow_runs;

    const endData: Build[] = [];

    newData.forEach((element, index) => {
      const transData: Build = {
        commitId: '',
        message: '',
        branch: '',
        status: BuildStatus.Null,
        uri: '',
      };
      transData.commitId = String(element.head_commit.id);
      transData.branch = element.head_branch;
      transData.status = conclusionToStatus(element.conclusion);
      transData.message = element.head_commit.message;
      transData.uri = element.url;
      endData[index] = transData;
    });

    return endData;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getBuild(
    buildUri: string,
    token: Promise<string>,
  ): Promise<BuildDetails> {
    const response = await fetch(buildUri, {
      headers: new Headers({
        Authorization: `Bearer ${await token}`,
      }),
    });
    const buildBlank: Build = {
      commitId: '',
      message: '',
      branch: '',
      status: BuildStatus.Null,
      uri: '',
    };

    const dataBlank: BuildDetails = {
      build: buildBlank,
      author: '',
      logUrl: '',
      overviewUrl: '',
    };

    if (response.status > 200) {
      return dataBlank;
    }

    const data = await response.json();

    const newData: WorkflowRun = data;

    dataBlank.author = newData.head_commit.author.name;
    dataBlank.build.branch = newData.head_branch;
    dataBlank.build.commitId = newData.head_commit.id;
    dataBlank.build.message = newData.head_commit.message;
    dataBlank.build.status = conclusionToStatus(newData.status);
    dataBlank.build.uri = newData.url;
    dataBlank.logUrl = newData.logs_url;
    dataBlank.overviewUrl = newData.html_url;

    return dataBlank;
  }
}
