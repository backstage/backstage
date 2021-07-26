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
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either expressed or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { runPeriodically } from './runPeriodically';

jest.useFakeTimers();

describe('runPeriodically', () => {
  const flushPromises = () => new Promise(setImmediate);
  const advanceTimersByTime = async (time: number) => {
    jest.advanceTimersByTime(time);
    // Advancing the time with jest doesn't run all promises, but only sync code
    await flushPromises();
  };

  it('runs task initially', async () => {
    const task = jest.fn(async () => {});
    const cancel = runPeriodically(task, 1000);
    expect(task).toHaveBeenCalledTimes(1);
    cancel();
  });

  it('runs at requested interval', async () => {
    const task = jest.fn(async () => {});
    const cancel = runPeriodically(task, 1000);
    await flushPromises();
    await advanceTimersByTime(1000);
    await advanceTimersByTime(1000);
    expect(task).toHaveBeenCalledTimes(3);
    cancel();
  });

  it('stops after being canceled', async () => {
    const task = jest.fn(async () => {});
    const cancel = runPeriodically(task, 1000);
    await flushPromises();
    cancel();
    await advanceTimersByTime(1000);
    await advanceTimersByTime(1000);
    expect(task).toHaveBeenCalledTimes(1);
  });

  it('continues running after failures', async () => {
    const task = jest.fn(async () => {
      throw new Error();
    });
    const cancel = runPeriodically(task, 1000);
    await flushPromises();
    await advanceTimersByTime(1000);
    await advanceTimersByTime(1000);
    expect(task).toHaveBeenCalledTimes(3);
    cancel();
  });

  it('waits till a long running task is completed', async () => {
    const task = jest.fn(
      () => new Promise(resolve => setTimeout(resolve, 10000)),
    );
    const cancel = runPeriodically(task, 1000);
    await flushPromises();
    await advanceTimersByTime(1000);
    expect(task).toHaveBeenCalledTimes(1);
    await advanceTimersByTime(9000);
    await advanceTimersByTime(1000);
    expect(task).toHaveBeenCalledTimes(2);
    cancel();
  });
});
