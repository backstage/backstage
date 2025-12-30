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

/** Per the IETF draft, servers should limit metadata documents to 5KB */
const MAX_DOCUMENT_SIZE = 5 * 1024;
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
 * Checks if a client_id is a CIMD URL (HTTPS with a path component).
 */
export function isCimdUrl(clientId: string): boolean {
  try {
    const url = new URL(clientId);
    return url.protocol === 'https:' && !!url.pathname && url.pathname !== '/';
  } catch {
    return false;
  }
}

/**
 * Validates and parses a CIMD URL.
 * @throws InputError if the URL is invalid per the CIMD spec
 */
export function validateCimdUrl(clientId: string): URL {
  let url: URL;
  try {
    url = new URL(clientId);
  } catch {
    throw new InputError('Invalid client_id: not a valid URL');
  }

  const isValid =
    url.protocol === 'https:' &&
    url.pathname !== '' &&
    url.pathname !== '/' &&
    !url.hash &&
    !url.username &&
    !url.password;

  if (!isValid) {
    throw new InputError(
      'Invalid client_id: must be HTTPS with path, no fragment or credentials',
    );
  }

  return url;
}

function isPrivateIp(ip: string): boolean {
  // IPv4 loopback and private ranges
  if (
    ip.startsWith('127.') ||
    ip.startsWith('10.') ||
    ip.startsWith('192.168.')
  ) {
    return true;
  }
  // 172.16.0.0 - 172.31.255.255
  if (ip.startsWith('172.')) {
    const octet = parseInt(ip.split('.')[1], 10);
    if (octet >= 16 && octet <= 31) return true;
  }
  // IPv4 link-local
  if (ip.startsWith('169.254.')) return true;
  // IPv6 loopback, private (fc/fd), and link-local (fe80)
  if (
    ip === '::1' ||
    ip.startsWith('fc') ||
    ip.startsWith('fd') ||
    ip.startsWith('fe80:')
  ) {
    return true;
  }
  return false;
}

async function validateHostNotPrivate(hostname: string): Promise<void> {
  try {
    const addresses = await lookup(hostname, { all: true });
    const privateAddr = addresses.find(addr => isPrivateIp(addr.address));
    if (privateAddr) {
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
  await validateHostNotPrivate(url.hostname);

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

  const contentLength = response.headers.get('content-length');
  if (contentLength && parseInt(contentLength, 10) > MAX_DOCUMENT_SIZE) {
    throw new InputError('Client metadata document exceeds size limit');
  }

  const text = await response.text();
  if (text.length > MAX_DOCUMENT_SIZE) {
    throw new InputError('Client metadata document exceeds size limit');
  }

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
