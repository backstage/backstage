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

  async getPodLogs({
    podName,
    namespace,
    clusterName,
    containerName,
  }: {
    podName: string;
    namespace: string;
    clusterName: string;
    containerName: string;
  }): Promise<string> {
    const params = new URLSearchParams({
      container: containerName,
    });
    return await this.kubernetesApi
      .proxy({
        clusterName: clusterName,
        path: `/api/v1/namespaces/${namespace}/pods/${podName}/log?${params.toString()}`,
        init: {
          method: 'GET',
        },
      })
      .then(response => this.handleText(response));
  }
}
