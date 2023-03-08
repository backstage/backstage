/*
 * Copyright 2022 The Backstage Authors
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

import { DefaultDocsPublishStrategy } from './DocsPublishStrategy';
import { ConfigReader } from '@backstage/config';
import { CompoundEntityRef } from '@backstage/catalog-model';

const MockedConfigReader = ConfigReader as jest.MockedClass<
  typeof ConfigReader
>;

jest.mock('@backstage/config');

describe('DefaultDocsPublishStrategy', () => {
  const entity = {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Component',
    metadata: {
      uid: '0',
      name: 'test',
    },
  };

  const config = new ConfigReader({});
  const expectedDefault: CompoundEntityRef = {
    name: entity.metadata.name,
    kind: entity.kind,
    namespace: 'default',
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('customEntityResolver', () => {
    it('should return the default entity', async () => {
      const defaultDocsPublishStrategy =
        DefaultDocsPublishStrategy.fromConfig(config);

      const result = await defaultDocsPublishStrategy.resolveEntityName({
        entity,
      });

      expect(result).toEqual(expectedDefault);
    });

    it('should return true when techdocs.alternateName is set', async () => {
      const defaultDocsPublishStrategy =
        DefaultDocsPublishStrategy.fromConfig(config);

      MockedConfigReader.prototype.getOptionalString.mockReturnValue('isset');

      const result = await defaultDocsPublishStrategy.usePublishStrategy({
        entity,
      });

      expect(result).toBe(true);
    });

    it('should return false when techdocs.alternateName is not set', async () => {
      const defaultDocsPublishStrategy =
        DefaultDocsPublishStrategy.fromConfig(config);

      MockedConfigReader.prototype.getOptionalString.mockReturnValue(undefined);

      const result = await defaultDocsPublishStrategy.usePublishStrategy({
        entity,
      });

      expect(result).toBe(false);
    });
  });
});
