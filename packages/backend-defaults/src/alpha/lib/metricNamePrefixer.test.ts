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

import {
  createMetricName,
  createMetricNamePrefixer,
} from './metricNamePrefixer';

describe('metricNameUtils', () => {
  describe('createMetricName', () => {
    it('should create core metric names correctly', () => {
      const result = createMetricName('requests_total', {
        serviceName: 'backstage',
        scope: 'core',
      });

      expect(result).toBe('backstage.core.requests_total');
    });

    it('should create plugin metric names correctly', () => {
      const result = createMetricName('requests_total', {
        serviceName: 'backstage',
        scope: 'plugin',
        pluginId: 'catalog',
      });

      expect(result).toBe('backstage.plugin.catalog.requests_total');
    });

    it('should throw error for plugin scope without pluginId', () => {
      expect(() =>
        createMetricName('requests_total', {
          serviceName: 'backstage',
          scope: 'plugin',
        }),
      ).toThrow('Plugin ID is required for plugin-scoped metrics');
    });
  });

  describe('createMetricNamePrefixer', () => {
    it('should create a prefixer for core metrics', () => {
      const prefixer = createMetricNamePrefixer({
        serviceName: 'backstage',
        scope: 'core',
      });

      expect(prefixer('requests_total')).toBe('backstage.core.requests_total');
      expect(prefixer('errors_total')).toBe('backstage.core.errors_total');
    });

    it('should create a prefixer for plugin metrics', () => {
      const prefixer = createMetricNamePrefixer({
        serviceName: 'backstage',
        scope: 'plugin',
        pluginId: 'catalog',
      });

      expect(prefixer('requests_total')).toBe(
        'backstage.plugin.catalog.requests_total',
      );
      expect(prefixer('errors_total')).toBe(
        'backstage.plugin.catalog.errors_total',
      );
    });
  });
});
