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
  ConfigApi,
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
export type OctopusLinks = {
  Self: string;
  Web: string;
};

/** @public */
export type OctopusProject = {
  Name: string;
  Slug: string;
  Links: OctopusLinks;
};

/** @public */
export type OctopusProjectGroup = {
  Id: string;
  Name: string;
  Description: string;
};

/** @public */
export type OctopusPluginConfig = {
  WebUiBaseUrl: string;
};

/** @public */
export const octopusDeployApiRef = createApiRef<OctopusDeployApi>({
  id: 'plugin.octopusdeploy.service',
});

const DEFAULT_PROXY_PATH_BASE = '/octopus-deploy';
const WEB_UI_BASE_URL_CONFIG_KEY = 'octopusdeploy.webBaseUrl';

/** @public */
export interface OctopusDeployApi {
  getReleaseProgression(opts: {
    projectReference: ProjectReference;
    releaseHistoryCount: number;
  }): Promise<OctopusProgression>;
  getProjectInfo(projectReference: ProjectReference): Promise<OctopusProject>;
  getProjectGroups(): Promise<OctopusProjectGroup[]>;
  getConfig(): Promise<OctopusPluginConfig>;
}

/** @public */
export class OctopusDeployClient implements OctopusDeployApi {
  private readonly configApi: ConfigApi;
  private readonly discoveryApi: DiscoveryApi;
  private readonly fetchApi: FetchApi;
  private readonly proxyPathBase: string;

  constructor(options: {
    configApi: ConfigApi;
    discoveryApi: DiscoveryApi;
    fetchApi: FetchApi;
    proxyPathBase?: string;
  }) {
    this.configApi = options.configApi;
    this.discoveryApi = options.discoveryApi;
    this.fetchApi = options.fetchApi;
    this.proxyPathBase = options.proxyPathBase ?? DEFAULT_PROXY_PATH_BASE;
  }

  async getReleaseProgression(opts: {
    projectReference: ProjectReference;
    releaseHistoryCount: number;
  }): Promise<OctopusProgression> {
    const url = await this.getProgressionApiUrl(opts);
    return this.fetchAndHandleErrors(url);
  }

  async getProjectInfo(
    projectReference: ProjectReference,
  ): Promise<OctopusProject> {
    const url = await this.getProjectApiUrl(projectReference);
    return this.fetchAndHandleErrors(url);
  }

  async getProjectGroups(): Promise<OctopusProjectGroup[]> {
    const url = await this.getProjectGroupApiUrl();
    return this.fetchAndHandleErrors(url);
  }

  async getConfig(): Promise<OctopusPluginConfig> {
    return {
      WebUiBaseUrl: this.configApi.getString(WEB_UI_BASE_URL_CONFIG_KEY),
    };
  }

  private async fetchAndHandleErrors<T>(url: string): Promise<T> {
    const response = await this.fetchApi.fetch(url);

    let responseJson: T;

    try {
      responseJson = await response.json();
    } catch (e) {
      throw new Error(`Failed to parse JSON response: ${e}`);
    }

    if (!response.ok) {
      throw new Error(
        `Error communicating with Octopus Deploy: ${response.status}`,
      );
    }

    return responseJson;
  }

  private async getProgressionApiUrl(opts: {
    projectReference: ProjectReference;
    releaseHistoryCount: number;
  }) {
    const queryParameters = new URLSearchParams({
      releaseHistoryCount: opts.releaseHistoryCount.toString(),
    });

    const projectUrl = await this.getProjectApiUrl(opts.projectReference);

    return `${projectUrl}/progression?${queryParameters}`;
  }

  private async getProjectApiUrl(projectReference: ProjectReference) {
    const proxyUrl = await this.discoveryApi.getBaseUrl('proxy');
    if (projectReference.spaceId !== undefined)
      return `${proxyUrl}${this.proxyPathBase}/${encodeURIComponent(
        projectReference.spaceId,
      )}/projects/${encodeURIComponent(projectReference.projectId)}`;
    return `${proxyUrl}${this.proxyPathBase}/projects/${encodeURIComponent(
      projectReference.projectId,
    )}`;
  }

  private async getProjectGroupApiUrl(): Promise<string> {
    const proxyUrl = await this.discoveryApi.getBaseUrl('proxy');
    return `${proxyUrl}${this.proxyPathBase}/projectgroups/all`;
  }
}
