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

import { featureDetector } from './helpers';

describe('featureDetector', () => {
  it('keeps trying until the deadline as long as the feature check returns undefined', async () => {
    const f = jest.fn(
      () =>
        new Promise<boolean | undefined>(res => {
          setTimeout(() => res(undefined), 500);
        }),
    );

    const detector = featureDetector(f, { timeoutMillis: 1200 });

    await expect(detector()).resolves.toBeUndefined();
    expect(f.mock.calls.length).toBe(1);
    await expect(detector()).resolves.toBeUndefined();
    expect(f.mock.calls.length).toBe(2);
    await expect(detector()).resolves.toBe(false); // deadline is hit in the middle of waiting
    expect(f.mock.calls.length).toBe(3);
    await expect(detector()).resolves.toBe(false);
    expect(f.mock.calls.length).toBe(3);
  });

  it('memoizes the first successful result', async () => {
    const f = jest
      .fn()
      .mockResolvedValueOnce(undefined)
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(false);

    const detector = featureDetector(f);

    await expect(detector()).resolves.toBeUndefined();
    expect(f.mock.calls.length).toBe(1);
    await expect(detector()).resolves.toBe(true);
    expect(f.mock.calls.length).toBe(2);
    await expect(detector()).resolves.toBe(true);
    expect(f.mock.calls.length).toBe(2);
  });

  it('treats rejections as undefined', async () => {
    const f = jest
      .fn()
      .mockRejectedValueOnce(new Error('boom'))
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(false);

    const detector = featureDetector(f);

    await expect(detector()).resolves.toBeUndefined();
    expect(f.mock.calls.length).toBe(1);
    await expect(detector()).resolves.toBe(true);
    expect(f.mock.calls.length).toBe(2);
    await expect(detector()).resolves.toBe(true);
    expect(f.mock.calls.length).toBe(2);
  });
});
