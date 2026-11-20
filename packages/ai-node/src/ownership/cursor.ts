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

/**
 * Opaque namespace enumeration cursors.
 *
 * @remarks
 *
 * A cursor is bound to the plugin it was issued for and to the last session key
 * it covered, so a cursor cannot be replayed against another plugin or silently
 * rebind to a different ordering.
 *
 * @internal
 */
export function encodeNamespaceCursor(pluginId: string, after: string): string {
  return Buffer.from(JSON.stringify({ pluginId, after }), 'utf8').toString(
    'base64url',
  );
}

/** @internal */
export function decodeNamespaceCursor(
  cursor: string,
  pluginId: string,
): string {
  let decoded: unknown;
  try {
    decoded = JSON.parse(Buffer.from(cursor, 'base64url').toString('utf8'));
  } catch {
    throw new Error('Invalid namespace enumeration cursor');
  }
  const { pluginId: bound, after } = (decoded ?? {}) as {
    pluginId?: unknown;
    after?: unknown;
  };
  if (bound !== pluginId || typeof after !== 'string' || !after) {
    throw new Error('Invalid namespace enumeration cursor');
  }
  return after;
}
