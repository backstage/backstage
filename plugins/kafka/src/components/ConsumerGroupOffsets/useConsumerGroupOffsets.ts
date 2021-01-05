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

import { errorApiRef, useApi } from '@backstage/core';
import { useAsyncRetry } from 'react-use';
import { kafkaApiRef } from '../../api/KafkaApi';
import _ from 'lodash';

export function useConsumerGroupOffsets(groupId: string) {
  const api = useApi(kafkaApiRef);
  const errorApi = useApi(errorApiRef);

  const { loading, value: topics, retry } = useAsyncRetry(async () => {
    try {
      const groupOnlyOffsets = await api.fetchGroupOffsets(groupId);
      const topicOffsets = _.keyBy(
        await api.fetchTopicsOffsets(
          groupOnlyOffsets.map(value => value.topic),
        ),
        offsets => offsets.topic,
      );

      return groupOnlyOffsets.flatMap(value => {
        let topicPartitionOffsets = _.keyBy(
          topicOffsets[value.topic].partitions,
          partition => partition.id,
        );
        return value.partitions.map(partition => ({
          topic: value.topic,
          partitionId: partition.id,
          groupOffset: partition.offset,
          topicOffset: topicPartitionOffsets[partition.id].offset,
        }));
      });
    } catch (e) {
      errorApi.post(e);
      throw e;
    }
  }, [api, errorApi, groupId]);

  return [
    {
      loading,
      topics,
    },
    {
      retry,
    },
  ] as const;
}
