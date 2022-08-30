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

import { setupRequestMockHandlers } from '@backstage/test-utils';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { StackOverflowClient } from './index';
import { StackOverflowQuestion } from '../types';
import { ConfigReader } from '@backstage/config';

const server = setupServer();

const backstageQuestions: StackOverflowQuestion[] = [
  {
    title: 'What is it?',
    link: 'https://example.com:9191/questions/1',
    tags: ['asdf'],
    owner: { who: 'me' },
    answer_count: 3,
  },
  {
    title: 'Is it?',
    link: 'https://example.com:9191/questions/2',
    tags: ['asdf'],
    owner: { who: 'me' },
    answer_count: 4,
  },
];

describe('StackOverflowClient', () => {
  setupRequestMockHandlers(server);

  const mockBaseUrl = 'https://example.com:9191';

  const setupHandlers = () => {
    server.use(
      rest.get(`${mockBaseUrl}/questions`, (req, res, ctx) => {
        return res(
          ctx.json({
            items:
              req.url.searchParams.get('tagged') === 'backstage'
                ? backstageQuestions
                : [],
          }),
        );
      }),
    );
  };

  it('list questions should return all questions', async () => {
    setupHandlers();
    const client = StackOverflowClient.fromConfig(
      new ConfigReader({
        stackoverflow: {
          baseUrl: 'https://example.com:9191',
        },
      }),
    );

    const responseQuestions = await client.listQuestions({
      requestParams: { tagged: 'backstage' },
    });
    expect(responseQuestions.length).toEqual(2);
    expect(responseQuestions).toEqual(backstageQuestions);
  });
});
