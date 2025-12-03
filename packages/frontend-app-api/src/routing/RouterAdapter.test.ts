/*
 * Copyright 2024 The Backstage Authors
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

import { isRouterAdapter, RouterAdapter } from './RouterAdapter';
import { ReactRouter6Adapter } from './ReactRouter6Provider';

describe('RouterAdapter', () => {
  describe('isRouterAdapter', () => {
    it('should return true for a valid RouterAdapter object', () => {
      const adapter: RouterAdapter = {
        Provider: () => null,
        Router: () => null,
        matchRoutes: () => null,
        generatePath: () => '',
      };

      expect(isRouterAdapter(adapter)).toBe(true);
    });

    it('should return false for a preset string', () => {
      expect(isRouterAdapter('react-router-6')).toBe(false);
    });

    it('should return false for an object without Provider', () => {
      const notAdapter = {
        Router: () => null,
        matchRoutes: () => null,
        generatePath: () => '',
      };

      expect(isRouterAdapter(notAdapter as any)).toBe(false);
    });
  });

  describe('ReactRouter6Adapter', () => {
    it('should have all required properties', () => {
      expect(ReactRouter6Adapter.Provider).toBeDefined();
      expect(ReactRouter6Adapter.Router).toBeDefined();
      expect(ReactRouter6Adapter.matchRoutes).toBeDefined();
      expect(ReactRouter6Adapter.generatePath).toBeDefined();
    });

    it('should have Provider as a function component', () => {
      expect(typeof ReactRouter6Adapter.Provider).toBe('function');
    });

    it('should have Router as a function component', () => {
      expect(typeof ReactRouter6Adapter.Router).toBe('function');
    });

    it('should have matchRoutes as a function', () => {
      expect(typeof ReactRouter6Adapter.matchRoutes).toBe('function');
    });

    it('should have generatePath as a function', () => {
      expect(typeof ReactRouter6Adapter.generatePath).toBe('function');
    });

    it('should generate paths correctly', () => {
      const path = ReactRouter6Adapter.generatePath('/users/:id', {
        id: '123',
      });
      expect(path).toBe('/users/123');
    });

    it('should match routes correctly', () => {
      const routes = [{ path: '/users/:id' }];
      const matches = ReactRouter6Adapter.matchRoutes(routes, {
        pathname: '/users/123',
      });

      expect(matches).toHaveLength(1);
      expect(matches![0].params).toEqual({ id: '123' });
    });
  });
});
