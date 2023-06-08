/*
 * Copyright 2020 The Backstage Authors
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
  DiscoveryApi,
  FetchApi,
  createApiRef,
} from '@backstage/core-plugin-api';

/** @public */
export const nomadApiRef = createApiRef<NomadApi>({
  id: 'plugin.nomad.service',
});

/** @public */
export type NomadApi = {
  /**
   * listAllocations is for listing all allocations matching some part of 'filter'.
   *
   * See: https://developer.hashicorp.com/nomad/api-docs/allocations#list-allocations
   */
  listAllocations: (
    options: ListAllocationsRequest,
  ) => Promise<ListAllocationsResponse>;

  /**
   * listJobVersions is for listing all deployments matching some part of 'filter'.
   *
   * See: https://developer.hashicorp.com/nomad/api-docs/deployments#list-deployments
   */
  listJobVersions: (
    options: ListJobVersionsRequest,
  ) => Promise<ListJobVersionsResponse>;
};

/** @public */
export interface ListAllocationsRequest {
  namespace: string;
  filter: string;
}

/** @public */
export interface ListAllocationsResponse {
  allocations: Allocation[];
}

/** @public */
export interface Allocation {
  ClientStatus: string;
  CreateTime: number;
  DeploymentStatus: DeploymentStatus;
  ID: string;
  JobID: string;
  JobVersion: string;
  ModifyTime: number;
  Name: string;
  Namespace: string;
  NodeID: string;
  TaskGroup: string;
}

/** @public */
export interface DeploymentStatus {
  Healthy: boolean;
  Timestamp: string;
}

/** @public */
export interface ListJobVersionsRequest {
  namespace: string;
  jobID: string;
}

/** @public */
export interface ListJobVersionsResponse {
  versions: Version[];
}

/** @public */
export interface Version {
  ID: string;
  SubmitTime: number;
  Stable: boolean;
  Version: number;
}

/** @public */
export class FetchError extends Error {
  get name(): string {
    return this.constructor.name;
  }

  static async forResponse(resp: Response): Promise<FetchError> {
    return new FetchError(
      `Request failed with status code ${
        resp.status
      }.\nReason: ${await resp.text()}`,
    );
  }
}

/** @public */
export class NomadHttpApi implements NomadApi {
  static new(discoveryApi: DiscoveryApi, fetchApi: FetchApi) {
    return new NomadHttpApi(discoveryApi, fetchApi);
  }

  constructor(private discoveryApi: DiscoveryApi, private fetchApi: FetchApi) {}

  // TODO: pagination
  async listAllocations(
    options: ListAllocationsRequest,
  ): Promise<ListAllocationsResponse> {
    const apiUrl = await this.discoveryApi.getBaseUrl('nomad');

    const resp = await this.fetchApi.fetch(
      `${apiUrl}/v1/allocations?namespace=${encodeURIComponent(
        options.namespace,
      )}&filter=${encodeURIComponent(options.filter)}`,
    );
    if (!resp.ok) throw await FetchError.forResponse(resp);

    return {
      allocations: await resp.json(),
    };
  }

  // TODO: pagination
  async listJobVersions(
    options: ListJobVersionsRequest,
  ): Promise<ListJobVersionsResponse> {
    const apiUrl = await this.discoveryApi.getBaseUrl('nomad');

    const resp = await this.fetchApi.fetch(
      `${apiUrl}/v1/job/${
        options.jobID
      }/versions?namespace=${encodeURIComponent(options.namespace)}`,
    );
    if (!resp.ok) throw await FetchError.forResponse(resp);

    const respJson = await resp.json();

    return {
      versions: respJson.Versions,
    };
  }
}
