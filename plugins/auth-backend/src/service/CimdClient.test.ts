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

import { isCimdUrl, validateCimdUrl, fetchCimdMetadata } from './CimdClient';
import * as dns from 'dns/promises';

jest.mock('dns/promises');

const mockDnsLookup = dns.lookup as jest.MockedFunction<typeof dns.lookup>;

describe('CimdClient', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    // Default to public IP
    mockDnsLookup.mockResolvedValue([
      { address: '93.184.216.34', family: 4 },
    ] as any);
  });

  describe('isCimdUrl', () => {
    it('should return true for valid CIMD URLs', () => {
      expect(isCimdUrl('https://example.com/oauth-metadata.json')).toBe(true);
      expect(isCimdUrl('https://example.com/path/to/metadata')).toBe(true);
      expect(
        isCimdUrl('https://sub.example.com/.well-known/oauth-client'),
      ).toBe(true);
    });

    it('should return false for URLs without path', () => {
      expect(isCimdUrl('https://example.com')).toBe(false);
      expect(isCimdUrl('https://example.com/')).toBe(false);
    });

    it('should return false for non-HTTPS URLs', () => {
      expect(isCimdUrl('http://example.com/metadata')).toBe(false);
    });

    it('should return false for non-URL strings', () => {
      expect(isCimdUrl('not-a-url')).toBe(false);
      expect(isCimdUrl('uuid-like-client-id')).toBe(false);
      expect(isCimdUrl('')).toBe(false);
    });
  });

  describe('validateCimdUrl', () => {
    it('should return URL for valid CIMD URLs', () => {
      const url = validateCimdUrl('https://example.com/metadata.json');
      expect(url.href).toBe('https://example.com/metadata.json');
    });

    it('should throw for non-HTTPS URLs', () => {
      expect(() => validateCimdUrl('http://example.com/metadata')).toThrow(
        'Invalid client_id URL format',
      );
    });

    it('should throw for URLs without path', () => {
      expect(() => validateCimdUrl('https://example.com')).toThrow(
        'Invalid client_id URL format',
      );
      expect(() => validateCimdUrl('https://example.com/')).toThrow(
        'Invalid client_id URL format',
      );
    });

    it('should throw for URLs with fragments', () => {
      expect(() =>
        validateCimdUrl('https://example.com/metadata#fragment'),
      ).toThrow('Invalid client_id URL format');
    });

    it('should throw for URLs with credentials', () => {
      expect(() =>
        validateCimdUrl('https://user:pass@example.com/metadata'),
      ).toThrow('Invalid client_id URL format');
    });

    it('should throw for invalid URLs', () => {
      expect(() => validateCimdUrl('not-a-url')).toThrow(
        'Invalid client_id URL format',
      );
    });
  });

  describe('fetchCimdMetadata', () => {
    const validMetadata = {
      client_id: 'https://example.com/oauth-metadata.json',
      client_name: 'Test Client',
      redirect_uris: ['http://localhost:8080/callback'],
    };

    beforeEach(() => {
      global.fetch = jest.fn();
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should fetch and return valid metadata', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        headers: new Headers({ 'content-length': '100' }),
        text: () => Promise.resolve(JSON.stringify(validMetadata)),
      });

      const result = await fetchCimdMetadata(
        'https://example.com/oauth-metadata.json',
      );

      expect(result).toEqual({
        clientId: 'https://example.com/oauth-metadata.json',
        clientName: 'Test Client',
        redirectUris: ['http://localhost:8080/callback'],
        responseTypes: ['code'],
        grantTypes: ['authorization_code'],
        scope: undefined,
      });
    });

    it('should use client_id as client_name if not provided', async () => {
      const metadataWithoutName = {
        client_id: 'https://example.com/oauth-metadata.json',
        redirect_uris: ['http://localhost:8080/callback'],
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        headers: new Headers(),
        text: () => Promise.resolve(JSON.stringify(metadataWithoutName)),
      });

      const result = await fetchCimdMetadata(
        'https://example.com/oauth-metadata.json',
      );

      expect(result.clientName).toBe('https://example.com/oauth-metadata.json');
    });

    it('should throw for private IP addresses', async () => {
      mockDnsLookup.mockResolvedValue([
        { address: '192.168.1.1', family: 4 },
      ] as any);

      await expect(
        fetchCimdMetadata('https://internal.example.com/metadata'),
      ).rejects.toThrow('Invalid client_id URL');
    });

    it('should throw for loopback addresses', async () => {
      mockDnsLookup.mockResolvedValue([
        { address: '127.0.0.1', family: 4 },
      ] as any);

      await expect(
        fetchCimdMetadata('https://localhost.example.com/metadata'),
      ).rejects.toThrow('Invalid client_id URL');
    });

    it('should throw for 10.x.x.x addresses', async () => {
      mockDnsLookup.mockResolvedValue([
        { address: '10.0.0.1', family: 4 },
      ] as any);

      await expect(
        fetchCimdMetadata('https://internal.example.com/metadata'),
      ).rejects.toThrow('Invalid client_id URL');
    });

    it('should throw for 172.16-31.x.x addresses', async () => {
      mockDnsLookup.mockResolvedValue([
        { address: '172.16.0.1', family: 4 },
      ] as any);

      await expect(
        fetchCimdMetadata('https://internal.example.com/metadata'),
      ).rejects.toThrow('Invalid client_id URL');
    });

    it('should throw for IPv6 loopback', async () => {
      mockDnsLookup.mockResolvedValue([{ address: '::1', family: 6 }] as any);

      await expect(
        fetchCimdMetadata('https://internal.example.com/metadata'),
      ).rejects.toThrow('Invalid client_id URL');
    });

    it('should throw for failed fetch', async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      await expect(
        fetchCimdMetadata('https://example.com/oauth-metadata.json'),
      ).rejects.toThrow('Failed to fetch client metadata');
    });

    it('should throw for non-OK response', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 404,
      });

      await expect(
        fetchCimdMetadata('https://example.com/oauth-metadata.json'),
      ).rejects.toThrow('Failed to fetch client metadata');
    });

    it('should throw for document exceeding size limit', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        headers: new Headers({ 'content-length': '10000' }),
        text: () => Promise.resolve('x'.repeat(10000)),
      });

      await expect(
        fetchCimdMetadata('https://example.com/oauth-metadata.json'),
      ).rejects.toThrow('Client metadata document exceeds size limit');
    });

    it('should throw for document exceeding size limit without content-length header', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        headers: new Headers(),
        text: () => Promise.resolve('x'.repeat(6000)),
      });

      await expect(
        fetchCimdMetadata('https://example.com/oauth-metadata.json'),
      ).rejects.toThrow('Client metadata document exceeds size limit');
    });

    it('should throw for invalid JSON', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        headers: new Headers(),
        text: () => Promise.resolve('not json'),
      });

      await expect(
        fetchCimdMetadata('https://example.com/oauth-metadata.json'),
      ).rejects.toThrow('Invalid client metadata document');
    });

    it('should throw for client_id mismatch', async () => {
      const mismatchedMetadata = {
        client_id: 'https://different.com/metadata',
        client_name: 'Test Client',
        redirect_uris: ['http://localhost:8080/callback'],
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        headers: new Headers(),
        text: () => Promise.resolve(JSON.stringify(mismatchedMetadata)),
      });

      await expect(
        fetchCimdMetadata('https://example.com/oauth-metadata.json'),
      ).rejects.toThrow('Client ID mismatch in metadata document');
    });

    it('should throw for missing redirect_uris', async () => {
      const noRedirectUris = {
        client_id: 'https://example.com/oauth-metadata.json',
        client_name: 'Test Client',
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        headers: new Headers(),
        text: () => Promise.resolve(JSON.stringify(noRedirectUris)),
      });

      await expect(
        fetchCimdMetadata('https://example.com/oauth-metadata.json'),
      ).rejects.toThrow('Invalid client metadata document');
    });

    it('should throw for empty redirect_uris', async () => {
      const emptyRedirectUris = {
        client_id: 'https://example.com/oauth-metadata.json',
        client_name: 'Test Client',
        redirect_uris: [],
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        headers: new Headers(),
        text: () => Promise.resolve(JSON.stringify(emptyRedirectUris)),
      });

      await expect(
        fetchCimdMetadata('https://example.com/oauth-metadata.json'),
      ).rejects.toThrow('Invalid client metadata document');
    });

    it('should throw for metadata containing client_secret', async () => {
      const withSecret = {
        client_id: 'https://example.com/oauth-metadata.json',
        client_name: 'Test Client',
        redirect_uris: ['http://localhost:8080/callback'],
        client_secret: 'should-not-be-here',
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        headers: new Headers(),
        text: () => Promise.resolve(JSON.stringify(withSecret)),
      });

      await expect(
        fetchCimdMetadata('https://example.com/oauth-metadata.json'),
      ).rejects.toThrow('Client metadata must not contain client_secret');
    });

    it('should throw for metadata containing client_secret_expires_at', async () => {
      const withSecretExpiry = {
        client_id: 'https://example.com/oauth-metadata.json',
        client_name: 'Test Client',
        redirect_uris: ['http://localhost:8080/callback'],
        client_secret_expires_at: 12345,
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        headers: new Headers(),
        text: () => Promise.resolve(JSON.stringify(withSecretExpiry)),
      });

      await expect(
        fetchCimdMetadata('https://example.com/oauth-metadata.json'),
      ).rejects.toThrow('Client metadata must not contain client_secret');
    });

    it('should throw for forbidden token_endpoint_auth_method', async () => {
      const withForbiddenAuth = {
        client_id: 'https://example.com/oauth-metadata.json',
        client_name: 'Test Client',
        redirect_uris: ['http://localhost:8080/callback'],
        token_endpoint_auth_method: 'client_secret_basic',
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        headers: new Headers(),
        text: () => Promise.resolve(JSON.stringify(withForbiddenAuth)),
      });

      await expect(
        fetchCimdMetadata('https://example.com/oauth-metadata.json'),
      ).rejects.toThrow('Invalid client metadata document');
    });

    it('should allow token_endpoint_auth_method: none', async () => {
      const withNoneAuth = {
        client_id: 'https://example.com/oauth-metadata.json',
        client_name: 'Test Client',
        redirect_uris: ['http://localhost:8080/callback'],
        token_endpoint_auth_method: 'none',
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        headers: new Headers(),
        text: () => Promise.resolve(JSON.stringify(withNoneAuth)),
      });

      const result = await fetchCimdMetadata(
        'https://example.com/oauth-metadata.json',
      );

      expect(result.clientId).toBe('https://example.com/oauth-metadata.json');
    });

    it('should allow token_endpoint_auth_method: private_key_jwt', async () => {
      const withPrivateKeyAuth = {
        client_id: 'https://example.com/oauth-metadata.json',
        client_name: 'Test Client',
        redirect_uris: ['http://localhost:8080/callback'],
        token_endpoint_auth_method: 'private_key_jwt',
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        headers: new Headers(),
        text: () => Promise.resolve(JSON.stringify(withPrivateKeyAuth)),
      });

      const result = await fetchCimdMetadata(
        'https://example.com/oauth-metadata.json',
      );

      expect(result.clientId).toBe('https://example.com/oauth-metadata.json');
    });
  });
});
