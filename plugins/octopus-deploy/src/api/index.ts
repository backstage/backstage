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
  IdentityApi,
} from '@backstage/core-plugin-api';

export type OctopusProgression = {
  Environments: OctopusEnvironment[];
  Releases: OctopusReleaseProgression[];
};

export type OctopusEnvironment = {
  Id: string;
  Name: string;
};

export type OctopusReleaseProgression = {
  Release: OctopusRelease;
  Deployments: { [key: string]: OctopusDeployment[] };
};

export type OctopusRelease = {
  Id: string;
  Version: string;
};

export type OctopusDeployment = {
  State: string;
};

export const octopusDeployApiRef = createApiRef<OctopusDeployApi>({
  id: 'plugin.octopusdeploy.service',
});

const DEFAULT_PROXY_PATH_BASE = '/octopus-deploy';

type Options = {
  discoveryApi: DiscoveryApi;
  identityApi: IdentityApi;
  /**
   * Path to use for requests via the proxy, defaults to /octopus-deploy
   */
  proxyPathBase?: string;
};

export interface OctopusDeployApi {
  getReleaseProgression(
    projectId: string,
    releaseHistoryCount: number,
  ): Promise<OctopusProgression>;
}

export class OctopusDeployClient implements OctopusDeployApi {
  private readonly discoveryApi: DiscoveryApi;
  private readonly identityApi: IdentityApi;
  private readonly proxyPathBase: string;

  constructor(options: Options) {
    this.discoveryApi = options.discoveryApi;
    this.identityApi = options.identityApi;
    this.proxyPathBase = options.proxyPathBase ?? DEFAULT_PROXY_PATH_BASE;
  }

  async getReleaseProgression(
    projectId: string,
    releaseHistoryCount: number,
  ): Promise<OctopusProgression> {
    const url = await this.getApiUrl(projectId, releaseHistoryCount);

    const { token: idToken } = await this.identityApi.getCredentials();
    const response = await fetch(url, {
      headers: idToken ? { Authorization: `Bearer ${idToken}` } : {},
    });

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

  private async getApiUrl(projectId: string, releaseHistoryCount: number) {
    const proxyUrl = await this.discoveryApi.getBaseUrl('proxy');
    return `${proxyUrl}${this.proxyPathBase}/projects/${projectId}/progression?releaseHistoryCount=${releaseHistoryCount}`;
  }
}
