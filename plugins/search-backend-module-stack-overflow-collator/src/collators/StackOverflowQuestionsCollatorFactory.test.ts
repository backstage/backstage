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
  registerMswTestHooks,
} from '@backstage/backend-test-utils';
import { TestPipeline } from '@backstage/plugin-search-backend-node';
import { ConfigReader } from '@backstage/config';
import { Readable } from 'stream';
import { setupServer } from 'msw/node';
import { rest, RestRequest } from 'msw';

const logger = mockServices.logger.mock();

const BASE_URL = 'https://api.stackexchange.com/2.3';

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

const testSearchQuery = (
  request: RestRequest | undefined,
  expectedSearch: unknown,
) => {
  if (!request) {
    expect(request).not.toBeFalsy();
    return;
  }

  const executedSearch: { [key: string]: string } = {};
  request.url.searchParams.forEach((value: string, key: string) => {
    executedSearch[key] = value;
  });
  expect(executedSearch).toEqual(expectedSearch);
};

describe('StackOverflowQuestionsCollatorFactory using custom request params', () => {
  const config = new ConfigReader({
    stackoverflow: {
      baseUrl: 'http://stack.overflow.local',
    },
  });

  const optionsWithCustomRequestParams: StackOverflowQuestionsCollatorFactoryOptions =
    {
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
      optionsWithCustomRequestParams,
    );
    expect(factory.type).toBe('stack-overflow');
  });

  describe('Manage site query parameter', () => {
    const worker = setupServer();
    registerMswTestHooks(worker);

    it('uses site query parameter when provided and baseUrl is not default', async () => {
      let request;
      worker.use(
        rest.get('http://stack.overflow.local/questions', (req, res, ctx) => {
          request = req;

          return res(ctx.status(200), ctx.json(mockQuestion));
        }),
      );
      const factory = StackOverflowQuestionsCollatorFactory.fromConfig(config, {
        logger,
        baseUrl: 'http://stack.overflow.local',
        requestParams: {
          site: 'stackoverflow',
        },
      });

      const collator = await factory.getCollator();
      const pipeline = TestPipeline.fromCollator(collator);
      const { documents } = await pipeline.execute();
      const expectedSearch = {
        order: 'desc',
        site: 'stackoverflow',
        sort: 'activity',
        page: '1',
      };
      testSearchQuery(request, expectedSearch);
      expect(documents).toHaveLength(mockQuestion.items.length);
    });

    it('uses site query parameter when provided and baseUrl is default', async () => {
      let request;
      worker.use(
        rest.get(`${BASE_URL}/questions`, (req, res, ctx) => {
          request = req;

          return res(ctx.status(200), ctx.json(mockQuestion));
        }),
      );
      const factory = StackOverflowQuestionsCollatorFactory.fromConfig(config, {
        logger,
        baseUrl: BASE_URL,
        requestParams: {
          site: 'foo_bar_baz',
        },
      });

      const collator = await factory.getCollator();
      const pipeline = TestPipeline.fromCollator(collator);
      const { documents } = await pipeline.execute();
      const expectedSearch = {
        order: 'desc',
        site: 'foo_bar_baz',
        sort: 'activity',
        page: '1',
      };
      testSearchQuery(request, expectedSearch);
      expect(documents).toHaveLength(mockQuestion.items.length);
    });

    it('uses default when site is not provided and baseUrl is default', async () => {
      let request;
      worker.use(
        rest.get(`${BASE_URL}/questions`, (req, res, ctx) => {
          request = req;

          return res(ctx.status(200), ctx.json(mockQuestion));
        }),
      );
      const factory = StackOverflowQuestionsCollatorFactory.fromConfig(config, {
        logger,
        baseUrl: BASE_URL,
      });

      const collator = await factory.getCollator();
      const pipeline = TestPipeline.fromCollator(collator);
      const { documents } = await pipeline.execute();
      const expectedSearch = {
        order: 'desc',
        site: 'stackoverflow',
        sort: 'activity',
        page: '1',
      };
      testSearchQuery(request, expectedSearch);
      expect(documents).toHaveLength(mockQuestion.items.length);
    });
  });

  describe('getCollator', () => {
    const worker = setupServer();
    registerMswTestHooks(worker);

    it('returns a readable stream', async () => {
      const factory = StackOverflowQuestionsCollatorFactory.fromConfig(
        config,
        optionsWithCustomRequestParams,
      );
      const collator = await factory.getCollator();
      expect(collator).toBeInstanceOf(Readable);
    });

    it('fetches from the configured endpoint', async () => {
      let request;
      worker.use(
        rest.get('http://stack.overflow.local/questions', (req, res, ctx) => {
          request = req;

          return res(ctx.status(200), ctx.json(mockQuestion));
        }),
      );
      const factory = StackOverflowQuestionsCollatorFactory.fromConfig(
        config,
        optionsWithCustomRequestParams,
      );
      const collator = await factory.getCollator();
      const pipeline = TestPipeline.fromCollator(collator);
      const { documents } = await pipeline.execute();

      const expectedSearch = {
        order: 'desc',
        sort: 'activity',
        tagged: 'developer-portal',
        page: '1',
        pagesize: '100',
      };
      testSearchQuery(request, expectedSearch);
      expect(documents).toHaveLength(mockQuestion.items.length);
    });

    it('fetches from the overridden endpoint', async () => {
      let request;
      worker.use(
        rest.get(
          'http://stack.overflow.override/questions',
          (req, res, ctx) => {
            request = req;
            return res(ctx.status(200), ctx.json(mockOverrideQuestion));
          },
        ),
      );
      const factory = StackOverflowQuestionsCollatorFactory.fromConfig(config, {
        logger,
        baseUrl: 'http://stack.overflow.override',
        requestParams: optionsWithCustomRequestParams.requestParams,
      });
      const collator = await factory.getCollator();

      const pipeline = TestPipeline.fromCollator(collator);
      const { documents } = await pipeline.execute();

      const expectedSearch = {
        order: 'desc',
        sort: 'activity',
        tagged: 'developer-portal',
        page: '1',
        pagesize: '100',
      };
      testSearchQuery(request, expectedSearch);
      expect(documents).toHaveLength(mockOverrideQuestion.items.length);
    });

    it('uses API key when provided', async () => {
      let request;
      worker.use(
        rest.get(
          'http://stack.overflow.override/questions',
          (req, res, ctx) => {
            request = req;
            return req.url.searchParams.get('key') === 'abcdefg'
              ? res(ctx.status(200), ctx.json(mockOverrideQuestion))
              : res(ctx.status(401), ctx.json({}));
          },
        ),
      );
      const factory = StackOverflowQuestionsCollatorFactory.fromConfig(config, {
        logger,
        baseUrl: 'http://stack.overflow.override',
        apiKey: 'abcdefg',
        requestParams: optionsWithCustomRequestParams.requestParams,
      });
      const collator = await factory.getCollator();

      const pipeline = TestPipeline.fromCollator(collator);
      const { documents } = await pipeline.execute();

      const expectedSearch = {
        key: 'abcdefg',
        order: 'desc',
        sort: 'activity',
        tagged: 'developer-portal',
        page: '1',
        pagesize: '100',
      };
      testSearchQuery(request, expectedSearch);
      expect(documents).toHaveLength(mockOverrideQuestion.items.length);
    });

    it('uses teamName when provided', async () => {
      let request;
      worker.use(
        rest.get(
          'http://stack.overflow.override/questions',
          (req, res, ctx) => {
            request = req;
            return req.url.searchParams.get('team') === 'abcdefg'
              ? res(ctx.status(200), ctx.json(mockOverrideQuestion))
              : res(ctx.status(401), ctx.json({}));
          },
        ),
      );
      const factory = StackOverflowQuestionsCollatorFactory.fromConfig(config, {
        logger,
        baseUrl: 'http://stack.overflow.override',
        teamName: 'abcdefg',
        requestParams: optionsWithCustomRequestParams.requestParams,
      });
      const collator = await factory.getCollator();

      const pipeline = TestPipeline.fromCollator(collator);
      const { documents } = await pipeline.execute();

      const expectedSearch = {
        team: 'abcdefg',
        order: 'desc',
        sort: 'activity',
        tagged: 'developer-portal',
        page: '1',
        pagesize: '100',
      };
      testSearchQuery(request, expectedSearch);
      expect(documents).toHaveLength(mockOverrideQuestion.items.length);
    });
  });
});

describe('StackOverflowQuestionsCollatorFactory using default request params', () => {
  const config = new ConfigReader({
    stackoverflow: {
      baseUrl: BASE_URL,
    },
  });

  const optionsWithCustomRequestParams: StackOverflowQuestionsCollatorFactoryOptions =
    {
      logger,
    };

  it('has expected type', () => {
    const factory = StackOverflowQuestionsCollatorFactory.fromConfig(
      config,
      optionsWithCustomRequestParams,
    );
    expect(factory.type).toBe('stack-overflow');
  });

  describe('getCollator', () => {
    const worker = setupServer();
    registerMswTestHooks(worker);

    it('returns a readable stream', async () => {
      const factory = StackOverflowQuestionsCollatorFactory.fromConfig(
        config,
        optionsWithCustomRequestParams,
      );
      const collator = await factory.getCollator();
      expect(collator).toBeInstanceOf(Readable);
    });

    it('fetches from the configured endpoint', async () => {
      let request;
      worker.use(
        rest.get(`${BASE_URL}/questions`, (req, res, ctx) => {
          request = req;

          return res(ctx.status(200), ctx.json(mockQuestion));
        }),
      );
      const factory = StackOverflowQuestionsCollatorFactory.fromConfig(
        config,
        optionsWithCustomRequestParams,
      );
      const collator = await factory.getCollator();
      const pipeline = TestPipeline.fromCollator(collator);
      const { documents } = await pipeline.execute();

      const expectedSearch = {
        order: 'desc',
        site: 'stackoverflow',
        sort: 'activity',
        page: '1',
      };
      testSearchQuery(request, expectedSearch);
      expect(documents).toHaveLength(mockQuestion.items.length);
    });

    it('fetches from the overridden endpoint', async () => {
      let request;
      worker.use(
        rest.get(`${BASE_URL}/questions`, (req, res, ctx) => {
          request = req;
          return res(ctx.status(200), ctx.json(mockOverrideQuestion));
        }),
      );
      const factory = StackOverflowQuestionsCollatorFactory.fromConfig(config, {
        logger,
        baseUrl: BASE_URL,
        requestParams: optionsWithCustomRequestParams.requestParams,
      });
      const collator = await factory.getCollator();

      const pipeline = TestPipeline.fromCollator(collator);
      const { documents } = await pipeline.execute();

      const expectedSearch = {
        order: 'desc',
        site: 'stackoverflow',
        sort: 'activity',
        page: '1',
      };
      testSearchQuery(request, expectedSearch);
      expect(documents).toHaveLength(mockOverrideQuestion.items.length);
    });

    it('uses API key when provided', async () => {
      let request;
      worker.use(
        rest.get(`${BASE_URL}/questions`, (req, res, ctx) => {
          request = req;
          return req.url.searchParams.get('key') === 'abcdefg'
            ? res(ctx.status(200), ctx.json(mockOverrideQuestion))
            : res(ctx.status(401), ctx.json({}));
        }),
      );
      const factory = StackOverflowQuestionsCollatorFactory.fromConfig(config, {
        logger,
        baseUrl: BASE_URL,
        apiKey: 'abcdefg',
        requestParams: optionsWithCustomRequestParams.requestParams,
      });
      const collator = await factory.getCollator();

      const pipeline = TestPipeline.fromCollator(collator);
      const { documents } = await pipeline.execute();

      const expectedSearch = {
        key: 'abcdefg',
        order: 'desc',
        site: 'stackoverflow',
        sort: 'activity',
        page: '1',
      };
      testSearchQuery(request, expectedSearch);
      expect(documents).toHaveLength(mockOverrideQuestion.items.length);
    });

    it('uses teamName when provided', async () => {
      let request;
      worker.use(
        rest.get(`${BASE_URL}/questions`, (req, res, ctx) => {
          request = req;
          return req.url.searchParams.get('team') === 'abcdefg'
            ? res(ctx.status(200), ctx.json(mockOverrideQuestion))
            : res(ctx.status(401), ctx.json({}));
        }),
      );
      const factory = StackOverflowQuestionsCollatorFactory.fromConfig(config, {
        logger,
        baseUrl: BASE_URL,
        teamName: 'abcdefg',
        requestParams: optionsWithCustomRequestParams.requestParams,
      });
      const collator = await factory.getCollator();

      const pipeline = TestPipeline.fromCollator(collator);
      const { documents } = await pipeline.execute();

      const expectedSearch = {
        team: 'abcdefg',
        order: 'desc',
        site: 'stackoverflow',
        sort: 'activity',
        page: '1',
      };
      testSearchQuery(request, expectedSearch);
      expect(documents).toHaveLength(mockOverrideQuestion.items.length);
    });
  });
});
