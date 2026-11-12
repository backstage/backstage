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

import { ExtensionParameters } from '../tree/readAppExtensionsConfig';
import { FrontendFeatureManifest } from '@internal/frontend';

function isOfType(value: unknown, type: string | undefined) {
  if (!type) {
    return true;
  }
  const actual = value === null ? 'null' : typeof value;
  return actual === type;
}

/**
 * Finds an element extension of a deferred plugin that has config in
 * `app.extensions` that its stub can't apply.
 *
 * @remarks
 *
 * The stub of an element applies config to the outputs that the factory of
 * its blueprint sets to the config value, and leaves the config that only
 * affects the element to the real extension. Any other config, or config of
 * an unexpected type, can only be applied once the plugin is loaded. That
 * includes empty strings and zero, since the build-time analysis of the
 * factory assumes that the value isn't empty. Plugins with such config are
 * loaded right after the app has started.
 *
 * @returns The ID of the first such element extension, if any.
 */
export function findDeferredConfigConflict(
  manifest: FrontendFeatureManifest,
  parameters: ExtensionParameters[],
): string | undefined {
  for (const extension of manifest.extensions) {
    const element = extension.element;
    if (!element) {
      continue;
    }
    for (const param of parameters) {
      if (param.id !== extension.id || param.config === undefined) {
        continue;
      }
      const config = param.config as { [key: string]: unknown } | null;
      if (typeof config !== 'object' || config === null) {
        return extension.id;
      }
      for (const [key, value] of Object.entries(config)) {
        const output = element.configOutputs?.[key];
        if (output) {
          if (
            value !== undefined &&
            (!isOfType(value, output.type) || value === '' || value === 0)
          ) {
            return extension.id;
          }
        } else if (!element.loadedConfig?.includes(key)) {
          return extension.id;
        }
      }
    }
  }
  return undefined;
}
