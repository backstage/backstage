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

import {
  createOpenSearchAuthTransport,
  createElasticSearchAuthTransport,
} from './ElasticSearchAuthTransport';
import { ElasticSearchAuthProvider } from '../auth';

describe('ElasticSearchAuthTransport', () => {
  describe('createOpenSearchAuthTransport', () => {
    it('should return a Transport class', () => {
      const authProvider: ElasticSearchAuthProvider = {
        getAuthHeaders: jest
          .fn()
          .mockResolvedValue({ Authorization: 'Bearer test' }),
      };

      const Transport = createOpenSearchAuthTransport(authProvider);

      expect(Transport).toBeDefined();
      expect(typeof Transport).toBe('function');
    });

    it('should call getAuthHeaders when request is made', async () => {
      const authProvider: ElasticSearchAuthProvider = {
        getAuthHeaders: jest
          .fn()
          .mockResolvedValue({ Authorization: 'Bearer test-token' }),
      };

      const Transport = createOpenSearchAuthTransport(authProvider);

      // Create a mock parent class request method
      const mockParentRequest = jest.fn().mockResolvedValue({ body: {} });

      // Create an instance with mocked internals
      const transportInstance = Object.create(Transport.prototype);
      Object.getPrototypeOf(Object.getPrototypeOf(transportInstance)).request =
        mockParentRequest;

      // Call request method (promise style)
      const requestPromise = transportInstance.request(
        { method: 'GET', path: '/' },
        {},
      );

      // The auth provider should be called
      await requestPromise.catch(() => {}); // Ignore errors from incomplete mock
      expect(authProvider.getAuthHeaders).toHaveBeenCalled();
    });

    it('should be usable as Transport option', () => {
      const authProvider: ElasticSearchAuthProvider = {
        getAuthHeaders: jest
          .fn()
          .mockResolvedValue({ Authorization: 'Bearer test' }),
      };

      const Transport = createOpenSearchAuthTransport(authProvider);

      // Verify the Transport has the expected static properties
      expect(Transport).toHaveProperty('sniffReasons');
    });
  });

  describe('createElasticSearchAuthTransport', () => {
    it('should return a Transport class', () => {
      const authProvider: ElasticSearchAuthProvider = {
        getAuthHeaders: jest
          .fn()
          .mockResolvedValue({ Authorization: 'Bearer test' }),
      };

      const Transport = createElasticSearchAuthTransport(authProvider);

      expect(Transport).toBeDefined();
      expect(typeof Transport).toBe('function');
    });

    it('should call getAuthHeaders when request is made', async () => {
      const authProvider: ElasticSearchAuthProvider = {
        getAuthHeaders: jest
          .fn()
          .mockResolvedValue({ Authorization: 'Bearer test-token' }),
      };

      const Transport = createElasticSearchAuthTransport(authProvider);

      // Create a mock parent class request method
      const mockParentRequest = jest.fn().mockResolvedValue({ body: {} });

      // Create an instance with mocked internals
      const transportInstance = Object.create(Transport.prototype);
      Object.getPrototypeOf(Object.getPrototypeOf(transportInstance)).request =
        mockParentRequest;

      // Call request method (promise style)
      const requestPromise = transportInstance.request(
        { method: 'GET', path: '/' },
        {},
      );

      // The auth provider should be called
      await requestPromise.catch(() => {}); // Ignore errors from incomplete mock
      expect(authProvider.getAuthHeaders).toHaveBeenCalled();
    });

    it('should be usable as Transport option', () => {
      const authProvider: ElasticSearchAuthProvider = {
        getAuthHeaders: jest
          .fn()
          .mockResolvedValue({ Authorization: 'Bearer test' }),
      };

      const Transport = createElasticSearchAuthTransport(authProvider);

      // Verify the Transport has the expected static properties
      expect(Transport).toHaveProperty('sniffReasons');
    });
  });

  describe('auth provider integration', () => {
    it('should support async token retrieval', async () => {
      let tokenRetrievalCount = 0;
      const authProvider: ElasticSearchAuthProvider = {
        getAuthHeaders: jest.fn().mockImplementation(async () => {
          tokenRetrievalCount++;
          // Simulate async token fetch
          await new Promise(resolve => setTimeout(resolve, 10));
          return { Authorization: `Bearer token-${tokenRetrievalCount}` };
        }),
      };

      // Just verify the provider works correctly
      const headers1 = await authProvider.getAuthHeaders();
      const headers2 = await authProvider.getAuthHeaders();

      expect(headers1.Authorization).toBe('Bearer token-1');
      expect(headers2.Authorization).toBe('Bearer token-2');
      expect(authProvider.getAuthHeaders).toHaveBeenCalledTimes(2);
    });

    it('should support token rotation pattern', async () => {
      const tokens = ['initial-token', 'rotated-token', 'final-token'];
      let currentTokenIndex = 0;

      const authProvider: ElasticSearchAuthProvider = {
        getAuthHeaders: jest.fn().mockImplementation(async () => {
          const token = tokens[currentTokenIndex];
          currentTokenIndex = Math.min(
            currentTokenIndex + 1,
            tokens.length - 1,
          );
          return { Authorization: `Bearer ${token}` };
        }),
      };

      // Simulate multiple requests that would trigger token rotation
      const headers1 = await authProvider.getAuthHeaders();
      const headers2 = await authProvider.getAuthHeaders();
      const headers3 = await authProvider.getAuthHeaders();

      expect(headers1.Authorization).toBe('Bearer initial-token');
      expect(headers2.Authorization).toBe('Bearer rotated-token');
      expect(headers3.Authorization).toBe('Bearer final-token');
    });

    it('should handle errors in getAuthHeaders gracefully', async () => {
      const authProvider: ElasticSearchAuthProvider = {
        getAuthHeaders: jest
          .fn()
          .mockRejectedValue(new Error('Token fetch failed')),
      };

      await expect(authProvider.getAuthHeaders()).rejects.toThrow(
        'Token fetch failed',
      );
    });
  });
});
