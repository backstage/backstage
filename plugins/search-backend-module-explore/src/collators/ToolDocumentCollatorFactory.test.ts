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

import { TestPipeline } from '@backstage/plugin-search-backend-node';
import {
  mockServices,
  registerMswTestHooks,
} from '@backstage/backend-test-utils';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { Readable } from 'stream';
import { ToolDocumentCollatorFactory } from './ToolDocumentCollatorFactory';

const logger = mockServices.logger.mock();

const mockTools = {
  tools: [
    {
      title: 'tool1',
      description: 'tool 1 description',
      url: 'https://some-url.com',
      image: 'https://some-url.com/image.png',
      tags: ['one'],
    },
    {
      title: 'tool2',
      description: 'tool 2 description',
      url: 'https://some-url.com',
      image: 'https://some-url.com/image.png',
      tags: ['two'],
    },
    {
      title: 'tool3',
      description: 'tool 3 description',
      url: 'https://some-url.com',
      image: 'https://some-url.com/image.png',
      tags: ['three'],
    },
  ],
};

describe('ToolDocumentCollatorFactory', () => {
  const config = mockServices.rootConfig();
  const mockDiscoveryApi = mockServices.discovery.mock({
    getBaseUrl: async () => 'http://test-backend/api/explore',
  });

  const options = {
    discovery: mockDiscoveryApi,
    logger,
  };

  it('has expected type', () => {
    const factory = ToolDocumentCollatorFactory.fromConfig(config, options);
    expect(factory.type).toBe('tools');
  });

  describe('getCollator', () => {
    let factory: ToolDocumentCollatorFactory;
    let collator: Readable;

    const worker = setupServer();
    registerMswTestHooks(worker);

    beforeEach(async () => {
      factory = ToolDocumentCollatorFactory.fromConfig(config, options);
      collator = await factory.getCollator();

      worker.use(
        rest.get('http://test-backend/api/explore/tools', (_, res, ctx) =>
          res(ctx.status(200), ctx.json(mockTools)),
        ),
      );
    });

    it('returns a readable stream', async () => {
      expect(collator).toBeInstanceOf(Readable);
    });

    it('runs against mock tools', async () => {
      const pipeline = TestPipeline.fromCollator(collator);
      const { documents } = await pipeline.execute();
      expect(mockDiscoveryApi.getBaseUrl).toHaveBeenCalledWith('explore');
      expect(documents).toHaveLength(mockTools.tools.length);
    });

    it('non-authenticated backend', async () => {
      factory = ToolDocumentCollatorFactory.fromConfig(config, {
        discovery: mockDiscoveryApi,
        logger,
      });
      collator = await factory.getCollator();

      const pipeline = TestPipeline.fromCollator(collator);
      const { documents } = await pipeline.execute();

      expect(mockDiscoveryApi.getBaseUrl).toHaveBeenCalledWith('explore');
      expect(documents).toHaveLength(mockTools.tools.length);
    });
  });
});
