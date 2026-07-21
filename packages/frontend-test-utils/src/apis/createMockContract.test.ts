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

import { FrameworkLocation } from '@backstage/frontend-plugin-api';
import { createMockContract } from './createMockContract';

describe('createMockContract', () => {
  it('should create a contract with the given basePath', () => {
    const contract = createMockContract({ basePath: '/catalog' });
    expect(contract.basePath).toBe('/catalog');
  });

  it('should emit the initial location', () => {
    const contract = createMockContract({
      basePath: '/',
      initialLocation: '/foo',
    });
    const locs: FrameworkLocation[] = [];
    contract.location$.subscribe(l => locs.push(l));
    expect(locs).toHaveLength(1);
    expect(locs[0]).toEqual({
      pathname: '/foo',
      search: '',
      hash: '',
      state: undefined,
    });
  });

  it('should default initial location to /', () => {
    const contract = createMockContract({ basePath: '/' });
    const locs: FrameworkLocation[] = [];
    contract.location$.subscribe(l => locs.push(l));
    expect(locs).toHaveLength(1);
    expect(locs[0]).toEqual({
      pathname: '/',
      search: '',
      hash: '',
      state: undefined,
    });
  });

  it('should track navigate calls', () => {
    const contract = createMockContract({ basePath: '/' });
    contract.navigate('/a');
    contract.navigate('/b', { replace: true });
    expect(contract.navigateCalls).toEqual([
      { to: '/a', options: undefined },
      { to: '/b', options: { replace: true } },
    ]);
  });

  it('should emit new location after navigate', () => {
    const contract = createMockContract({ basePath: '/' });
    const locs: FrameworkLocation[] = [];
    contract.location$.subscribe(l => locs.push(l));
    contract.navigate('/bar');
    expect(locs).toHaveLength(2);
    expect(locs[1]).toEqual({
      pathname: '/bar',
      search: '',
      hash: '',
      state: undefined,
    });
  });

  it('should parse query and hash correctly', () => {
    const contract = createMockContract({
      basePath: '/',
      initialLocation: '/foo?bar=1#baz',
    });
    const locs: FrameworkLocation[] = [];
    contract.location$.subscribe(l => locs.push(l));
    expect(locs[0]).toEqual({
      pathname: '/foo',
      search: '?bar=1',
      hash: '#baz',
      state: undefined,
    });
  });

  it('should track go calls via contract.go', () => {
    const contract = createMockContract({ basePath: '/' });
    contract.navigate('/a');
    contract.navigate('/b');
    contract.go(-1);
    expect(contract.goCalls).toEqual([-1]);
    expect(contract.canGoBack()).toBe(true);
    expect(contract.canGoForward()).toBe(true);
  });

  it('should store adapterState separately from location state', () => {
    const contract = createMockContract({ basePath: '/' });
    contract.navigate('/bar', {
      state: { user: 1 },
      adapterState: { 'tanstack-router': { key: 'k' } },
    });
    const locs: FrameworkLocation[] = [];
    contract.location$.subscribe(l => locs.push(l));
    expect(locs[locs.length - 1].state).toEqual({ user: 1 });
    expect(contract.getAdapterState('tanstack-router')).toEqual({ key: 'k' });
  });

  it('should update closed property after unsubscribe', () => {
    const contract = createMockContract({ basePath: '/' });
    const sub = contract.location$.subscribe(() => {});
    expect(sub.closed).toBe(false);
    sub.unsubscribe();
    expect(sub.closed).toBe(true);
  });
});
