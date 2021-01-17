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

import React from 'react';
import { renderInTestApp } from '@backstage/test-utils';
import { ConsumerGroupOffsets } from './ConsumerGroupOffsets';

describe('ConsumerGroupOffsets', () => {
  it('should render consumer group table', async () => {
    const rendered = await renderInTestApp(
      <ConsumerGroupOffsets
        consumerGroup="consumer"
        topics={[
          {
            topic: 'topic1',
            partitionId: 1,
            topicOffset: '100',
            groupOffset: '50',
          },
          {
            topic: 'topic2',
            partitionId: 1,
            topicOffset: '2340',
            groupOffset: '1234',
          },
        ]}
        loading={false}
        retry={() => {}}
      />,
    );

    expect(rendered.getByText(/consumer/)).toBeInTheDocument();
    expect(rendered.getByText('topic1')).toBeInTheDocument();
    expect(rendered.getByText('topic2')).toBeInTheDocument();
  });
});
