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
  PuppetDbEntityProviderConfig,
} from '../providers';
import { DEFAULT_NAMESPACE } from '@backstage/catalog-model';
import { setupRequestMockHandlers } from '@backstage/backend-test-utils';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { ANNOTATION_PUPPET_CERTNAME, ENDPOINT_NODES } from './constants';

describe('readPuppetNodes', () => {
  const worker = setupServer();
  setupRequestMockHandlers(worker);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('where no query is specified', () => {
    const config: PuppetDbEntityProviderConfig = {
      baseUrl: 'https://puppetdb',
      id: DEFAULT_PROVIDER_ID,
    };

    beforeEach(async () => {
      worker.use(
        rest.get(`${config.baseUrl}/${ENDPOINT_NODES}`, (_req, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.set('Content-Type', 'application/json'),
            ctx.json([
              {
                deactivated: null,
                latest_report_hash: '7d79424a1caba14ff1f1b72ac8d76e2abd9dd981',
                facts_environment: 'production',
                cached_catalog_status: 'not_used',
                report_environment: 'production',
                latest_report_corrective_change: null,
                catalog_environment: 'production',
                facts_timestamp: '2024-06-13T19:08:52.298Z',
                latest_report_noop: false,
                expired: null,
                latest_report_noop_pending: false,
                report_timestamp: '2024-06-13T19:09:09.690Z',
                certname: 'node1',
                catalog_timestamp: '2024-06-13T19:08:58.291Z',
                latest_report_job_id: null,
                latest_report_status: 'changed',
              },
              {
                deactivated: null,
                latest_report_hash: '369615c7eb2969bf16f493577a7816e9264164e7',
                facts_environment: 'production',
                cached_catalog_status: 'not_used',
                report_environment: 'production',
                latest_report_corrective_change: null,
                catalog_environment: 'production',
                facts_timestamp: '2024-06-13T19:13:27.789Z',
                latest_report_noop: false,
                expired: null,
                latest_report_noop_pending: false,
                report_timestamp: '2024-06-13T19:13:52.969Z',
                certname: 'node2',
                catalog_timestamp: '2024-06-13T19:13:34.411Z',
                latest_report_job_id: null,
                latest_report_status: 'changed',
              },
            ]),
          );
        }),
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
    const config: PuppetDbEntityProviderConfig = {
      baseUrl: 'https://puppetdb',
      id: DEFAULT_PROVIDER_ID,
      query: '["=", "certname", "node1"]',
    };

    describe('where no results are matched', () => {
      beforeEach(async () => {
        worker.use(
          rest.get(`${config.baseUrl}/${ENDPOINT_NODES}`, (_req, res, ctx) => {
            return res(
              ctx.status(200),
              ctx.set('Content-Type', 'application/json'),
              ctx.json([]),
            );
          }),
        );
      });

      it('should return empty array', async () => {
        const entities = await readPuppetNodes(config);
        expect(entities).toHaveLength(0);
      });
    });

    describe('where results are matched', () => {
      beforeEach(async () => {
        worker.use(
          rest.get(`${config.baseUrl}/${ENDPOINT_NODES}`, (_req, res, ctx) => {
            return res(
              ctx.status(200),
              ctx.set('Content-Type', 'application/json'),
              ctx.json([
                {
                  deactivated: null,
                  latest_report_hash:
                    '7d79424a1caba14ff1f1b72ac8d76e2abd9dd981',
                  facts_environment: 'production',
                  cached_catalog_status: 'not_used',
                  report_environment: 'production',
                  latest_report_corrective_change: null,
                  catalog_environment: 'production',
                  facts_timestamp: '2024-06-13T19:08:52.298Z',
                  latest_report_noop: false,
                  expired: null,
                  latest_report_noop_pending: false,
                  report_timestamp: '2024-06-13T19:09:09.690Z',
                  certname: 'node1',
                  catalog_timestamp: '2024-06-13T19:08:58.291Z',
                  latest_report_job_id: null,
                  latest_report_status: 'changed',
                },
              ]),
            );
          }),
        );
      });

      it('should return matched results', async () => {
        const entities = await readPuppetNodes(config);
        expect(entities).toHaveLength(1);
      });
    });
  });
});
