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
import { createMockAppHistory } from './createMockAppHistory';

describe('createMockAppHistory', () => {
  it('should emit the initial location synchronously on subscribe', () => {
    const appHistory = createMockAppHistory({
      initialLocation: '/catalog?q=1#hash',
    });
    const locs: FrameworkLocation[] = [];
    appHistory.location$.subscribe(l => locs.push(l));
    expect(locs).toEqual([
      {
        pathname: '/catalog',
        search: '?q=1',
        hash: '#hash',
        state: undefined,
      },
    ]);
  });

  it('should update location$ and record navigate calls', () => {
    const navigate = jest.fn();
    const appHistory = createMockAppHistory({ navigate });
    const locs: FrameworkLocation[] = [];
    appHistory.location$.subscribe(l => locs.push(l));

    appHistory.navigate('/tools', { state: { step: 1 } });

    expect(appHistory.navigateCalls).toEqual([
      { to: '/tools', options: { state: { step: 1 } } },
    ]);
    expect(navigate).toHaveBeenCalledWith('/tools', { state: { step: 1 } });
    expect(locs[1]).toEqual({
      pathname: '/tools',
      search: '',
      hash: '',
      state: { step: 1 },
    });
  });

  it('should preserve single-arg navigate arity for jest assertions', () => {
    const navigate = jest.fn();
    const appHistory = createMockAppHistory({ navigate });
    appHistory.navigate('/only-path');
    expect(navigate).toHaveBeenCalledWith('/only-path');
    expect(navigate.mock.calls[0]).toHaveLength(1);
  });

  it('should resolve hrefs without modification (no basename)', () => {
    const appHistory = createMockAppHistory();
    expect(appHistory.createHref('/catalog')).toBe('/catalog');
  });
});
