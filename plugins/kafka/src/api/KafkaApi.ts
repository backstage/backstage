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

import { ConfigApi, DiscoveryApi, createApiRef } from '@backstage/core';
import { Kafka, SeekEntry } from 'kafkajs';

export const kafkaApiRef = createApiRef<KafkaApi>({
  id: 'plugin.kafka.service',
  description: 'Used by the Kafka plugin to connect to the Kafka cluster',
});

export type TopicOffsets = {
  topic: string;
  partitions: {
    id: number;
    offset: string;
  }[];
};

export class KafkaApi {
  static fromConfig(configApi: ConfigApi, discoveryApi: DiscoveryApi) {
    const clientId =
      configApi.getOptionalString('kafka.clientId') ?? 'kafka-backstage';
    const brokers = configApi.getOptionalStringArray('kafka.brokers') ?? [
      '/kafka/broker',
    ];

    return new KafkaApi(discoveryApi, clientId, brokers);
  }

  constructor(
    private readonly discoveryApi: DiscoveryApi,
    private readonly clientId: string,
    private readonly brokers: string[],
  ) {}

  async fetchTopicsOffsets(topics: string[]): Promise<Array<TopicOffsets>> {
    const admin = await this.getAdmin();

    await admin.connect();
    try {
      return await Promise.all(
        topics.map(async topic =>
          admin
            .fetchTopicOffsets(topic)
            .then(result => KafkaApi.toTopicOffsets(topic, result)),
        ),
      );
    } finally {
      await admin.disconnect();
    }
  }

  async fetchGroupOffsets(groupId: string): Promise<Array<TopicOffsets>> {
    const admin = await this.getAdmin();

    await admin.connect();
    try {
      let groupOffsets = [
        {
          topic: 'shula',
          partitions: await admin.fetchOffsets({ groupId, topic: 'shula' }),
        },
        {
          topic: 'test',
          partitions: await admin.fetchOffsets({ groupId, topic: 'test' }),
        },
      ];

      return groupOffsets.map(topicOffset =>
        KafkaApi.toTopicOffsets(topicOffset.topic, topicOffset.partitions),
      );
    } finally {
      await admin.disconnect();
    }
  }

  private async getAdmin() {
    const kafka = await this.getKafka();
    return kafka.admin();
  }

  private async getKafka() {
    const proxyUrl = await this.discoveryApi.getBaseUrl('proxy');

    return new Kafka({
      clientId: this.clientId,
      brokers: this.brokers.map(brokerUrl => proxyUrl + brokerUrl),
    });
  }

  private static toTopicOffsets(topic: string, result: Array<SeekEntry>) {
    const partitions = result.map(seekEntry => ({
      id: seekEntry.partition,
      offset: seekEntry.offset,
    }));
    return { topic, partitions };
  }
}
