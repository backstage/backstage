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

/**
 * Finds an element extension of a deferred plugin that has config in
 * `app.extensions`.
 *
 * @remarks
 *
 * The stub of an element outputs the data that was declared for it in the
 * source code, so any config for it can only be applied once the plugin is
 * loaded. Plugins with such config are loaded right after the app has
 * started.
 *
 * @returns The ID of the first configured element extension, if any.
 */
export function findDeferredConfigConflict(
  manifest: FrontendFeatureManifest,
  parameters: ExtensionParameters[],
): string | undefined {
  const configuredIds = new Set(
    parameters.filter(param => param.config !== undefined).map(p => p.id),
  );
  return manifest.extensions.find(
    extension => extension.element && configuredIds.has(extension.id),
  )?.id;
}
