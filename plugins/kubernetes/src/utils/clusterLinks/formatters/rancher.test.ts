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
import { rancherFormatter } from './rancher';

describe('clusterLinks - aks formatter', () => {
  it('should return an url on the workloads when there is a namespace only', () => {
    expect(() =>
      rancherFormatter({
        dashboardUrl: new URL('https://k8s.foo.com'),
        object: {
          metadata: {
            name: 'foobar',
            namespace: 'bar',
          },
        },
        kind: 'Deployment',
      }),
    ).toThrowError('Rancher formatter is not yet implemented');
  });
});
