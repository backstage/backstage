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

import { createDeferred } from '@backstage/types';
import { DefaultCatalogScmEventsService } from './DefaultCatalogScmEventsService';

describe('DefaultCatalogScmEventsService', () => {
  it('should publish and subscribe to events', async () => {
    const service = new DefaultCatalogScmEventsService();

    const subscriber1 = {
      onEvents: jest.fn(),
    };
    const subscriber2 = {
      onEvents: jest.fn(),
    };

    service.subscribe(subscriber1);
    service.subscribe(subscriber2);

    await service.publish([
      {
        type: 'location.created',
        url: 'https://github.com/backstage/backstage',
      },
    ]);

    expect(subscriber1.onEvents).toHaveBeenCalledWith([
      {
        type: 'location.created',
        url: 'https://github.com/backstage/backstage',
      },
    ]);
    expect(subscriber2.onEvents).toHaveBeenCalledWith([
      {
        type: 'location.created',
        url: 'https://github.com/backstage/backstage',
      },
    ]);
  });

  it('waits for all subscribers to acknowledge the events', async () => {
    const service = new DefaultCatalogScmEventsService();

    const work1 = createDeferred<void>();
    const work2 = createDeferred<void>();

    const subscriber1 = {
      onEvents: jest.fn().mockImplementation(async () => {
        await work1;
      }),
    };
    const subscriber2 = {
      onEvents: jest.fn().mockImplementation(async () => {
        await work2;
      }),
    };

    service.subscribe(subscriber1);
    service.subscribe(subscriber2);

    let completed = false;
    service
      .publish([
        {
          type: 'location.created',
          url: 'https://github.com/backstage/backstage',
        },
      ])
      .then(() => {
        completed = true;
      });

    await new Promise(resolve => setTimeout(resolve, 0));

    expect(completed).toBe(false);
    expect(subscriber1.onEvents).toHaveBeenCalled();
    expect(subscriber2.onEvents).toHaveBeenCalled();

    work1.resolve();

    await new Promise(resolve => setTimeout(resolve, 0));

    expect(completed).toBe(false);

    work2.resolve();

    await new Promise(resolve => setTimeout(resolve, 0));

    expect(completed).toBe(true);
  });
});
