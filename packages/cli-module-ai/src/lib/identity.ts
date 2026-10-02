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

import { ResponseError } from '@backstage/errors';

export interface UserIdentity {
  /** The user entity ref, from the `sub` claim. */
  sub: string;
  /** Ownership refs (the user and their groups), from the `ent` claim. */
  ent: string[];
}

export async function fetchIdentity(
  baseUrl: string,
  accessToken: string,
  fetchFn: typeof fetch = fetch,
): Promise<UserIdentity> {
  const url = new URL('/api/auth/v1/userinfo', baseUrl).toString();
  const res = await fetchFn(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
    signal: AbortSignal.timeout(30_000),
  });
  if (res.status === 401 || res.status === 403) {
    throw new Error(
      `Backstage rejected the access token (HTTP ${res.status}). Run "backstage-cli auth login" to sign in again.`,
    );
  }
  if (!res.ok) {
    throw await ResponseError.fromResponse(res);
  }
  return readIdentity(await res.json());
}

function readIdentity(body: unknown): UserIdentity {
  const claims =
    typeof body === 'object' && body !== null && 'claims' in body
      ? body.claims
      : undefined;
  if (
    typeof claims !== 'object' ||
    claims === null ||
    !('sub' in claims) ||
    typeof claims.sub !== 'string' ||
    !claims.sub
  ) {
    throw new Error('The userinfo response did not contain a subject claim');
  }
  const ent =
    'ent' in claims && Array.isArray(claims.ent)
      ? claims.ent.filter((ref): ref is string => typeof ref === 'string')
      : [];
  return { sub: claims.sub, ent };
}
