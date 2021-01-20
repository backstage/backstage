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
import { KafkaApi, KafkaJsApiImpl } from './KafkaApi';
import _ from 'lodash';
import { ConnectionOptions } from 'tls';

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

  router.get('/consumer/:consumerId/offsets', async (req, res) => {
    const consumerId = req.params.consumerId;

    logger.debug(`Fetch consumer group ${consumerId} offsets`);

    const groupOffsets = await kafkaApi.fetchGroupOffsets(consumerId);

    const groupWithTopicOffsets = await Promise.all(
      groupOffsets.map(async ({ topic, partitions }) => {
        const topicOffsets = _.keyBy(
          await kafkaApi.fetchTopicOffsets(topic),
          partition => partition.id,
        );

        return partitions.map(partition => ({
          topic: topic,
          partitionId: partition.id,
          groupOffset: partition.offset,
          topicOffset: topicOffsets[partition.id].offset,
        }));
      }),
    );
    res.send({ consumerId, offsets: groupWithTopicOffsets.flat() });
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

  const sslConfig = options.config.getOptional('kafka.ssl');
  const ssl = sslConfig ? (sslConfig as ConnectionOptions) : undefined;

  const kafkaApi = new KafkaJsApiImpl({ clientId, brokers, logger, ssl });

  return makeRouter(logger, kafkaApi);
}
