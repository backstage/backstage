/*
 * Copyright 2026 The Backstage Authors
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

import { RunInterrupt } from './interrupt';

describe('RunInterrupt', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('kills the process groups and exits immediately', () => {
    const killSpy = jest.spyOn(process, 'kill').mockReturnValue(true);
    const exit = jest.fn();
    const interrupt = new RunInterrupt(exit);
    const order = new Array<string>();
    killSpy.mockImplementation((() => {
      order.push('kill');
      return true;
    }) as never);
    exit.mockImplementation(() => order.push('exit'));
    interrupt.onInterrupt(() => order.push('listener'));
    const child = { pid: 123, kill: jest.fn() };
    interrupt.track(child);
    const finished = { pid: 456, kill: jest.fn() };
    interrupt.track(finished)();

    expect(interrupt.interrupted).toBe(false);
    interrupt.handleSignal('SIGTERM');

    expect(interrupt.interrupted).toBe(true);
    expect(killSpy).toHaveBeenCalledTimes(1);
    expect(killSpy).toHaveBeenCalledWith(-123, 'SIGKILL');
    expect(order).toEqual(['kill', 'listener', 'exit']);
    expect(exit).toHaveBeenCalledWith(143);

    // Children started after the interrupt are killed right away
    interrupt.track({ pid: 789, kill: jest.fn() });
    expect(killSpy).toHaveBeenCalledWith(-789, 'SIGKILL');
  });

  it('ignores groups that are already gone and exits with 130 for SIGINT', () => {
    jest.spyOn(process, 'kill').mockImplementation(() => {
      throw Object.assign(new Error('gone'), { code: 'ESRCH' });
    });
    const exit = jest.fn();
    const interrupt = new RunInterrupt(exit);
    interrupt.track({ pid: 1, kill: jest.fn() });
    interrupt.handleSignal('SIGINT');
    expect(exit).toHaveBeenCalledWith(130);
  });

  it('listens for signals and kills groups on exit only while installed', () => {
    const killSpy = jest.spyOn(process, 'kill').mockReturnValue(true);
    const exit = jest.fn();
    const interrupt = new RunInterrupt(exit);
    const sigints = process.listenerCount('SIGINT');
    const exits = process.listenerCount('exit');
    const dispose = interrupt.install();
    expect(process.listenerCount('SIGINT')).toBe(sigints + 1);
    expect(process.listenerCount('exit')).toBe(exits + 1);

    interrupt.track({ pid: 5, kill: jest.fn() });
    const exitListener = process.listeners('exit').slice(-1)[0];
    exitListener(0 as never);
    expect(killSpy).toHaveBeenCalledWith(-5, 'SIGKILL');

    process.emit('SIGINT');
    expect(exit).toHaveBeenCalledWith(130);
    dispose();
    expect(process.listenerCount('SIGINT')).toBe(sigints);
    expect(process.listenerCount('exit')).toBe(exits);
  });
});
