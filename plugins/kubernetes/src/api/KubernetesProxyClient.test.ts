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

import { KubernetesProxyClient } from './KubernetesProxyClient';

describe('KubernetesProxyClient', () => {
  let proxy: KubernetesProxyClient;
  const callProxyMock = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();
    proxy = new KubernetesProxyClient({
      kubernetesApi: {
        proxy: callProxyMock,
      } as any,
    });
  });
  it('/logs returns log text', async () => {
    const request = {
      podName: 'some-pod',
      namespace: 'some-namespace',
      clusterName: 'some-cluster',
      containerName: 'some-container',
    };

    callProxyMock.mockResolvedValue({
      text: jest.fn().mockResolvedValue('Hello World'),
      ok: true,
    });

    const response = await proxy.getPodLogs(request);
    await expect(response).toStrictEqual({ text: 'Hello World' });
    expect(callProxyMock).toHaveBeenCalledWith({
      clusterName: 'some-cluster',
      init: {
        method: 'GET',
      },
      path: '/api/v1/namespaces/some-namespace/pods/some-pod/log?container=some-container',
    });
  });
});
