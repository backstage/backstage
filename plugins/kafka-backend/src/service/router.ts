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

import express from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';
import { Config } from '@backstage/config';
import { KafkaApi } from './KafkaApi';

export interface RouterOptions {
  logger: Logger;
  config: Config;
}

export const makeRouter = (
  logger: Logger,
  kafkaApi: KafkaApi,
): express.Router => {
  const router = Router();
  router.use(express.json());

  router.get('/topic/:topicId/offsets', async (req, res) => {
    const topicId = req.params.topicId;
    try {
      const response = await kafkaApi.fetchTopicOffsets(topicId);
      res.send(response);
    } catch (e) {
      logger.error(`action=fetchTopicOffsets topicId=${topicId}, error=${e}`);
      res.status(500).send({ error: e.message });
    }
  });

  router.get('/consumer/:consumerId/offsets', async (req, res) => {
    const consumerId = req.params.consumerId;
    try {
      const response = await kafkaApi.fetchGroupOffsets(consumerId);
      res.send(response);
    } catch (e) {
      logger.error(
        `action=fetchGroupOffsets consumerId=${consumerId}, error=${e}`,
      );
      res.status(500).send({ error: e.message });
    }
  });

  return router;
};

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const logger = options.logger;

  logger.info('Initializing Kafka backend');

  const clientId = options.config.getString('kafka.clientId');
  const brokers = options.config.getStringArray('kafka.brokers');

  const kafkaApi = new KafkaApi(clientId, brokers, logger);

  return makeRouter(logger, kafkaApi);
}
