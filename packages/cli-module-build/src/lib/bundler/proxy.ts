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

import type { DevServerProxyConfigArray } from '@rspack/core';
import { styleText } from 'node:util';

/**
 * Translates the `proxy` configuration in a package.json to the option names
 * that the Rspack dev server accepts.
 *
 * Only `path` and `logLevel` need translating, as every other renamed or
 * removed option takes a function, which JSON can't express. `context` is left
 * alone, as the dev server accepts it as an alias for `pathFilter`.
 */
export function translateLegacyProxyOptions(
  proxy: unknown,
): DevServerProxyConfigArray | undefined {
  // Any other shape is passed through for the dev server itself to validate.
  if (!Array.isArray(proxy)) {
    return proxy as DevServerProxyConfigArray | undefined;
  }

  const outdated = new Set<string>();

  const translated = proxy.map(entry => {
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
      return entry;
    }

    const { path, logLevel, ...rest } = entry as Record<string, unknown>;

    if (logLevel !== undefined) {
      outdated.add('`logLevel` is no longer supported, and is ignored');
    }
    if (path === undefined) {
      return rest;
    }
    // `context` rather than `pathFilter`, as the legacy WebPack dev server
    // understands `context` too, and fails every proxied request without it.
    outdated.add('`path` is no longer supported, rename it to `context`');

    // Both current options win over `path`: `pathFilter` by spread order, and
    // `context` by the check, so that a half migrated entry resolves the same
    // way on both dev servers.
    return rest.context === undefined ? { pathFilter: path, ...rest } : rest;
  });

  if (outdated.size > 0) {
    // eslint-disable-next-line no-console
    console.warn(
      styleText(
        'yellow',
        `\nDEPRECATION WARNING: The "proxy" configuration in your package.json is out of date:\n${[
          ...outdated,
        ]
          .map(message => `                     - ${message}`)
          .join(
            '\n',
          )}\n                     Support for the old options will be removed in a future release.\n`,
      ),
    );
  }

  return translated as DevServerProxyConfigArray;
}
