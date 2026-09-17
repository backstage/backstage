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
import { mockApis } from './mockApis';

describe('mockApis', () => {
  describe('alert', () => {
    it('can create an instance', () => {
      const alert = mockApis.alert();
      alert.post({ message: 'test alert' });
      expect(alert.getAlerts()).toHaveLength(1);
      expect(alert.getAlerts()[0]).toMatchObject({ message: 'test alert' });
    });

    it('can clear alerts', () => {
      const alert = mockApis.alert();
      alert.post({ message: 'test' });
      expect(alert.getAlerts()).toHaveLength(1);
      alert.clearAlerts();
      expect(alert.getAlerts()).toHaveLength(0);
    });

    it('can create a mock and make assertions on it', () => {
      const alert = mockApis.alert.mock({
        post: jest.fn(msg => {
          expect(msg).toMatchObject({ message: 'test' });
        }),
      });
      alert.post({ message: 'test' });
      expect(alert.post).toHaveBeenCalledTimes(1);
    });
  });

  describe('featureFlags', () => {
    it('can create an instance', () => {
      const featureFlags = mockApis.featureFlags({
        initialStates: { 'test-flag': FeatureFlagState.Active },
      });
      expect(featureFlags.isActive('test-flag')).toBe(true);
      expect(featureFlags.isActive('other-flag')).toBe(false);
    });

    it('can save and merge state', () => {
      const featureFlags = mockApis.featureFlags({
        initialStates: { 'flag-1': FeatureFlagState.Active },
      });

      featureFlags.save({
        states: { 'flag-2': FeatureFlagState.Active },
        merge: true,
      });

      expect(featureFlags.isActive('flag-1')).toBe(true);
      expect(featureFlags.isActive('flag-2')).toBe(true);
    });

    it('can set and clear state using helper methods', () => {
      const featureFlags = mockApis.featureFlags();
      featureFlags.setState({ 'test-flag': FeatureFlagState.Active });
      expect(featureFlags.getState()).toEqual({
        'test-flag': FeatureFlagState.Active,
      });
      featureFlags.clearState();
      expect(featureFlags.getState()).toEqual({});
    });

    it('can create a mock and make assertions on it', () => {
      const featureFlags = mockApis.featureFlags.mock({
        isActive: jest.fn(() => true),
      });
      expect(featureFlags.isActive('test')).toBe(true);
      expect(featureFlags.isActive).toHaveBeenCalledTimes(1);
    });
  });

  describe('re-exported APIs from test-utils', () => {
    it('should have analytics', () => {
      expect(mockApis.analytics).toBeDefined();
    });

    it('should have config', () => {
      expect(mockApis.config).toBeDefined();
    });

    it('should have discovery', () => {
      expect(mockApis.discovery).toBeDefined();
    });

    it('should have identity', () => {
      expect(mockApis.identity).toBeDefined();
    });

    it('should have permission', () => {
      expect(mockApis.permission).toBeDefined();
    });

    it('should have storage', () => {
      expect(mockApis.storage).toBeDefined();
    });

    it('should have translation', () => {
      expect(mockApis.translation).toBeDefined();
    });
  });
});
