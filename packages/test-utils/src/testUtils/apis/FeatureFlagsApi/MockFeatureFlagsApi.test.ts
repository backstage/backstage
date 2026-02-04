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

import { FeatureFlagState } from '@backstage/core-plugin-api';
import { MockFeatureFlagsApi } from './MockFeatureFlagsApi';

describe('MockFeatureFlagsApi', () => {
  it('should register flags', () => {
    const api = new MockFeatureFlagsApi();

    api.registerFlag({
      name: 'test-flag-1',
      pluginId: 'test-plugin',
      description: 'Test flag 1',
    });

    api.registerFlag({
      name: 'test-flag-2',
      pluginId: 'test-plugin',
    });

    const flags = api.getRegisteredFlags();
    expect(flags).toHaveLength(2);
    expect(flags[0]).toMatchObject({
      name: 'test-flag-1',
      pluginId: 'test-plugin',
      description: 'Test flag 1',
    });
    expect(flags[1]).toMatchObject({
      name: 'test-flag-2',
      pluginId: 'test-plugin',
    });
  });

  it('should not register duplicate flags', () => {
    const api = new MockFeatureFlagsApi();

    api.registerFlag({ name: 'test-flag', pluginId: 'test-plugin' });
    api.registerFlag({ name: 'test-flag', pluginId: 'test-plugin' });

    expect(api.getRegisteredFlags()).toHaveLength(1);
  });

  it('should check if flags are active', () => {
    const api = new MockFeatureFlagsApi({
      initialStates: {
        'active-flag': FeatureFlagState.Active,
        'inactive-flag': FeatureFlagState.None,
      },
    });

    expect(api.isActive('active-flag')).toBe(true);
    expect(api.isActive('inactive-flag')).toBe(false);
    expect(api.isActive('unknown-flag')).toBe(false);
  });

  it('should save flag states with merge', () => {
    const api = new MockFeatureFlagsApi({
      initialStates: {
        flag1: FeatureFlagState.Active,
        flag2: FeatureFlagState.None,
      },
    });

    api.save({
      states: {
        flag2: FeatureFlagState.Active,
        flag3: FeatureFlagState.Active,
      },
      merge: true,
    });

    expect(api.isActive('flag1')).toBe(true);
    expect(api.isActive('flag2')).toBe(true);
    expect(api.isActive('flag3')).toBe(true);
  });

  it('should save flag states without merge', () => {
    const api = new MockFeatureFlagsApi({
      initialStates: {
        flag1: FeatureFlagState.Active,
        flag2: FeatureFlagState.None,
      },
    });

    api.save({
      states: {
        flag3: FeatureFlagState.Active,
      },
      merge: false,
    });

    expect(api.isActive('flag1')).toBe(false);
    expect(api.isActive('flag2')).toBe(false);
    expect(api.isActive('flag3')).toBe(true);
  });

  it('should get all states', () => {
    const api = new MockFeatureFlagsApi({
      initialStates: {
        flag1: FeatureFlagState.Active,
        flag2: FeatureFlagState.None,
      },
    });

    expect(api.getStates()).toEqual({
      flag1: FeatureFlagState.Active,
      flag2: FeatureFlagState.None,
    });
  });
});
