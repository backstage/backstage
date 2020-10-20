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

import { DiscoveryApi } from '@backstage/core';
import { KubernetesApi } from './types';
import {
  AuthRequestBody,
  ObjectsByServiceIdResponse,
} from '@backstage/plugin-kubernetes-backend';
import { V1LabelSelector } from '@kubernetes/client-node';

export class KubernetesBackendClient implements KubernetesApi {
  private readonly discoveryApi: DiscoveryApi;

  constructor(options: { discoveryApi: DiscoveryApi }) {
    this.discoveryApi = options.discoveryApi;
  }

  private async getRequired(
    path: string,
    requestBody: AuthRequestBody,
  ): Promise<any> {
    const url = `${await this.discoveryApi.getBaseUrl('kubernetes')}${path}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const payload = await response.text();
      const message = `Request failed with ${response.status} ${response.statusText}, ${payload}`;
      throw new Error(message);
    }

    return await response.json();
  }

  private parseLabelSelector(params: V1LabelSelector): string {
    // TODO: figure out how to convert the selector to the full query param from the yaml
    //  (as shown here https://github.com/kubernetes/apimachinery/blob/master/pkg/labels/selector.go)
    const { matchLabels } = params;
    if (!matchLabels) {
      return '';
    }
    return Object.keys(matchLabels)
      .map(key => `${key}=${matchLabels[key.toString()]}`)
      .join(',');
  }

  async getObjectsByLabelSelector(
    serviceId: String,
    labelSelector: V1LabelSelector,
    requestBody: AuthRequestBody,
  ): Promise<ObjectsByServiceIdResponse> {
    const labelSelectorQueryParams = this.parseLabelSelector(labelSelector);
    return await this.getRequired(
      `/services/${serviceId}?labelSelector=${labelSelectorQueryParams}`,
      requestBody,
    );
  }
}
