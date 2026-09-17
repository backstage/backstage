/*
 * Copyright 2020 The Backstage Authors
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

import { runWorkerQueueThreads } from './runWorkerQueueThreads';

describe('runWorkerQueueThreads', () => {
  it('should execute work in parallel', async () => {
    const sharedData = new SharedArrayBuffer(10);
    const sharedView = new Uint8Array(sharedData);

    const { results } = await runWorkerQueueThreads({
      context: sharedData,
      items: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      workerFactory: (data: SharedArrayBuffer) => {
        const view = new Uint8Array(data);

        return async (i: number) => {
          view[i] = 10 + i;
          return 20 + i;
        };
      },
    });

    expect(Array.from(sharedView)).toEqual([
      10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
    ]);
    expect(results).toEqual([20, 21, 22, 23, 24, 25, 26, 27, 28, 29]);
  });
});
