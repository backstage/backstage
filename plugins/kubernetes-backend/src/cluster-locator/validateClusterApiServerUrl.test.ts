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

import type { LookupAddress } from 'node:dns';
import { validateClusterApiServerUrl } from './validateClusterApiServerUrl';
import * as dns from 'node:dns/promises';

jest.mock('node:dns/promises');
const mockDnsLookup = dns.lookup as jest.MockedFunction<typeof dns.lookup>;

function mockDnsLookupAddresses(addresses: LookupAddress[]) {
  mockDnsLookup.mockResolvedValue(addresses as any);
}

describe('validateClusterApiServerUrl', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDnsLookupAddresses([{ address: '93.184.216.34', family: 4 }]);
  });

  it('accepts public HTTPS URLs', async () => {
    const url = await validateClusterApiServerUrl(
      'https://apiserver.example.com',
    );
    expect(url.hostname).toBe('apiserver.example.com');
  });

  it('rejects non-HTTPS URLs by default', async () => {
    await expect(
      validateClusterApiServerUrl('http://apiserver.example.com'),
    ).rejects.toThrow('HTTPS');
  });

  it('allows HTTP for hostnames listed in dangerouslyAllowClusterUrls', async () => {
    const url = await validateClusterApiServerUrl('http://127.0.0.1:6443', {
      dangerouslyAllowClusterUrls: ['127.0.0.1'],
    });
    expect(url.protocol).toBe('http:');
  });

  it('rejects private IP literals unless dangerouslyAllowClusterUrls matches', async () => {
    await expect(
      validateClusterApiServerUrl('https://10.0.0.1'),
    ).rejects.toThrow('non-public');
    await expect(
      validateClusterApiServerUrl('https://192.168.0.1'),
    ).rejects.toThrow('non-public');
    await expect(
      validateClusterApiServerUrl('https://127.0.0.1'),
    ).rejects.toThrow('non-public');
    await expect(
      validateClusterApiServerUrl('https://169.254.169.254'),
    ).rejects.toThrow('non-public');

    const url = await validateClusterApiServerUrl('https://127.0.0.1:6443', {
      dangerouslyAllowClusterUrls: ['127.0.0.1'],
    });
    expect(url.hostname).toBe('127.0.0.1');
  });

  it('rejects hostnames that resolve to private addresses', async () => {
    mockDnsLookupAddresses([{ address: '10.0.0.1', family: 4 }]);

    await expect(
      validateClusterApiServerUrl('https://attacker-controlled.example.com'),
    ).rejects.toThrow('non-public');
  });

  it('skips DNS SSRF checks for dangerouslyAllowClusterUrls hostnames', async () => {
    mockDnsLookupAddresses([{ address: '10.0.0.1', family: 4 }]);

    const url = await validateClusterApiServerUrl('https://minikube.local', {
      dangerouslyAllowClusterUrls: ['minikube.local'],
    });
    expect(url.hostname).toBe('minikube.local');
    expect(mockDnsLookup).not.toHaveBeenCalled();
  });

  it('rejects cloud metadata hostnames by default', async () => {
    mockDnsLookupAddresses([{ address: '169.254.169.254', family: 4 }]);

    await expect(
      validateClusterApiServerUrl('https://metadata.google.internal'),
    ).rejects.toThrow('non-public');
  });

  it('rejects URLs with embedded credentials', async () => {
    await expect(
      validateClusterApiServerUrl('https://user:pass@apiserver.example.com'),
    ).rejects.toThrow('credentials');
  });
});
