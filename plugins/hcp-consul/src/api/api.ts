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
  DiscoveryApi,
  FetchApi,
  createApiRef,
} from '@backstage/core-plugin-api';

import { AccessTokenManager } from './accessTokenManager';

/** @public */
export const hcpConsulApiRef = createApiRef<HcpConsulApi>({
  id: 'plugin.hcp-consul.service',
});

/** @public */
export type HcpConsulApi = {
  listServices: (options: ListServiceRequest) => Promise<ListServiceResp>;

  listServiceInstances: (
    options: ListServiceInstancesRequest,
  ) => Promise<ListServiceInstancesResp>;

  getService: (options: GetServiceRequest) => Promise<GetServiceResp>;

  getAggrServiceSummary: (
    options: ServiceAggregateRequest,
  ) => Promise<ServiceAggregateResp>;

  listClusters: (options: ListClustersRequest) => Promise<ListClusterResp>;

  getCluster: (options: GetClusterRequest) => Promise<GetClusterResp>;
};

/** @public */
export interface Service {
  name: string;
  kind: string;
  cluster_id: string;
  cluster_resource_name: string;
  namespace: string;
  partition: string;
  instance_count: number;
  checks_critical: number;
  checks_passing: number;
  checks_warning: number;
  tags: string[];
}

/** @public */
export interface ServiceInstance {
  name: string;
  id: string;
  kind: string;
  cluster_id: string;
  namespace: string;
  partition: string;
  node: string;
  address: string;
  port: string;
  status: string;
  checks_critical: number;
  checks_passing: number;
  checks_warning: number;
  tags: string[];
}

/** @public */
export interface Cluster {
  name: string;
  resource_name: string;
  state: string;
  type: string;
}

/** @public */
export interface ClusterDetails {
  name: string;
  state: string;
  type: string;
  summary: {
    node_count: number;
    server_count: number;
    service_count: number;
    service_passing: number;
    service_warning: number;
    service_critical: number;
    client_count: number;
  };
}

/** @public */
export interface Pagination {
  next_page_token: string;
  previous_page_token: string;
}

/** @public */
export interface PaginationRequest {
  page_size: number;
  next_page_token?: string;
  previous_page_token?: string;
}

/** @public */
export interface ListServiceRequest {
  pagination: PaginationRequest;
  project_resource_name: string;
  status: string[];
}

/** @public */
export interface ListServiceResp {
  data: Service[];
  pagination: Pagination;
}

/** @public */
export interface ListServiceInstancesRequest {
  pagination: PaginationRequest;
  cluster_resource_name: string;
  service_name: string;
  namespace: string;
  partition: string;
}

export interface ListServiceInstancesResp {
  data: ServiceInstance[];
  pagination: Pagination;
}

/** @public */
export interface GetServiceRequest {
  cluster_resource_name: string;
  service_name: string;
  namespace: string;
  partition: string;
}

export interface GetServiceResp {
  data: Service;
}

/** @public */
export interface ListClustersRequest {
  projectID: string;
  pagination: PaginationRequest;
}

export interface ListClusterResp {
  data: Cluster[];
  pagination: Pagination;
}

/** @public */
export interface GetClusterRequest {
  cluster_resource_name: string;
}

export interface GetClusterResp {
  data: ClusterDetails;
}

/** @public */
export interface ServiceAggregateRequest {
  organizationID: string;
  projectID: string;
}

export interface ServiceAggregateResp {
  total_services: number;
  total_service_instances: number;
  passing_service_instances: number;
  warning_service_instances: number;
  critical_service_instances: number;
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

function getPaginationParams(pagination: PaginationRequest): URLSearchParams {
  const params = new URLSearchParams('');
  params.append('pagination.page_size', pagination.page_size.toString());
  params.append(
    'pagination.previous_page_token',
    pagination.previous_page_token || '',
  );
  params.append('pagination.next_page_token', pagination.next_page_token || '');

  return params;
}

/** @public */
export class HcpConsulHttpApi implements HcpConsulApi {
  private tokenManager: AccessTokenManager;

  static create(discoveryApi: DiscoveryApi, fetchApi: FetchApi) {
    return new HcpConsulHttpApi(discoveryApi, fetchApi);
  }

  constructor(private discoveryApi: DiscoveryApi, private fetchApi: FetchApi) {
    this.tokenManager = new AccessTokenManager(discoveryApi, fetchApi);
  }

  async listServices(options: ListServiceRequest): Promise<ListServiceResp> {
    const apiUrl = await this.discoveryApi.getBaseUrl('hcp-consul-backend');

    const params = getPaginationParams(options.pagination);

    options.status.forEach(status => {
      params.append('status', status);
    });
    const segments = options.project_resource_name.split('/');
    const projectID = segments[segments.length - 1];
    const url = `${apiUrl}/2023-10-10/consul/project/${projectID}/services?${params}`;

    const resp = await this.fetchApi.fetch(url, {
      headers: new Headers({
        Authorization: `Bearer ${await this.tokenManager.getToken()}`,
      }),
    });
    if (!resp.ok) throw await FetchError.forResponse(resp);

    const respJson = await resp.json();

    return respJson as ListServiceResp;
  }

  async listServiceInstances(
    options: ListServiceInstancesRequest,
  ): Promise<ListServiceInstancesResp> {
    const apiUrl = await this.discoveryApi.getBaseUrl('hcp-consul-backend');

    const params = getPaginationParams(options.pagination);
    params.append('namespace', options.namespace);
    params.append('partition', options.partition);

    const url = `${apiUrl}/2023-10-10/${options.cluster_resource_name}/service/${options.service_name}/instances?${params}`;
    const resp = await this.fetchApi.fetch(url, {
      headers: new Headers({
        Authorization: `Bearer ${await this.tokenManager.getToken()}`,
      }),
    });
    if (!resp.ok) throw await FetchError.forResponse(resp);

    const respJson = await resp.json();
    return respJson as ListServiceInstancesResp;
  }

  async getService(options: GetServiceRequest): Promise<GetServiceResp> {
    const apiUrl = await this.discoveryApi.getBaseUrl('hcp-consul-backend');

    const params = new URLSearchParams('');
    params.append('namespace', options.namespace);
    params.append('partition', options.partition);

    const url = `${apiUrl}/2023-10-10/${options.cluster_resource_name}/service/${options.service_name}?${params}`;

    const resp = await this.fetchApi.fetch(url, {
      headers: new Headers({
        Authorization: `Bearer ${await this.tokenManager.getToken()}`,
      }),
    });
    if (!resp.ok) throw await FetchError.forResponse(resp);

    const respJson = await resp.json();
    return respJson as GetServiceResp;
  }

  async getAggrServiceSummary(
    options: ServiceAggregateRequest,
  ): Promise<ServiceAggregateResp> {
    const apiUrl = await this.discoveryApi.getBaseUrl('hcp-consul-backend');

    const url = `${apiUrl}/2022-02-15/organizations/${options.organizationID}/projects/${options.projectID}/aggregate_service_summary`;

    const resp = await this.fetchApi.fetch(url, {
      headers: new Headers({
        Authorization: `Bearer ${await this.tokenManager.getToken()}`,
      }),
    });
    if (!resp.ok) throw await FetchError.forResponse(resp);

    const respJson = await resp.json();
    return respJson as ServiceAggregateResp;
  }

  // Cluster APIs
  async listClusters(options: ListClustersRequest): Promise<ListClusterResp> {
    const apiUrl = await this.discoveryApi.getBaseUrl('hcp-consul-backend');

    const params = getPaginationParams(options.pagination);

    const url = `${apiUrl}/2023-10-10/consul/project/${options.projectID}/clusters?${params}`;

    const resp = await this.fetchApi.fetch(url, {
      headers: new Headers({
        Authorization: `Bearer ${await this.tokenManager.getToken()}`,
      }),
    });
    if (!resp.ok) throw await FetchError.forResponse(resp);

    const respJson = await resp.json();
    return respJson as ListClusterResp;
  }

  async getCluster(options: GetClusterRequest): Promise<GetClusterResp> {
    const apiUrl = await this.discoveryApi.getBaseUrl('hcp-consul-backend');

    const url = `${apiUrl}/2023-10-10/${options.cluster_resource_name}`;

    const resp = await this.fetchApi.fetch(url, {
      headers: new Headers({
        Authorization: `Bearer ${await this.tokenManager.getToken()}`,
      }),
    });
    if (!resp.ok) throw await FetchError.forResponse(resp);

    const respJson = await resp.json();
    return respJson as GetClusterResp;
  }
}
