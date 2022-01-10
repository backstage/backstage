/*
 * Copyright 2021 The Backstage Authors
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
import { TfCloudReaderProcessor } from './TerraformCloudProcessor';
import { ConfigReader } from '@backstage/config';
import { getVoidLogger } from '@backstage/backend-common';

const mockConfig = new ConfigReader({
  backend: { reading: { allow: [{ host: 'localhost' }] } },
});
const location = { type: 'tf-cloud', target: 'test-target' };

describe('TerraformCloudProcessor', () => {
  describe('readLocation', () => {
    const processor = new TfCloudReaderProcessor(mockConfig, getVoidLogger());

    const emit = jest.fn();
    const fetchModuleData = jest.fn();
    const fetchResourceData = jest.fn();

    processor.fetchModuleData = fetchModuleData;
    processor.fetchResourceData = fetchResourceData;
    afterEach(() => jest.resetAllMocks());

    it('generates component entities for modules', async () => {
      fetchModuleData.mockImplementation(() => {
        return {
          data: [
            {
              attributes: {
                'version-statuses': [
                  {
                    version: '1.0.1',
                  },
                ],
                name: 'test-module',
              },
            },
          ],
        };
      });

      fetchResourceData.mockImplementation(() => {
        return {
          root: {
            resources: [
              {
                name: 's3-test',
                type: 'aws_s3',
              },
            ],
          },
        };
      });
      await processor.readLocation(location, false, emit);
      expect(emit).toBeCalledTimes(3);
      expect(emit).toBeCalledWith({
        type: 'entity',
        location: {
          type: 'tf-cloud',
          target: 'test-target',
        },
        entity: {
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'Component',
          metadata: {
            name: 'test-module',
            namespace: 'default',
            tags: ['v1-0-1'],
          },
          spec: {
            owner: 'cloud-services',
            dependsOn: ['Resource:s3-test'],
            lifecycle: 'production',
            type: 'infrastructure-module',
          },
        },
      });
      expect(emit).toBeCalledWith({
        type: 'entity',
        location: {
          type: 'tf-cloud',
          target: 'test-target',
        },
        entity: {
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'Resource',
          metadata: {
            name: 's3-test',
            tags: ['undefined', 'test-module-tf-module'],
          },
          spec: {
            dependencyOf: ['Component:test-module'],
            owner: 'cloud-services',
            type: 'aws_s3',
          },
        },
      });

      expect(emit).toBeCalledWith({
        type: 'entity',
        location: {
          type: 'tf-cloud',
          target: 'test-target',
        },
        entity: {
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'Component',
          metadata: {
            name: 'test-module',
            namespace: 'default',
            tags: ['v1-0-1'],
          },
          spec: {
            owner: 'cloud-services',
            dependsOn: ['Resource:s3-test'],
            lifecycle: 'production',
            type: 'infrastructure-module',
          },
        },
      });
    });
  });
});
