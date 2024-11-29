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

import { ConfigReader } from '@backstage/config';
import { CodeOwnersProcessor } from './CodeOwnersProcessor';
import { LocationSpec } from '@backstage/plugin-catalog-common';
import { mockServices } from '@backstage/backend-test-utils';

const mockCodeOwnersText = () => `
*                   @acme/team-foo @acme/team-bar
/docs               @acme/team-docs
/plugins/catalog-*  @backstage/maintainers @backstage/catalog-core
**/logs             @logs-owner
`;

describe('CodeOwnersProcessor', () => {
  const mockLocation = ({
    basePath = '',
    type = 'url',
  } = {}): LocationSpec => ({
    type,
    target: `https://github.com/backstage/backstage/blob/master/${basePath}catalog-info.yaml`,
  });

  describe('preProcessEntity', () => {
    const setupTest = ({
      kind = 'Component',
      spec = {},
      metadata = {},
    } = {}) => {
      const entity = { kind, spec, metadata };
      const config = new ConfigReader({});
      const reader = {
        read: jest.fn(),
        readTree: jest.fn(),
        search: jest.fn(),
        readUrl: jest.fn().mockResolvedValue({
          buffer: jest.fn().mockResolvedValue(mockCodeOwnersText()),
        }),
      };
      const processor = CodeOwnersProcessor.fromConfig(config, {
        logger: mockServices.logger.mock(),
        reader,
      });

      return { entity, processor };
    };

    it('should not modify existing owner', async () => {
      const { entity, processor } = setupTest({
        spec: { owner: '@acme/foo-team' },
      });

      const result = await processor.preProcessEntity(
        entity as any,
        mockLocation(),
      );

      expect(result).toEqual(entity);
    });

    it('should ignore invalid locations type', async () => {
      const { entity, processor } = setupTest();

      const result = await processor.preProcessEntity(
        entity as any,
        mockLocation({ type: 'github-org' }),
      );

      expect(result).toEqual(entity);
    });

    it('should ignore invalid kinds', async () => {
      const { entity, processor } = setupTest({ kind: 'Group' });

      const result = await processor.preProcessEntity(
        entity as any,
        mockLocation(),
      );

      expect(result).toEqual(entity);
    });

    it('should set owner from codeowner', async () => {
      const { entity, processor } = setupTest();

      const result = await processor.preProcessEntity(
        entity as any,
        mockLocation(),
      );

      expect(result).toEqual({
        ...entity,
        spec: { owner: 'team-foo' },
      });
    });
    it('should match owner based on the targetUrl', async () => {
      const { entity, processor } = setupTest();

      const result = await processor.preProcessEntity(
        entity as any,
        mockLocation({ basePath: 'docs/' }),
      );

      expect(result).toEqual({
        ...entity,
        spec: { owner: 'team-docs' },
      });
    });
    it('should match wildcard pattern', async () => {
      const { entity, processor } = setupTest();

      const result = await processor.preProcessEntity(
        entity as any,
        mockLocation({ basePath: 'plugins/catalog-foo' }),
      );

      expect(result).toEqual({
        ...entity,
        spec: { owner: 'maintainers' },
      });
    });
    it('should match glob pattern', async () => {
      const { entity, processor } = setupTest();

      const result = await processor.preProcessEntity(
        entity as any,
        mockLocation({ basePath: 'plugins/catalog-foo/logs/1.txt' }),
      );

      expect(result).toEqual({
        ...entity,
        spec: { owner: 'User:logs-owner' },
      });
    });
  });
});
