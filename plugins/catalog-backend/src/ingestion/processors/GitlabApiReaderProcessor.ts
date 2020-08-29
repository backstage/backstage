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

import { LocationSpec } from '@backstage/catalog-model';
import fetch, { RequestInit, HeadersInit } from 'node-fetch';
import * as result from './results';
import { LocationProcessor, LocationProcessorEmit } from './types';
import { Config } from '@backstage/config';

export class GitlabApiReaderProcessor implements LocationProcessor {
  private privateToken: string;

  constructor(config: Config) {
    this.privateToken =
      (config.getOptional(
        'backend.processors.gitlabApi.privateToken',
      ) as string) ?? '';
  }

  getRequestOptions(): RequestInit {
    const headers: HeadersInit = { 'PRIVATE-TOKEN': '' };
    if (this.privateToken !== '') {
      headers['PRIVATE-TOKEN'] = this.privateToken;
    }

    const requestOptions: RequestInit = {
      headers,
    };

    return requestOptions;
  }

  async readLocation(
    location: LocationSpec,
    optional: boolean,
    emit: LocationProcessorEmit,
  ): Promise<boolean> {
    if (location.type !== 'gitlab/api') {
      return false;
    }

    try {
      const projectID = await this.getProjectID(location.target);
      const url = this.buildRawUrl(location.target, projectID);
      const response = await fetch(url.toString(), this.getRequestOptions());
      if (response.ok) {
        const data = await response.buffer();
        emit(result.data(location, data));
      } else {
        const message = `${location.target} could not be read as ${url}, ${response.status} ${response.statusText}`;
        if (response.status === 404) {
          if (!optional) {
            emit(result.notFoundError(location, message));
          }
        } else {
          emit(result.generalError(location, message));
        }
      }
    } catch (e) {
      const message = `Unable to read ${location.type} ${location.target}, ${e}`;
      emit(result.generalError(location, message));
    }
    return true;
  }

  // convert https://gitlab.com/groupA/teams/teamA/subgroupA/repoA/-/blob/branch/filepath
  // to https://gitlab.com/api/v4/projects/<PROJECTID>/repository/files/filepath?ref=branch
  buildRawUrl(target: string, projectID: Number): URL {
    try {
      const url = new URL(target);

      const branchAndfilePath = url.pathname.split('/-/blob/')[1];

      if (!branchAndfilePath.match(/\.ya?ml$/)) {
        throw new Error('GitLab url does not end in .ya?ml');
      }

      const [branch, ...filePath] = branchAndfilePath.split('/');

      url.pathname = [
        '/api/v4/projects',
        projectID,
        'repository/files',
        encodeURIComponent(filePath.join('/')),
        'raw',
      ].join('/');
      url.search = `?ref=${branch}`;

      return url;
    } catch (e) {
      throw new Error(`Incorrect url: ${target}, ${e}`);
    }
  }

  async getProjectID(target: string): Promise<Number> {
    const url = new URL(target);

    if (
      // absPaths to gitlab files should contain /-/blob
      // ex: https://gitlab.com/groupA/teams/teamA/subgroupA/repoA/-/blob/branch/filepath
      !url.pathname.match(/\/\-\/blob\//)
    ) {
      throw new Error('Please provide full path to yaml file from Gitlab');
    }
    try {
      const repo = url.pathname.split('/-/blob/')[0];

      // Find ProjectID from url
      // convert 'https://gitlab.com/groupA/teams/teamA/subgroupA/repoA/-/blob/branch/filepath'
      // to 'https://gitlab.com/api/v4/projects/groupA%2Fteams%2FsubgroupA%2FteamA%2Frepo'
      const repoIDLookup = new URL(
        `${url.protocol + url.hostname}/api/v4/projects/${encodeURIComponent(
          repo.replace(/^\//, ''),
        )}`,
      );
      const response = await fetch(
        repoIDLookup.toString(),
        this.getRequestOptions(),
      );
      const projectIDJson = await response.json();
      const projectID: Number = projectIDJson.id;

      return projectID;
    } catch (e) {
      throw new Error(`Could not get GitLab ProjectID for: ${target}, ${e}`);
    }
  }
}
