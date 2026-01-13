/*
 * Copyright 2024 The Backstage Authors
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
 * Parses an extension ID to extract the plugin ID.
 *
 * Extension IDs follow these patterns:
 * - `<pluginId>` - e.g., "catalog"
 * - `<pluginId>/<name>` - e.g., "catalog/my-api"
 * - `<kind>:<pluginId>` - e.g., "api:catalog"
 * - `<kind>:<pluginId>/<name>` - e.g., "api:catalog/my-api"
 *
 * @param extensionId - The extension ID to parse
 * @returns The plugin ID, or `undefined` if parsing fails
 * @internal
 */
export function parseExtensionId(extensionId: string): string | undefined {
  if (!extensionId || typeof extensionId !== 'string') {
    return undefined;
  }

  // Handle format: <kind>:<pluginId> or <kind>:<pluginId>/<name>
  const kindMatch = extensionId.match(/^([^:]+):(.+)$/);
  if (kindMatch) {
    const afterKind = kindMatch[2];
    if (!afterKind) {
      return undefined;
    }
    // Extract plugin ID (everything before the first '/')
    const pluginId = afterKind.split('/')[0];
    return pluginId || undefined;
  }

  // Handle format: <pluginId> or <pluginId>/<name>
  // Skip if it's just '/' or ends with ':'
  if (extensionId === '/' || extensionId === ':' || extensionId.endsWith(':')) {
    return undefined;
  }
  const pluginId = extensionId.split('/')[0];
  return pluginId || undefined;
}
