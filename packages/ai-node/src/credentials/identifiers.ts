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

import type { Credential } from '@earendil-works/pi-ai';
import type { CredentialScope } from './types';

const MAX_IDENTIFIER_LENGTH = 512;

/**
 * Rejects identifiers that would make scope or provider keys ambiguous, or
 * that cannot be compared verbatim.
 */
export function assertIdentifier(value: unknown, what: string): string {
  if (
    typeof value !== 'string' ||
    value.length === 0 ||
    value.length > MAX_IDENTIFIER_LENGTH ||
    value !== value.trim() ||
    // eslint-disable-next-line no-control-regex
    /[\u0000-\u001f\u007f]/.test(value)
  ) {
    throw new Error(
      `Invalid ${what}: expected a non-empty string of at most ${MAX_IDENTIFIER_LENGTH} characters without control characters or surrounding whitespace`,
    );
  }
  return value;
}

/**
 * Encodes a credential scope as the key used by the config map and by the
 * database rows. The `kind` prefix guarantees that a user identifier can never
 * collide with an organization or service key, because identifiers may
 * themselves contain a colon (`user:default/guest`).
 */
export function scopeKeyOf(scope: CredentialScope): string {
  if (typeof scope !== 'object' || scope === null) {
    throw new Error('Invalid credential scope: expected an object');
  }
  switch (scope.kind) {
    case 'org':
      return 'org';
    case 'user':
      return encodeScopedKey('user', scope.id);
    case 'service':
      return encodeScopedKey('service', scope.id);
    default:
      throw new Error(
        `Unsupported credential scope kind: ${JSON.stringify(
          (scope as { kind?: unknown }).kind,
        )}`,
      );
  }
}

function encodeScopedKey(kind: 'user' | 'service', id: unknown): string {
  return `${kind}:${assertIdentifier(id, `${kind} scope id`)}`;
}

/**
 * Validates credential shape. Only type-tagged, fully specified credentials are
 * accepted, so a malformed credential can never reach a provider as an
 * accidental ambient fallback.
 */
export function assertCredential(value: unknown, what: string): Credential {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error(`Invalid ${what}: expected a credential object`);
  }
  const credential = value as Record<string, unknown>;
  if (credential.type === 'api_key') {
    if (
      (credential.key !== undefined && typeof credential.key !== 'string') ||
      (credential.env !== undefined &&
        (typeof credential.env !== 'object' ||
          credential.env === null ||
          Array.isArray(credential.env) ||
          Object.values(credential.env).some(v => typeof v !== 'string')))
    ) {
      throw new Error(
        `Invalid ${what}: an api_key credential requires a string key and string env values`,
      );
    }
    return credential as Credential;
  }
  if (credential.type === 'oauth') {
    if (
      typeof credential.refresh !== 'string' ||
      typeof credential.access !== 'string' ||
      typeof credential.expires !== 'number'
    ) {
      throw new Error(
        `Invalid ${what}: an oauth credential requires string refresh, access and numeric expires`,
      );
    }
    return credential as Credential;
  }
  throw new Error(
    `Invalid ${what}: expected credential type "api_key" or "oauth"`,
  );
}

/**
 * Validates the trusted host supplied read-only credential map and keys it by
 * scope.
 */
export function parseConfigCredentials(
  configCredentials: ReadonlyMap<string, ReadonlyMap<string, Credential>>,
): ReadonlyMap<string, ReadonlyMap<string, Credential>> {
  if (!isReadonlyMap(configCredentials)) {
    throw new Error(
      'Invalid configCredentials: expected a map of scope key to provider credentials',
    );
  }
  const scopes = new Map<string, ReadonlyMap<string, Credential>>();
  for (const [scopeKey, entries] of configCredentials) {
    const key = parseConfigScopeKey(scopeKey);
    if (scopes.has(key)) {
      throw new Error(`Duplicate credential scope in config: ${key}`);
    }
    if (!isReadonlyMap(entries)) {
      throw new Error(
        `Invalid configCredentials for scope ${key}: expected a map of provider ID to credential`,
      );
    }
    const providers = new Map<string, Credential>();
    for (const [providerId, credential] of entries) {
      const id = assertIdentifier(providerId, 'provider ID');
      if (providers.has(id)) {
        throw new Error(`Duplicate provider ID in config: ${key}/${id}`);
      }
      providers.set(
        id,
        assertCredential(credential, `credential ${key}/${id}`),
      );
    }
    scopes.set(key, providers);
  }
  return scopes;
}

function parseConfigScopeKey(scopeKey: unknown): string {
  const key = assertIdentifier(scopeKey, 'config credential scope key');
  if (key === 'org') {
    return key;
  }
  if (key.startsWith('service:')) {
    return encodeScopedKey('service', key.slice('service:'.length));
  }
  throw new Error(
    'Invalid config credential scope: expected exactly "org" or "service:<id>"; user scopes must use the encrypted store',
  );
}

function isReadonlyMap(value: unknown): value is ReadonlyMap<string, unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as Map<unknown, unknown>).get === 'function' &&
    typeof (value as Record<symbol, unknown>)[Symbol.iterator] === 'function'
  );
}
