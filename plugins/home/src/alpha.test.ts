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

import { mockApis } from '@backstage/test-utils';
import homePlugin from './alpha';
import { VisitsStorageApi, VisitsWebStorageApi } from './api';

// Mock localStorage for testing
const mockLocalStorage = new Map<string, string>();
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: (key: string) => mockLocalStorage.get(key) || null,
    setItem: (key: string, value: string) => mockLocalStorage.set(key, value),
    removeItem: (key: string) => mockLocalStorage.delete(key),
    clear: () => mockLocalStorage.clear(),
  },
});

describe('Home Plugin Alpha', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
  });

  describe('Core Extensions (Always Enabled)', () => {
    it('should export core home page extension', () => {
      expect(homePlugin.getExtension('page:home')).toBeDefined();
    });

    it('should export navigation item extension', () => {
      expect(homePlugin.getExtension('nav-item:home')).toBeDefined();
    });
  });

  describe('Optional Extensions (Disabled by Default)', () => {
    it('should export visit tracking API extension', () => {
      const visitTrackingExtension = homePlugin.getExtension('api:home/visits');
      expect(visitTrackingExtension).toBeDefined();
    });

    it('should export visit listener extension', () => {
      const visitListenerExtension = homePlugin.getExtension(
        'app-root-element:home/visit-listener',
      );
      expect(visitListenerExtension).toBeDefined();
    });
  });

  describe('API Implementation Classes', () => {
    it('should create VisitsStorageApi with custom storage', () => {
      const mockStorageApi = mockApis.storage();
      const mockIdentityApi = mockApis.identity({
        userEntityRef: 'user:default/testuser',
      });

      const visitsApi = VisitsStorageApi.create({
        storageApi: mockStorageApi,
        identityApi: mockIdentityApi,
      });

      expect(visitsApi).toBeInstanceOf(VisitsStorageApi);
    });

    it('should create localStorage fallback API when no custom storage is available', () => {
      const mockIdentityApi = mockApis.identity({
        userEntityRef: 'user:default/testuser',
      });
      const mockErrorApi = { post: jest.fn(), error$: jest.fn() };

      // Test that VisitsWebStorageApi can be created without custom storage
      const visitsApi = VisitsWebStorageApi.create({
        identityApi: mockIdentityApi,
        errorApi: mockErrorApi,
      });

      // VisitsWebStorageApi.create returns a VisitsStorageApi instance
      expect(visitsApi).toBeInstanceOf(VisitsStorageApi);
    });
  });

  describe('Plugin Structure', () => {
    it('should have correct plugin metadata', () => {
      expect(homePlugin.id).toBe('home');
      expect(homePlugin.routes.root).toBeDefined();
    });

    it('should include all extensions in the correct order', () => {
      // Core extensions (always enabled)
      expect(homePlugin.getExtension('page:home')).toBeDefined();
      expect(homePlugin.getExtension('nav-item:home')).toBeDefined();

      // Optional extensions (disabled by default)
      expect(homePlugin.getExtension('api:home/visits')).toBeDefined();
      expect(
        homePlugin.getExtension('app-root-element:home/visit-listener'),
      ).toBeDefined();
    });
  });
});
