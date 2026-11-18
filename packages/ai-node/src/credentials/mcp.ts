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

import { createHash } from 'node:crypto';
import type { Credential } from '@earendil-works/pi-ai';
import type { CredentialScope } from './types';
import { assertIdentifier, scopeKeyOf } from './identifiers';

/**
 * The store key for one MCP tool server's credential. MCP server credentials
 * live in the same scoped encrypted stores as provider credentials — user,
 * org, and service scopes, opaque entries, the store's existing contract
 * (modify lock, fail-closed reads, no secret-bearing logs or events)
 * applying unchanged. The `mcp:` prefix keeps tool server entries in a
 * distinct namespace from provider IDs; the consuming tool module interprets
 * the credential kind (S4 discipline), the store never does.
 *
 * @alpha
 */
export function mcpCredentialId(serverId: string): string {
  return `mcp:${assertIdentifier(serverId, 'MCP server id')}`;
}

/** The authority shape a tool dispatch uses for one MCP server credential. */
export type McpToolAuthority = Readonly<{
  /** Bearer-style headers for the tool server request. */
  headers: Readonly<Record<string, string>>;
  /** Host-bound expiry for OAuth access tokens, when the entry carries one. */
  expiresAt?: number;
}>;

/**
 * Interprets one stored MCP server credential for tool dispatch, mirroring
 * the provider credential discipline: an api_key entry must carry a key and
 * becomes a bearer token; an oauth entry becomes a bearer token with its
 * expiry. Anything else fails closed.
 *
 * @alpha
 */
export function interpretMcpCredential(
  credential: Credential,
): McpToolAuthority {
  if (credential.type === 'api_key') {
    if (typeof credential.key !== 'string' || credential.key.length === 0) {
      throw new Error(
        'The stored MCP server credential has no API key; re-authenticate the server',
      );
    }
    return { headers: { authorization: `Bearer ${credential.key}` } };
  }
  if (
    typeof credential.access !== 'string' ||
    credential.access.length === 0 ||
    typeof credential.expires !== 'number' ||
    !Number.isFinite(credential.expires)
  ) {
    throw new Error(
      'The stored MCP server credential has no usable access token; re-authenticate the server',
    );
  }
  return {
    headers: { authorization: `Bearer ${credential.access}` },
    expiresAt: credential.expires,
  };
}

/**
 * Stable, non-reversible identity of one MCP server credential instance,
 * scoped the same way as provider credential generations so a recheck can
 * detect rotation.
 *
 * @alpha
 */
export function mcpCredentialGeneration(
  scope: CredentialScope,
  secret: string,
): string {
  return createHash('sha256')
    .update(`${scopeKeyOf(scope)}:${secret}`)
    .digest('hex')
    .slice(0, 16);
}
