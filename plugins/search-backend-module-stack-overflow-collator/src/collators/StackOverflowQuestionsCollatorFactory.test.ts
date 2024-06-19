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
import {
  StackOverflowQuestionsCollatorFactory,
  StackOverflowQuestionsCollatorFactoryOptions,
} from './StackOverflowQuestionsCollatorFactory';
import {
  mockServices,
  setupRequestMockHandlers,
} from '@backstage/backend-test-utils';
import { TestPipeline } from '@backstage/plugin-search-backend-node';
import { ConfigReader } from '@backstage/config';
import { Readable } from 'stream';
import { setupServer } from 'msw/node';
import { rest } from 'msw';

const logger = mockServices.logger.mock();

const mockQuestion = {
  items: [
    {
      tags: ['backstage'],
      owner: {
        display_name: 'The Riddler',
      },
      answer_count: 1,
      link: 'https://stack.overflow.local/questions/2911',
      title: 'This is the first question',
    },
  ],
  has_more: false,
};

const mockOverrideQuestion = {
  items: [
    {
      tags: ['backstage'],
      owner: {
        display_name: 'The Riddler',
      },
      answer_count: 1,
      link: 'https://stack.overflow.local/questions/1',
      title: 'This is the first question',
    },
    {
      tags: ['backstage'],
      owner: {
        display_name: 'The Riddler',
      },
      answer_count: 1,
      link: 'https://stack.overflow.local/questions/2',
      title: 'this is another question',
    },
  ],
  has_more: false,
};

describe('StackOverflowQuestionsCollatorFactory', () => {
  const config = new ConfigReader({
    stackoverflow: {
      baseUrl: 'http://stack.overflow.local',
    },
  });

  const defaultOptions: StackOverflowQuestionsCollatorFactoryOptions = {
    logger,
    requestParams: {
      tagged: ['developer-portal'],
      pagesize: 100,
      order: 'desc',
      sort: 'activity',
    },
  };

  it('has expected type', () => {
    const factory = StackOverflowQuestionsCollatorFactory.fromConfig(
      config,
      defaultOptions,
    );
    expect(factory.type).toBe('stack-overflow');
  });

  describe('getCollator', () => {
    const worker = setupServer();
    setupRequestMockHandlers(worker);

    it('returns a readable stream', async () => {
      const factory = StackOverflowQuestionsCollatorFactory.fromConfig(
        config,
        defaultOptions,
      );
      const collator = await factory.getCollator();
      expect(collator).toBeInstanceOf(Readable);
    });

    it('fetches from the configured endpoint', async () => {
      worker.use(
        rest.get('http://stack.overflow.local/questions', (_, res, ctx) =>
          res(ctx.status(200), ctx.json(mockQuestion)),
        ),
      );
      const factory = StackOverflowQuestionsCollatorFactory.fromConfig(
        config,
        defaultOptions,
      );
      const collator = await factory.getCollator();
      const pipeline = TestPipeline.fromCollator(collator);
      const { documents } = await pipeline.execute();

      expect(documents).toHaveLength(mockQuestion.items.length);
    });

    it('fetches from the overridden endpoint', async () => {
      worker.use(
        rest.get('http://stack.overflow.override/questions', (_, res, ctx) =>
          res(ctx.status(200), ctx.json(mockOverrideQuestion)),
        ),
      );
      const factory = StackOverflowQuestionsCollatorFactory.fromConfig(config, {
        logger,
        baseUrl: 'http://stack.overflow.override',
        requestParams: defaultOptions.requestParams,
      });
      const collator = await factory.getCollator();

      const pipeline = TestPipeline.fromCollator(collator);
      const { documents } = await pipeline.execute();

      expect(documents).toHaveLength(mockOverrideQuestion.items.length);
    });

    it('uses API key when provided', async () => {
      worker.use(
        rest.get('http://stack.overflow.override/questions', (req, res, ctx) =>
          req.url.searchParams.get('key') === 'abcdefg'
            ? res(ctx.status(200), ctx.json(mockOverrideQuestion))
            : res(ctx.status(401), ctx.json({})),
        ),
      );
      const factory = StackOverflowQuestionsCollatorFactory.fromConfig(config, {
        logger,
        baseUrl: 'http://stack.overflow.override',
        apiKey: 'abcdefg',
        requestParams: defaultOptions.requestParams,
      });
      const collator = await factory.getCollator();

      const pipeline = TestPipeline.fromCollator(collator);
      const { documents } = await pipeline.execute();

      expect(documents).toHaveLength(mockOverrideQuestion.items.length);
    });

    it('uses teamName when provided', async () => {
      worker.use(
        rest.get('http://stack.overflow.override/questions', (req, res, ctx) =>
          req.url.searchParams.get('team') === 'abcdefg'
            ? res(ctx.status(200), ctx.json(mockOverrideQuestion))
            : res(ctx.status(401), ctx.json({})),
        ),
      );
      const factory = StackOverflowQuestionsCollatorFactory.fromConfig(config, {
        logger,
        baseUrl: 'http://stack.overflow.override',
        teamName: 'abcdefg',
        requestParams: defaultOptions.requestParams,
      });
      const collator = await factory.getCollator();

      const pipeline = TestPipeline.fromCollator(collator);
      const { documents } = await pipeline.execute();

      expect(documents).toHaveLength(mockOverrideQuestion.items.length);
    });
  });
});
