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

import { FrontendExtensionManifest, FrontendFeatureManifest } from './types';

type ElementManifest = NonNullable<FrontendExtensionManifest['element']>;

/** The JSON type of a value, as used for config pass-through. */
export function getJsonType(value: unknown): string {
  if (value === null) {
    return 'null';
  }
  return Array.isArray(value) ? 'array' : typeof value;
}

/** Whether the stub of an element can apply a config value itself. */
function canPassThrough(
  element: ElementManifest,
  key: string,
  value: unknown,
): boolean {
  return (
    element.configPassThrough?.[key]?.types.includes(getJsonType(value)) ??
    false
  );
}

/**
 * Finds an element of a deferred plugin that is configured with values that
 * change the data its stub outputs, and that the stub can't apply itself.
 */
export function findDeferredConfigConflict(
  manifest: FrontendFeatureManifest,
  configById: Map<string, { [key: string]: unknown }>,
): { extensionId: string; keys: string[] } | undefined {
  for (const extension of manifest.extensions) {
    const element = extension.element;
    const config = configById.get(extension.id);
    if (!element || !config) {
      continue;
    }
    const keys = Object.keys(config).filter(
      key =>
        (element.dataConfigKeys ?? []).includes(key) &&
        !canPassThrough(element, key, config[key]),
    );
    if (keys.length > 0) {
      return { extensionId: extension.id, keys };
    }
  }
  return undefined;
}

/** Returns the data of an element stub, with the pass-through config applied. */
export function applyConfigPassThrough(
  element: ElementManifest,
  config: { [key: string]: unknown } | undefined,
): { [dataRefId: string]: unknown } {
  const data = { ...element.data };
  for (const [key, value] of Object.entries(config ?? {})) {
    const passThrough = element.configPassThrough?.[key];
    if (passThrough && canPassThrough(element, key, value)) {
      data[passThrough.dataRefId] = value;
    }
  }
  return data;
}
