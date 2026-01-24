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

import { InputError } from '@backstage/errors';
import { lookup } from 'dns/promises';
import ipaddr from 'ipaddr.js';

const FETCH_TIMEOUT_MS = 10000;

/** Auth methods that require a client secret - forbidden for CIMD clients */
const FORBIDDEN_AUTH_METHODS = [
  'client_secret_basic',
  'client_secret_post',
  'client_secret_jwt',
];

/**
 * Raw metadata document from a CIMD URL.
 * Note: client_secret fields are included for validation (must NOT be present).
 */
interface CimdMetadata {
  client_id: string;
  client_name?: string;
  redirect_uris: string[];
  response_types?: string[];
  grant_types?: string[];
  scope?: string;
  token_endpoint_auth_method?: string;
  client_secret?: string;
  client_secret_expires_at?: number;
}

/** Validated CIMD client info */
export interface CimdClientInfo {
  clientId: string;
  clientName: string;
  redirectUris: string[];
  responseTypes: string[];
  grantTypes: string[];
  scope?: string;
}

/**
 * Validates and parses a CIMD URL per the IETF draft specification.
 * Requires HTTPS for production, but allows HTTP for localhost (development).
 *
 * @see https://datatracker.ietf.org/doc/draft-ietf-oauth-client-id-metadata-document/
 * @throws InputError if the URL is invalid per the CIMD spec
 */
export function validateCimdUrl(clientId: string): URL {
  // Per IETF draft: MUST NOT contain single-dot or double-dot path segments
  // Check before URL parsing since the URL constructor normalizes these away
  if (/\/\.\.?(\/|$)/.test(clientId)) {
    throw new InputError(
      'Invalid client_id: path must not contain dot segments',
    );
  }

  let url: URL;
  try {
    url = new URL(clientId);
  } catch {
    throw new InputError('Invalid client_id: not a valid URL');
  }

  const isHttps = url.protocol === 'https:';
  const isLocalHttp =
    url.protocol === 'http:' &&
    (url.hostname === 'localhost' || url.hostname === '127.0.0.1') &&
    process.env.NODE_ENV === 'development';

  if (!isHttps && !isLocalHttp) {
    throw new InputError(
      'Invalid client_id: must use HTTPS (or HTTP for localhost in development)',
    );
  }

  if (url.pathname === '' || url.pathname === '/') {
    throw new InputError('Invalid client_id: must have a path component');
  }

  if (url.hash) {
    throw new InputError('Invalid client_id: must not contain a fragment');
  }

  if (url.username || url.password) {
    throw new InputError('Invalid client_id: must not contain credentials');
  }

  // Per IETF draft: SHOULD NOT include a query string
  // We reject this for stricter compliance and security
  if (url.search) {
    throw new InputError('Invalid client_id: must not contain a query string');
  }

  return url;
}

/**
 * Checks if a client_id is a valid CIMD URL.
 * Requires HTTPS for production, but allows HTTP for localhost (development).
 */
export function isCimdUrl(clientId: string): boolean {
  try {
    validateCimdUrl(clientId);
    return true;
  } catch {
    return false;
  }
}

/**
 * SSRF (Server-Side Request Forgery) Protection
 *
 * When fetching CIMD metadata from client-provided URLs, we must prevent
 * attackers from tricking Backstage into accessing internal resources.
 * For example, an attacker could provide a URL that resolves to:
 *   - 127.0.0.1 (localhost services)
 *   - 10.x.x.x, 172.16-31.x.x, 192.168.x.x (internal network)
 *   - Cloud metadata endpoints (169.254.169.254)
 *
 * We use ipaddr.js to check if resolved IPs are in non-public ranges.
 * Only 'unicast' (public internet) addresses are allowed.
 *
 * @see https://datatracker.ietf.org/doc/draft-ietf-oauth-client-id-metadata-document/
 *      Section 5.1 - Security Considerations
 */
function isNonPublicIp(ip: string): boolean {
  try {
    const addr = ipaddr.parse(ip);
    const range = addr.range();
    // Only allow public unicast addresses
    return range !== 'unicast';
  } catch {
    // If we can't parse the IP, treat it as non-public and block it
    return true;
  }
}

async function validateHostNotPrivate(hostname: string): Promise<void> {
  try {
    const addresses = await lookup(hostname, { all: true });
    const nonPublicAddr = addresses.find(addr => isNonPublicIp(addr.address));
    if (nonPublicAddr) {
      throw new InputError('Invalid client_id URL');
    }
  } catch (error) {
    if (error instanceof InputError) throw error;
    throw new InputError('Failed to fetch client metadata');
  }
}

function validateMetadata(
  metadata: CimdMetadata,
  expectedClientId: string,
): void {
  if (metadata.client_id !== expectedClientId) {
    throw new InputError('Client ID mismatch in metadata document');
  }

  if (
    !Array.isArray(metadata.redirect_uris) ||
    metadata.redirect_uris.length === 0
  ) {
    throw new InputError('Metadata must include at least one redirect_uri');
  }

  if (
    metadata.client_secret !== undefined ||
    metadata.client_secret_expires_at !== undefined
  ) {
    throw new InputError('Client metadata must not contain client_secret');
  }

  if (
    metadata.token_endpoint_auth_method &&
    FORBIDDEN_AUTH_METHODS.includes(metadata.token_endpoint_auth_method)
  ) {
    throw new InputError('Client metadata uses forbidden auth method');
  }
}

/**
 * Fetches and validates a CIMD metadata document.
 * @throws InputError if fetching or validation fails
 */
export async function fetchCimdMetadata(
  clientId: string,
): Promise<CimdClientInfo> {
  const url = validateCimdUrl(clientId);

  // Skip SSRF validation for localhost in development only
  const isLocalhostDev =
    (url.hostname === 'localhost' || url.hostname === '127.0.0.1') &&
    process.env.NODE_ENV === 'development';
  if (!isLocalhostDev) {
    await validateHostNotPrivate(url.hostname);
  }

  let response: Response;
  try {
    response = await fetch(url.toString(), {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
  } catch {
    throw new InputError('Failed to fetch client metadata');
  }

  if (!response.ok) {
    throw new InputError('Failed to fetch client metadata');
  }

  const text = await response.text();

  let metadata: CimdMetadata;
  try {
    metadata = JSON.parse(text);
  } catch {
    throw new InputError('Invalid client metadata document');
  }

  validateMetadata(metadata, clientId);

  return {
    clientId: metadata.client_id,
    clientName: metadata.client_name || metadata.client_id,
    redirectUris: metadata.redirect_uris,
    responseTypes: metadata.response_types || ['code'],
    grantTypes: metadata.grant_types || ['authorization_code'],
    scope: metadata.scope,
  };
}
