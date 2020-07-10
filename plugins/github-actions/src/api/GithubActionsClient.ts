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
import { Entity } from '@backstage/catalog-model';

export class GithubActionsClient implements GithubActionsApi {
  async listBuilds(entity: Entity, token: Promise<string>): Promise<Build[]> {
    // ### Feedback request ###
    // I asumed the following: (maybe not the best. Ideally this should come from the link to the component.yaml file)
    // entity.metadata.namespace => org name
    // entity.metadata.name => repo name
    // entityUri -> entity:spotify:backstage

    let url: string;
    if (entity.metadata.name !== '') {
      url = `https://api.github.com/repos/${entity.metadata.namespace}/${entity.metadata.name}/runs`;
    } else {
      url = 'https://api.github.com/repos/spotify/backstage/actions/runs';
    }

    const response = await fetch(url, {
      headers: new Headers({
        Authorization: `Bearer ${await token}`,
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

      // ### Feedback request ###
      // TODO: I am not sure about this part. Looks ugly. Maybe there is a better way of doing this.
      if (element.conclusion === 'success') {
        transData.status = BuildStatus.Success;
      } else if (element.conclusion === 'failure') {
        transData.status = BuildStatus.Failure;
      } else if (element.conclusion === 'pending') {
        transData.status = BuildStatus.Pending;
      } else if (element.conclusion === 'running') {
        transData.status = BuildStatus.Running;
      } else {
        if (element.status === 'in_progress') {
          transData.status = BuildStatus.Running;
        } else {
          transData.status = BuildStatus.Null;
        }
      }
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

    // ### Feedback request ###
    // TODO: I am not sure about this part. Look ugly. Maybe there is a better way of doing this.
    if (newData.status === 'completed') {
      dataBlank.build.status = BuildStatus.Success;
    } else if (newData.status === 'in_progress') {
      dataBlank.build.status = BuildStatus.Running;
    } else if (newData.status === 'pending') {
      dataBlank.build.status = BuildStatus.Pending;
    } else if (newData.status === 'failure') {
      dataBlank.build.status = BuildStatus.Failure;
    } else {
      dataBlank.build.status = BuildStatus.Null;
    }

    dataBlank.build.uri = newData.url;
    dataBlank.logUrl = newData.logs_url;
    dataBlank.overviewUrl = newData.html_url;

    return dataBlank;
  }
}
