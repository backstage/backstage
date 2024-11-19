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

import { ThrottleService } from './ThrottleService';

describe('ThrottleService', () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it('should throttle requests', async () => {
    jest.useFakeTimers();

    const throttleService = new ThrottleService();
    const options = {
      host: 'example.com',
      throttling: { count: 1, interval: { seconds: 1 } },
    };

    const f1 = jest.fn();
    const f2 = jest.fn();
    const f1Throttled = throttleService.throttle(f1, options);
    const f2Throttled = throttleService.throttle(f2, options);

    f1Throttled();
    f2Throttled();
    f1Throttled();
    f2Throttled();

    jest.advanceTimersByTime(1); // 0 -> 1

    expect(f1).toHaveBeenCalledTimes(1);
    expect(f2).toHaveBeenCalledTimes(0);

    jest.advanceTimersByTime(998); // 1 -> 999

    expect(f1).toHaveBeenCalledTimes(1);
    expect(f2).toHaveBeenCalledTimes(0);

    jest.advanceTimersByTime(1); // 999 -> 1000

    expect(f1).toHaveBeenCalledTimes(1);
    expect(f2).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(999); // 1000 -> 1999

    expect(f1).toHaveBeenCalledTimes(1);
    expect(f2).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(1); // 1999 -> 2000

    expect(f1).toHaveBeenCalledTimes(2);
    expect(f2).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(999); // 2000 -> 2999

    expect(f1).toHaveBeenCalledTimes(2);
    expect(f2).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(1); // 2999 -> 3000

    expect(f1).toHaveBeenCalledTimes(2);
    expect(f2).toHaveBeenCalledTimes(2);
  });
});
