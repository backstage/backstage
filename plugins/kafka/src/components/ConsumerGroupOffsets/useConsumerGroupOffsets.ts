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
import { kafkaApiRef } from '../../api/types';
import _ from 'lodash';

export function useConsumerGroupOffsets(groupId: string) {
  const api = useApi(kafkaApiRef);
  const errorApi = useApi(errorApiRef);

  const { loading, value: topics, retry } = useAsyncRetry(async () => {
    try {
      const groupOffsets = await api.getConsumerGroupOffsets(groupId);
      const groupWithTopicOffsets = await Promise.all(
        groupOffsets.map(async ({ topic, partitions }) => {
          const topicOffsets = _.keyBy(
            await api.getTopicOffsets(topic),
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
      return groupWithTopicOffsets.flat();
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
