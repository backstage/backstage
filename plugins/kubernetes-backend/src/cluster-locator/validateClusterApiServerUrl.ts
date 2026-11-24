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

import { lookup } from 'node:dns/promises';
import ipaddr from 'ipaddr.js';

export type ValidateClusterApiServerUrlOptions = {
  /**
   * Hostname patterns (for example `127.0.0.1` or `*.example.com`) for which
   * catalog cluster API server URLs may use HTTP or non-public addresses.
   * Configured in app-config only; not controllable from catalog entities.
   */
  dangerouslyAllowClusterUrls?: string[];
};

function isNonPublicIp(ip: string): boolean {
  try {
    const addr = ipaddr.parse(ip);
    return addr.range() !== 'unicast';
  } catch {
    return true;
  }
}

function hostnameMatchesPattern(hostname: string, pattern: string): boolean {
  const normalizedHost = hostname.toLowerCase();
  const normalizedPattern = pattern.toLowerCase();

  if (normalizedPattern.startsWith('*.')) {
    const suffix = normalizedPattern.slice(1);
    const bare = normalizedPattern.slice(2);
    return normalizedHost.endsWith(suffix) || normalizedHost === bare;
  }

  return normalizedHost === normalizedPattern;
}

function isHostnameDangerouslyAllowed(
  hostname: string,
  patterns: string[] | undefined,
): boolean {
  if (!patterns?.length) {
    return false;
  }
  return patterns.some(pattern => hostnameMatchesPattern(hostname, pattern));
}

async function validateHostNotPrivate(hostname: string): Promise<void> {
  const addresses = await lookup(hostname, { all: true });
  const nonPublic = addresses.find(addr => isNonPublicIp(addr.address));
  if (nonPublic) {
    throw new Error(
      `Kubernetes cluster API server URL hostname "${hostname}" resolves to a non-public address`,
    );
  }
}

function validateLiteralHost(hostname: string): void {
  if (ipaddr.isValid(hostname) || ipaddr.IPv6.isValid(hostname)) {
    if (isNonPublicIp(hostname)) {
      throw new Error(
        'Kubernetes cluster API server URL must not use a non-public IP address',
      );
    }
  }
}

/**
 * Validates a catalog-provided Kubernetes API server URL against SSRF protections.
 *
 * @throws when the URL is not permitted
 */
export async function validateClusterApiServerUrl(
  apiServerUrl: string,
  options: ValidateClusterApiServerUrlOptions = {},
): Promise<URL> {
  let url: URL;
  try {
    url = new URL(apiServerUrl);
  } catch {
    throw new Error('Kubernetes cluster API server URL is not a valid URL');
  }

  if (url.username || url.password) {
    throw new Error(
      'Kubernetes cluster API server URL must not contain credentials',
    );
  }

  const hostname = url.hostname.toLowerCase();
  const ssrfExempt = isHostnameDangerouslyAllowed(
    hostname,
    options.dangerouslyAllowClusterUrls,
  );

  if (url.protocol !== 'https:' && url.protocol !== 'http:') {
    throw new Error(
      'Kubernetes cluster API server URL must use the HTTP or HTTPS scheme',
    );
  }

  if (!ssrfExempt) {
    if (url.protocol !== 'https:') {
      throw new Error(
        'Kubernetes cluster API server URL must use the HTTPS scheme',
      );
    }

    validateLiteralHost(hostname);

    if (!ipaddr.isValid(hostname) && !ipaddr.IPv6.isValid(hostname)) {
      await validateHostNotPrivate(hostname);
    }
  }

  return url;
}
