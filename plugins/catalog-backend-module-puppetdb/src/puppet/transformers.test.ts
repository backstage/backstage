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

import { PuppetDbEntityProviderConfig } from '../providers';
import { PuppetNode } from './types';
import { defaultResourceTransformer } from './transformers';
import { DEFAULT_NAMESPACE } from '@backstage/catalog-model';
import { ANNOTATION_PUPPET_CERTNAME, DEFAULT_ENTITY_OWNER } from './constants';

describe('defaultResourceTransformer', () => {
  it('should transform a puppet node to a resource entity', async () => {
    const config: PuppetDbEntityProviderConfig = {
      baseUrl: '',
      id: '',
    };
    const node: PuppetNode = {
      certname: 'node1',
      timestamp: 'time1',
      hash: 'hash1',
      producer_timestamp: 'producer_time1',
      producer: 'producer1',
      environment: 'environment1',
      latest_report_status: 'unchanged',
      facts: {
        href: 'facts1',
        data: [
          {
            name: 'kernel',
            value: 'Linux',
          },
          {
            name: 'ipaddress',
            value: 'ipaddress1',
          },
          {
            name: 'is_virtual',
            value: true,
          },
          {
            name: 'clientnoop',
            value: true,
          },
          {
            name: 'clientversion',
            value: 'clientversion1',
          },
        ],
      },
    };

    const entity = await defaultResourceTransformer(node, config);
    expect(entity).toEqual({
      apiVersion: 'backstage.io/v1beta1',
      kind: 'Resource',
      metadata: {
        name: 'node1',
        namespace: DEFAULT_NAMESPACE,
        annotations: {
          [ANNOTATION_PUPPET_CERTNAME]: 'node1',
        },
        description: 'ipaddress1',
        tags: ['linux', 'unchanged'],
      },
      spec: {
        type: 'virtual-machine',
        owner: DEFAULT_ENTITY_OWNER,
        dependsOn: [],
        dependencyOf: [],
      },
    });
  });
});
