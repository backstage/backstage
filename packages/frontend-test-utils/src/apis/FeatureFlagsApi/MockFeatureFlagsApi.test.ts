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

import { FeatureFlagState } from '@backstage/frontend-plugin-api';
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
      description: 'Test flag 2',
    });

    expect(api.getRegisteredFlags()).toHaveLength(2);
    expect(api.getRegisteredFlags()[0].name).toBe('test-flag-1');
  });

  it('should not register duplicate flags', () => {
    const api = new MockFeatureFlagsApi();

    api.registerFlag({
      name: 'test-flag',
      pluginId: 'test-plugin',
      description: 'Test flag',
    });

    api.registerFlag({
      name: 'test-flag',
      pluginId: 'test-plugin',
      description: 'Test flag duplicate',
    });

    expect(api.getRegisteredFlags()).toHaveLength(1);
  });

  it('should handle feature flag states', () => {
    const api = new MockFeatureFlagsApi();

    expect(api.isActive('test-flag')).toBe(false);

    api.save({ states: { 'test-flag': FeatureFlagState.Active } });
    expect(api.isActive('test-flag')).toBe(true);

    api.save({ states: { 'test-flag': FeatureFlagState.None } });
    expect(api.isActive('test-flag')).toBe(false);
  });

  it('should initialize with states', () => {
    const api = new MockFeatureFlagsApi({
      initialStates: {
        'flag-1': FeatureFlagState.Active,
        'flag-2': FeatureFlagState.None,
      },
    });

    expect(api.isActive('flag-1')).toBe(true);
    expect(api.isActive('flag-2')).toBe(false);
  });

  it('should save and replace states', () => {
    const api = new MockFeatureFlagsApi({
      initialStates: { 'flag-1': FeatureFlagState.Active },
    });

    expect(api.isActive('flag-1')).toBe(true);

    api.save({
      states: {
        'flag-2': FeatureFlagState.Active,
      },
    });

    expect(api.isActive('flag-1')).toBe(false);
    expect(api.isActive('flag-2')).toBe(true);
  });

  it('should save and merge states', () => {
    const api = new MockFeatureFlagsApi({
      initialStates: { 'flag-1': FeatureFlagState.Active },
    });

    expect(api.isActive('flag-1')).toBe(true);

    api.save({
      states: {
        'flag-2': FeatureFlagState.Active,
      },
      merge: true,
    });

    expect(api.isActive('flag-1')).toBe(true);
    expect(api.isActive('flag-2')).toBe(true);
  });

  it('should get and set state', () => {
    const api = new MockFeatureFlagsApi();

    api.setState({
      'flag-1': FeatureFlagState.Active,
      'flag-2': FeatureFlagState.None,
    });

    const state = api.getState();
    expect(state).toEqual({
      'flag-1': FeatureFlagState.Active,
      'flag-2': FeatureFlagState.None,
    });
  });

  it('should clear state', () => {
    const api = new MockFeatureFlagsApi({
      initialStates: { 'flag-1': FeatureFlagState.Active },
    });

    expect(api.isActive('flag-1')).toBe(true);

    api.clearState();
    expect(api.isActive('flag-1')).toBe(false);
    expect(api.getState()).toEqual({});
  });
});
