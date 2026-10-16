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
  it('kills children and exits once they are gone', () => {
    const exit = jest.fn();
    const interrupt = new RunInterrupt(exit);
    const child = { kill: jest.fn() };
    const untrack = interrupt.track(child);

    expect(interrupt.interrupted).toBe(false);
    interrupt.handleSignal('SIGTERM');
    expect(interrupt.interrupted).toBe(true);
    expect(child.kill).toHaveBeenCalledWith('SIGTERM');
    expect(exit).not.toHaveBeenCalled();

    // Children started after the interrupt are killed right away
    const late = { kill: jest.fn() };
    const untrackLate = interrupt.track(late);
    expect(late.kill).toHaveBeenCalledWith('SIGTERM');

    untrack();
    expect(exit).not.toHaveBeenCalled();
    untrackLate();
    expect(exit).toHaveBeenCalledWith(143);
  });

  it('exits right away without children, and immediately on a second signal', () => {
    const exit = jest.fn();
    const interrupt = new RunInterrupt(exit);
    interrupt.handleSignal('SIGINT');
    expect(exit).toHaveBeenCalledWith(130);

    const second = jest.fn();
    const stuck = new RunInterrupt(second);
    stuck.track({ kill: jest.fn() });
    stuck.handleSignal('SIGINT');
    expect(second).not.toHaveBeenCalled();
    stuck.handleSignal('SIGINT');
    expect(second).toHaveBeenCalledWith(130);
  });

  it('listens for signals only while installed', () => {
    const exit = jest.fn();
    const interrupt = new RunInterrupt(exit);
    const before = process.listenerCount('SIGINT');
    const dispose = interrupt.install();
    expect(process.listenerCount('SIGINT')).toBe(before + 1);
    process.emit('SIGINT');
    expect(exit).toHaveBeenCalledWith(130);
    dispose();
    expect(process.listenerCount('SIGINT')).toBe(before);
  });
});
