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
import { createMockNavigationController } from './createMockNavigationController';

describe('createMockNavigationController', () => {
  it('should emit the initial location synchronously on subscribe', () => {
    const controller = createMockNavigationController({
      initialLocation: '/catalog?q=1#hash',
    });
    const locs: FrameworkLocation[] = [];
    controller.location$.subscribe(l => locs.push(l));
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
    const controller = createMockNavigationController({ navigate });
    const locs: FrameworkLocation[] = [];
    controller.location$.subscribe(l => locs.push(l));

    controller.navigate('/tools', { state: { step: 1 } });

    expect(controller.navigateCalls).toEqual([
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
    const controller = createMockNavigationController({ navigate });
    controller.navigate('/only-path');
    expect(navigate).toHaveBeenCalledWith('/only-path');
    expect(navigate.mock.calls[0]).toHaveLength(1);
  });

  it('should record go calls and invoke the optional go mock', () => {
    const go = jest.fn();
    const controller = createMockNavigationController({ go });
    controller.go(-1);
    expect(controller.goCalls).toEqual([-1]);
    expect(go).toHaveBeenCalledWith(-1);
  });

  it('should expose block and createContract stubs', () => {
    const controller = createMockNavigationController();
    const unblock = controller.block(() => false);
    expect(typeof unblock).toBe('function');
    expect(controller.createContract('/catalog')).toEqual(
      expect.objectContaining({ basePath: '/' }),
    );
  });
});
