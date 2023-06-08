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
import { KubernetesApi } from './types';
import { Event } from 'kubernetes-models/v1';

/**
 * A client for common requests through the proxy endpoint of the kubernetes backend plugin.
 *
 * @public
 */
export class KubernetesProxyClient {
  private readonly kubernetesApi: KubernetesApi;

  constructor(options: { kubernetesApi: KubernetesApi }) {
    this.kubernetesApi = options.kubernetesApi;
  }

  private async handleText(response: Response): Promise<string> {
    if (!response.ok) {
      const payload = await response.text();
      let message;
      switch (response.status) {
        default:
          message = `Proxy request failed with ${response.status} ${response.statusText}, ${payload}`;
      }
      throw new Error(message);
    }

    return await response.text();
  }

  private async handleJson(response: Response): Promise<any> {
    if (!response.ok) {
      const payload = await response.text();
      let message = `Request failed with ${response.status} ${response.statusText}, ${payload}`;
      switch (response.status) {
        case 404:
          message = `Proxy request failed with ${response.status} ${response.statusText}, ${payload}`;
          break;
        default:
          message = `Request failed with ${response.status} ${response.statusText}, ${payload}`;
      }
      throw new Error(message);
    }

    return await response.json();
  }

  async getEventsByInvolvedObjectName({
    clusterName,
    involvedObjectName,
    namespace,
  }: {
    clusterName: string;
    involvedObjectName: string;
    namespace: string;
  }): Promise<Event[]> {
    return await this.kubernetesApi
      .proxy({
        clusterName,
        path: `/api/v1/namespaces/${namespace}/events?fieldSelector=involvedObject.name=${involvedObjectName}`,
        init: {
          method: 'GET',
        },
      })
      .then(response => this.handleJson(response))
      .then(eventList => eventList.items);
  }

  async getPodLogs({
    podName,
    namespace,
    clusterName,
    containerName,
    previous,
  }: {
    podName: string;
    namespace: string;
    clusterName: string;
    containerName: string;
    previous?: boolean;
  }): Promise<{ text: string }> {
    const params = new URLSearchParams({
      container: containerName,
    });
    if (previous) {
      params.append('previous', '');
    }
    return await this.kubernetesApi
      .proxy({
        clusterName: clusterName,
        path: `/api/v1/namespaces/${namespace}/pods/${podName}/log?${params.toString()}`,
        init: {
          method: 'GET',
        },
      })
      .then(response => this.handleText(response))
      .then(text => ({ text }));
  }
}
