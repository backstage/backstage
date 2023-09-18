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

import { KubernetesApi } from './types';
import {
  KubernetesRequestBody,
  ObjectsByEntityResponse,
  WorkloadsByEntityRequest,
  CustomObjectsByEntityRequest,
} from '@backstage/plugin-kubernetes-common';
import { DiscoveryApi, IdentityApi } from '@backstage/core-plugin-api';
import { stringifyEntityRef } from '@backstage/catalog-model';
import { KubernetesAuthProvidersApi } from '../kubernetes-auth-provider';
import { NotFoundError } from '@backstage/errors';

export class KubernetesBackendClient implements KubernetesApi {
  private readonly discoveryApi: DiscoveryApi;
  private readonly identityApi: IdentityApi;
  private readonly kubernetesAuthProvidersApi: KubernetesAuthProvidersApi;

  constructor(options: {
    discoveryApi: DiscoveryApi;
    identityApi: IdentityApi;
    kubernetesAuthProvidersApi: KubernetesAuthProvidersApi;
  }) {
    this.discoveryApi = options.discoveryApi;
    this.identityApi = options.identityApi;
    this.kubernetesAuthProvidersApi = options.kubernetesAuthProvidersApi;
  }

  private async handleResponse(response: Response): Promise<any> {
    if (!response.ok) {
      const payload = await response.text();
      let message;
      switch (response.status) {
        case 404:
          message =
            'Could not find the Kubernetes Backend (HTTP 404). Make sure the plugin has been fully installed.';
          break;
        default:
          message = `Request failed with ${response.status} ${response.statusText}, ${payload}`;
      }
      throw new Error(message);
    }

    return await response.json();
  }

  private async postRequired(path: string, requestBody: any): Promise<any> {
    const url = `${await this.discoveryApi.getBaseUrl('kubernetes')}${path}`;
    const { token: idToken } = await this.identityApi.getCredentials();
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(idToken && { Authorization: `Bearer ${idToken}` }),
      },
      body: JSON.stringify(requestBody),
    });

    return this.handleResponse(response);
  }

  private async getCluster(
    clusterName: string,
  ): Promise<{ name: string; authProvider: string }> {
    const cluster = await this.getClusters().then(clusters =>
      clusters.find(c => c.name === clusterName),
    );
    if (!cluster) {
      throw new NotFoundError(`Cluster ${clusterName} not found`);
    }

    return cluster;
  }

  private async getCredentials(
    authProvider: string,
  ): Promise<{ token?: string }> {
    return await this.kubernetesAuthProvidersApi.getCredentials(authProvider);
  }

  async getObjectsByEntity(
    requestBody: KubernetesRequestBody,
  ): Promise<ObjectsByEntityResponse> {
    return await this.postRequired(
      `/services/${requestBody.entity.metadata.name}`,
      requestBody,
    );
  }

  async getWorkloadsByEntity(
    request: WorkloadsByEntityRequest,
  ): Promise<ObjectsByEntityResponse> {
    return await this.postRequired('/resources/workloads/query', {
      auth: request.auth,
      entityRef: stringifyEntityRef(request.entity),
    });
  }

  async getCustomObjectsByEntity(
    request: CustomObjectsByEntityRequest,
  ): Promise<ObjectsByEntityResponse> {
    return await this.postRequired(`/resources/custom/query`, {
      entityRef: stringifyEntityRef(request.entity),
      auth: request.auth,
      customResources: request.customResources,
    });
  }

  async getClusters(): Promise<{ name: string; authProvider: string }[]> {
    const { token: idToken } = await this.identityApi.getCredentials();
    const url = `${await this.discoveryApi.getBaseUrl('kubernetes')}/clusters`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        ...(idToken && { Authorization: `Bearer ${idToken}` }),
      },
    });

    return (await this.handleResponse(response)).items;
  }

  async proxy(options: {
    clusterName: string;
    path: string;
    init?: RequestInit;
  }): Promise<Response> {
    const { authProvider } = await this.getCluster(options.clusterName);
    const { token: k8sToken } = await this.getCredentials(authProvider);
    const url = `${await this.discoveryApi.getBaseUrl('kubernetes')}/proxy${
      options.path
    }`;
    const identityResponse = await this.identityApi.getCredentials();
    const headers = {
      ...options.init?.headers,
      [`Backstage-Kubernetes-Cluster`]: options.clusterName,
      ...(k8sToken && {
        [`Backstage-Kubernetes-Authorization`]: `Bearer ${k8sToken}`,
      }),
      ...(identityResponse.token && {
        Authorization: `Bearer ${identityResponse.token}`,
      }),
    };

    return await fetch(url, { ...options.init, headers });
  }
}
