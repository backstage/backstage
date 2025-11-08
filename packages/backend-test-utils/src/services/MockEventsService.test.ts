/*
 * Copyright 2025 The Backstage Authors
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

import { MockEventsService } from './MockEventsService';

describe('MockEventsService', () => {
  it('notifies subscribers', async () => {
    const service = new MockEventsService();

    const listener1 = jest.fn();
    const listener2 = jest.fn();

    await service.subscribe({
      id: 'a',
      topics: ['topic1'],
      onEvent: listener1,
    });
    await service.subscribe({
      id: 'b',
      topics: ['topic1', 'topic2'],
      onEvent: listener2,
    });

    expect(listener1).not.toHaveBeenCalled();
    expect(listener2).not.toHaveBeenCalled();

    await service.publish({
      topic: 'topic1',
      eventPayload: { payload: 1 },
    });

    expect(listener1).toHaveBeenCalledTimes(1);
    expect(listener2).toHaveBeenCalledTimes(1);

    await service.publish({
      topic: 'topic2',
      eventPayload: { payload: 1 },
    });

    expect(listener1).toHaveBeenCalledTimes(1);
    expect(listener2).toHaveBeenCalledTimes(2);
  });
});
