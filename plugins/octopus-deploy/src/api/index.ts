/*
 * Copyright 2023 The Backstage Authors
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
  createApiRef,
  DiscoveryApi,
  FetchApi,
} from '@backstage/core-plugin-api';
import { ProjectReference } from '../utils/getAnnotationFromEntity';

/** @public */
export type OctopusProgression = {
  Environments: OctopusEnvironment[];
  Releases: OctopusReleaseProgression[];
};

/** @public */
export type OctopusEnvironment = {
  Id: string;
  Name: string;
};

/** @public */
export type OctopusReleaseProgression = {
  Release: OctopusRelease;
  Deployments: { [key: string]: OctopusDeployment[] };
};

/** @public */
export type OctopusRelease = {
  Id: string;
  Version: string;
};

/** @public */
export type OctopusDeployment = {
  State: string;
};

/** @public */
export const octopusDeployApiRef = createApiRef<OctopusDeployApi>({
  id: 'plugin.octopusdeploy.service',
});

const DEFAULT_PROXY_PATH_BASE = '/octopus-deploy';

/** @public */
export interface OctopusDeployApi {
  getReleaseProgression(opts: {
    projectReference: ProjectReference;
    releaseHistoryCount: number;
  }): Promise<OctopusProgression>;
}

/** @public */
export class OctopusDeployClient implements OctopusDeployApi {
  private readonly discoveryApi: DiscoveryApi;
  private readonly fetchApi: FetchApi;
  private readonly proxyPathBase: string;

  constructor(options: {
    discoveryApi: DiscoveryApi;
    fetchApi: FetchApi;
    proxyPathBase?: string;
  }) {
    this.discoveryApi = options.discoveryApi;
    this.fetchApi = options.fetchApi;
    this.proxyPathBase = options.proxyPathBase ?? DEFAULT_PROXY_PATH_BASE;
  }

  async getReleaseProgression(opts: {
    projectReference: ProjectReference;
    releaseHistoryCount: number;
  }): Promise<OctopusProgression> {
    const url = await this.getApiUrl(opts);

    const response = await this.fetchApi.fetch(url);

    let responseJson;

    try {
      responseJson = await response.json();
    } catch (e) {
      responseJson = { releases: [] };
    }

    if (response.status !== 200) {
      throw new Error(
        `Error communicating with Octopus Deploy: ${
          responseJson?.error?.title || response.statusText
        }`,
      );
    }

    return responseJson;
  }

  private async getApiUrl(opts: {
    projectReference: ProjectReference;
    releaseHistoryCount: number;
  }) {
    const proxyUrl = await this.discoveryApi.getBaseUrl('proxy');
    const queryParameters = new URLSearchParams({
      releaseHistoryCount: opts.releaseHistoryCount.toString(),
    });
    if (opts.projectReference.spaceId !== undefined) {
      return `${proxyUrl}${this.proxyPathBase}/${encodeURIComponent(
        opts.projectReference.spaceId,
      )}/projects/${encodeURIComponent(
        opts.projectReference.projectId,
      )}/progression?${queryParameters}`;
    }

    return `${proxyUrl}${this.proxyPathBase}/projects/${encodeURIComponent(
      opts.projectReference.projectId,
    )}/progression?${queryParameters}`;
  }
}
