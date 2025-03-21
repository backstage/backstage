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

import { EksClusterLinksFormatter } from './EksClusterLinksFormatter';

describe('clusterLinks - EKS formatter', () => {
  const formatter = new EksClusterLinksFormatter();
  it('should return an url on the workloads when there is a namespace only', async () => {
    await expect(
      formatter.formatClusterLink({
        dashboardUrl: new URL('https://k8s.foo.com'),
        object: {
          metadata: {
            name: 'foobar',
            namespace: 'bar',
          },
        },
        kind: 'Deployment',
      }),
    ).rejects.toThrow(
      'EKS formatter is not yet implemented. Please, contribute!',
    );
  });
});
