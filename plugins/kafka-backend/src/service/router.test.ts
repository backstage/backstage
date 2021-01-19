/*
 * Copyright 2020 Spotify AB
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

import request from 'supertest';
import express from 'express';
import { makeRouter } from './router';
import { getVoidLogger } from '@backstage/backend-common';
import { KafkaApi } from './KafkaApi';
import { when } from 'jest-when';

describe('router', () => {
  let app: express.Express;
  let kafkaApi: jest.Mocked<KafkaApi>;

  beforeAll(async () => {
    kafkaApi = {
      fetchTopicOffsets: jest.fn(),
      fetchGroupOffsets: jest.fn(),
    };

    const router = makeRouter(getVoidLogger(), kafkaApi);
    app = express().use(router);
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('get /consumer/:consumerId/offsets', () => {
    it('returns topic and group offsets', async () => {
      const topic1Offsets = [
        { id: 1, offset: '500' },
        { id: 2, offset: '1000' },
      ];
      const topic2Offsets = [{ id: 1, offset: '456' }];

      const groupOffsets = [
        {
          topic: 'topic1',
          partitions: [
            { id: 1, offset: '100' },
            { id: 2, offset: '213' },
          ],
        },
        {
          topic: 'topic2',
          partitions: [{ id: 1, offset: '456' }],
        },
      ];
      when(kafkaApi.fetchTopicOffsets)
        .calledWith('topic1')
        .mockResolvedValue(topic1Offsets);
      when(kafkaApi.fetchTopicOffsets)
        .calledWith('topic2')
        .mockResolvedValue(topic2Offsets);
      kafkaApi.fetchGroupOffsets.mockResolvedValue(groupOffsets);

      const response = await request(app).get('/consumer/hey/offsets');

      expect(response.status).toEqual(200);
      expect(response.body.consumerId).toEqual('hey');
      // Note the Set comparison here since there's no guarantee on the order of the elements in the list.
      expect(new Set(response.body.offsets)).toStrictEqual(
        new Set([
          {
            topic: 'topic1',
            partitionId: 1,
            groupOffset: '100',
            topicOffset: '500',
          },
          {
            topic: 'topic1',
            partitionId: 2,
            groupOffset: '213',
            topicOffset: '1000',
          },
          {
            topic: 'topic2',
            partitionId: 1,
            groupOffset: '456',
            topicOffset: '456',
          },
        ]),
      );
    });

    it('handles internal error correctly', async () => {
      kafkaApi.fetchGroupOffsets.mockRejectedValue(Error('oh no'));

      const response = await request(app).get('/consumer/hey/offsets');

      expect(response.status).toEqual(500);
    });
  });
});
