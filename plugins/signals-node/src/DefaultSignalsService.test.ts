/*
 * Copyright 2024 The Backstage Authors
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
import { DefaultSignalsService } from './DefaultSignalsService';
import { SignalPayload } from './types';

describe('DefaultSignalsService', () => {
  const mockEvents = {
    publish: jest.fn(),
    subscribe: jest.fn(),
  };

  const service = DefaultSignalsService.create({ events: mockEvents });

  it('should publish signal', () => {
    const signal: SignalPayload = {
      channel: 'test-channel',
      recipients: { type: 'broadcast' },
      message: { msg: 'hello world' },
    };
    service.publish(signal);
    expect(mockEvents.publish).toHaveBeenCalledWith({
      topic: 'signals',
      eventPayload: signal,
    });
  });
});
