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

/**
 * Maximum size of a CIMD metadata document in bytes.
 * Per the IETF draft, servers should limit to 5KB.
 */
const MAX_DOCUMENT_SIZE = 5 * 1024;

/**
 * Timeout for fetching CIMD metadata documents in milliseconds.
 */
const FETCH_TIMEOUT_MS = 10000;

/**
 * Represents the metadata document fetched from a CIMD URL.
 */
export interface CimdMetadata {
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

/**
 * Represents a validated CIMD client.
 */
export interface CimdClientInfo {
  clientId: string;
  clientName: string;
  redirectUris: string[];
  responseTypes: string[];
  grantTypes: string[];
  scope?: string;
}

/**
 * Checks if a client_id is a CIMD URL.
 *
 * A valid CIMD URL must:
 * - Use https:// scheme
 * - Have a path component (not just the domain)
 */
export function isCimdUrl(clientId: string): boolean {
  try {
    const url = new URL(clientId);
    return (
      url.protocol === 'https:' && url.pathname !== '' && url.pathname !== '/'
    );
  } catch {
    return false;
  }
}

/**
 * Validates a CIMD URL before fetching.
 *
 * @throws InputError if the URL is invalid
 */
export function validateCimdUrl(clientId: string): URL {
  let url: URL;
  try {
    url = new URL(clientId);
  } catch {
    throw new InputError('Invalid client_id URL format');
  }

  if (url.protocol !== 'https:') {
    throw new InputError('Invalid client_id URL format');
  }

  if (url.pathname === '' || url.pathname === '/') {
    throw new InputError('Invalid client_id URL format');
  }

  if (url.hash) {
    throw new InputError('Invalid client_id URL format');
  }

  if (url.username || url.password) {
    throw new InputError('Invalid client_id URL format');
  }

  // Note: The URL constructor automatically normalizes dot segments (./ and ../),
  // so we don't need to check for them explicitly

  return url;
}

/**
 * Checks if an IP address is private/loopback.
 */
function isPrivateIp(ip: string): boolean {
  // IPv4 private ranges
  if (
    ip.startsWith('10.') ||
    ip.startsWith('192.168.') ||
    ip.startsWith('127.') ||
    ip === 'localhost'
  ) {
    return true;
  }

  // 172.16.0.0 - 172.31.255.255
  if (ip.startsWith('172.')) {
    const secondOctet = parseInt(ip.split('.')[1], 10);
    if (secondOctet >= 16 && secondOctet <= 31) {
      return true;
    }
  }

  // IPv6 loopback and private
  if (ip === '::1' || ip.startsWith('fc') || ip.startsWith('fd')) {
    return true;
  }

  // Link-local
  if (ip.startsWith('169.254.') || ip.startsWith('fe80:')) {
    return true;
  }

  return false;
}

/**
 * Validates that a hostname does not resolve to a private IP.
 *
 * @throws InputError if the hostname resolves to a private IP
 */
async function validateHostNotPrivate(hostname: string): Promise<void> {
  try {
    const addresses = await lookup(hostname, { all: true });
    for (const addr of addresses) {
      if (isPrivateIp(addr.address)) {
        throw new InputError('Invalid client_id URL');
      }
    }
  } catch (error) {
    if (error instanceof InputError) {
      throw error;
    }
    throw new InputError('Failed to fetch client metadata');
  }
}

/**
 * Validates the fetched CIMD metadata document.
 *
 * @throws InputError if the document is invalid
 */
function validateMetadata(metadata: CimdMetadata, clientIdUrl: string): void {
  // client_id must exactly match the URL
  if (metadata.client_id !== clientIdUrl) {
    throw new InputError('Client ID mismatch in metadata document');
  }

  // redirect_uris must be present and non-empty
  if (
    !metadata.redirect_uris ||
    !Array.isArray(metadata.redirect_uris) ||
    metadata.redirect_uris.length === 0
  ) {
    throw new InputError('Invalid client metadata document');
  }

  // Must NOT contain client_secret
  if (metadata.client_secret !== undefined) {
    throw new InputError('Client metadata must not contain client_secret');
  }

  // Must NOT contain client_secret_expires_at
  if (metadata.client_secret_expires_at !== undefined) {
    throw new InputError('Client metadata must not contain client_secret');
  }

  // token_endpoint_auth_method must not be secret-based
  const forbiddenAuthMethods = [
    'client_secret_basic',
    'client_secret_post',
    'client_secret_jwt',
  ];
  if (
    metadata.token_endpoint_auth_method &&
    forbiddenAuthMethods.includes(metadata.token_endpoint_auth_method)
  ) {
    throw new InputError('Invalid client metadata document');
  }
}

/**
 * Fetches and validates a CIMD metadata document.
 *
 * @param clientId - The client_id URL to fetch metadata from
 * @returns The validated client information
 * @throws InputError if fetching or validation fails
 */
export async function fetchCimdMetadata(
  clientId: string,
): Promise<CimdClientInfo> {
  const url = validateCimdUrl(clientId);

  // SSRF protection: ensure hostname doesn't resolve to private IP
  await validateHostNotPrivate(url.hostname);

  // Fetch the metadata document
  let response: Response;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
  } catch (error) {
    throw new InputError('Failed to fetch client metadata');
  }

  if (!response.ok) {
    throw new InputError('Failed to fetch client metadata');
  }

  // Check content length if available
  const contentLength = response.headers.get('content-length');
  if (contentLength && parseInt(contentLength, 10) > MAX_DOCUMENT_SIZE) {
    throw new InputError('Client metadata document exceeds size limit');
  }

  // Read response with size limit
  const text = await response.text();
  if (text.length > MAX_DOCUMENT_SIZE) {
    throw new InputError('Client metadata document exceeds size limit');
  }

  // Parse JSON
  let metadata: CimdMetadata;
  try {
    metadata = JSON.parse(text);
  } catch {
    throw new InputError('Invalid client metadata document');
  }

  // Validate the metadata
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
