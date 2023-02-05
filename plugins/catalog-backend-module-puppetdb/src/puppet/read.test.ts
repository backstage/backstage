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

import { readPuppetNodes } from './read';
import {
  DEFAULT_PROVIDER_ID,
  PuppetDBEntityProviderConfig,
} from '../providers';
import { DEFAULT_NAMESPACE } from '@backstage/catalog-model';
import fetch from 'node-fetch';
import { ANNOTATION_PUPPET_CERTNAME, ENDPOINT_FACTSETS } from './constants';

jest.mock('node-fetch', () => {
  const original = jest.requireActual('node-fetch');
  return {
    __esModule: true,
    default: jest.fn(),
    Headers: original.Headers,
  };
});
(global as any).fetch = fetch;

describe('readPuppetNodes', () => {
  const mockFetch = fetch as unknown as jest.Mocked<any>;

  describe('where no query is specified', () => {
    const config: PuppetDBEntityProviderConfig = {
      host: 'https://puppetdb',
      id: DEFAULT_PROVIDER_ID,
    };

    beforeEach(async () => {
      mockFetch.mockReturnValueOnce(
        Promise.resolve(
          new Response(
            JSON.stringify([
              {
                certname: 'node1',
                timestamp: 'time1',
                hash: 'hash1',
                producer_timestamp: 'producer_time1',
                producer: 'producer1',
                environment: 'environment1',
                facts: {
                  data: [
                    {
                      name: 'is_virtual',
                      value: true,
                    },
                    {
                      name: 'kernel',
                      value: 'Linux',
                    },
                    {
                      name: 'ipaddress',
                      value: 'ipaddress1',
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
              },
              {
                certname: 'node2',
                timestamp: 'time2',
                hash: 'hash2',
                producer_timestamp: 'producer_time2',
                producer: 'producer2',
                environment: 'environment2',
                facts: {
                  data: [
                    {
                      name: 'is_virtual',
                      value: false,
                    },
                    {
                      name: 'kernel',
                      value: 'Windows',
                    },
                    {
                      name: 'ipaddress',
                      value: 'ipaddress2',
                    },
                    {
                      name: 'clientnoop',
                      value: false,
                    },
                    {
                      name: 'clientversion',
                      value: 'clientversion2',
                    },
                  ],
                },
              },
            ]),
          ),
        ),
      );
    });

    describe('where custom transformer is used', () => {
      it('should use it for transforming puppet nodes', async () => {
        const entities = await readPuppetNodes(config, {
          transformer: async (node, _config) => {
            return {
              apiVersion: 'backstage.io/v1beta1',
              kind: 'Resource',
              metadata: {
                name: `custom-${node.certname}`,
                namespace: DEFAULT_NAMESPACE,
              },
              spec: {
                type: 'Custom',
                owner: 'Custom',
                dependsOn: [],
                dependencyOf: [],
              },
            };
          },
        });

        expect(entities).toHaveLength(2);
        expect(entities[0]).toEqual({
          apiVersion: 'backstage.io/v1beta1',
          kind: 'Resource',
          metadata: {
            name: 'custom-node1',
            namespace: DEFAULT_NAMESPACE,
          },
          spec: {
            type: 'Custom',
            owner: 'Custom',
            dependsOn: [],
            dependencyOf: [],
          },
        });
        expect(entities[1]).toEqual({
          apiVersion: 'backstage.io/v1beta1',
          kind: 'Resource',
          metadata: {
            name: 'custom-node2',
            namespace: DEFAULT_NAMESPACE,
          },
          spec: {
            type: 'Custom',
            owner: 'Custom',
            dependsOn: [],
            dependencyOf: [],
          },
        });
      });
    });

    describe('where default transformer is used', () => {
      it('should use it for transforming puppet nodes', async () => {
        const entities = await readPuppetNodes(config);

        expect(entities).toHaveLength(2);
        expect(entities[0].metadata.annotations).toEqual({
          [ANNOTATION_PUPPET_CERTNAME]: 'node1',
        });
        expect(entities[1].metadata.annotations).toEqual({
          [ANNOTATION_PUPPET_CERTNAME]: 'node2',
        });
      });
    });
  });

  describe('where query is specified', () => {
    const config: PuppetDBEntityProviderConfig = {
      host: 'https://puppetdb',
      id: DEFAULT_PROVIDER_ID,
      query: '["=", "certname", "node1"]',
    };

    describe('where no results are matched', () => {
      beforeEach(async () => {
        mockFetch.mockReturnValueOnce(
          Promise.resolve(new Response(JSON.stringify([]))),
        );
      });

      it('should return empty array', async () => {
        const entities = await readPuppetNodes(config);
        expect(entities).toHaveLength(0);
      });
    });

    describe('where results are matched', () => {
      beforeEach(async () => {
        mockFetch.mockReturnValueOnce(
          Promise.resolve(
            new Response(
              JSON.stringify([
                {
                  certname: 'node1',
                  timestamp: 'time1',
                  hash: 'hash1',
                  producer_timestamp: 'producer_time1',
                  producer: 'producer1',
                  environment: 'environment1',
                },
              ]),
            ),
          ),
        );
      });

      it('should return matched results', async () => {
        const entities = await readPuppetNodes(config);
        expect(mockFetch).toHaveBeenCalledWith(
          `${config.host}${ENDPOINT_FACTSETS}?query=%5B%22%3D%22%2C+%22certname%22%2C+%22node1%22%5D`,
          {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            method: 'GET',
          },
        );
        expect(entities).toHaveLength(1);
      });
    });
  });
});
