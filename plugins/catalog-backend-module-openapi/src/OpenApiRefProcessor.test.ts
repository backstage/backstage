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

import { LocationSpec } from '@backstage/plugin-catalog-common';
import { OpenApiRefProcessor } from './OpenApiRefProcessor';
import { bundleFileWithRefs } from './lib';
import { mockServices } from '@backstage/backend-test-utils';

jest.mock('./lib', () => ({
  bundleFileWithRefs: jest.fn(),
}));

const bundled = '<bundled-specification>';

describe('OpenApiRefProcessor', () => {
  const mockLocation = (): LocationSpec => ({
    type: 'url',
    target: `https://github.com/owner/repo/blob/main/catalog-info.yaml`,
  });

  beforeEach(() => {
    (bundleFileWithRefs as any).mockResolvedValue(bundled);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('preProcessEntity', () => {
    const setupTest = ({ kind = 'API', spec = {} } = {}) => {
      const entity = {
        kind,
        spec: { definition: '<openapi-definition>', ...spec },
      };
      const config = mockServices.rootConfig();
      const reader = mockServices.urlReader.mock();
      const processor = OpenApiRefProcessor.fromConfig(config, {
        logger: mockServices.logger.mock(),
        reader,
      });

      return { entity, processor };
    };

    it('should bundle OpenAPI specifications', async () => {
      const { entity, processor } = setupTest({
        kind: 'API',
        spec: { type: 'openapi' },
      });

      const result = await processor.preProcessEntity(
        entity as any,
        mockLocation(),
      );

      expect(result.spec?.definition).toEqual(bundled);
    });

    it('should ignore other kinds', async () => {
      const { entity, processor } = setupTest({ kind: 'Group' });

      const result = await processor.preProcessEntity(
        entity as any,
        mockLocation(),
      );

      expect(result).toEqual(entity);
    });

    it('should ignore other specification types', async () => {
      const { entity, processor } = setupTest({
        kind: 'API',
        spec: { type: 'asyncapi' },
      });

      const result = await processor.preProcessEntity(
        entity as any,
        mockLocation(),
      );

      expect(result).toEqual(entity);
    });
  });
});
