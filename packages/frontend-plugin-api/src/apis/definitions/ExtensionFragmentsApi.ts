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

import { JSX } from 'react';
import { createApiRef } from '../system';

/**
 * Looks up React fragments contributed by installed plugins.
 *
 * @remarks
 * Fragments inherit React context from the location where they are rendered.
 * Looking up a fragment does not invoke its loader or render it.
 *
 * @alpha
 */
export interface ExtensionFragmentsApi {
  /**
   * Returns a fragment by its full extension ID, including the `fragment:` kind,
   * or `undefined` if the extension is missing, disabled, or excluded by a predicate.
   */
  getFragment(extensionId: string): JSX.Element | undefined;
}

/**
 * The API reference for {@link ExtensionFragmentsApi}.
 *
 * @alpha
 */
export const extensionFragmentsApiRef =
  createApiRef<ExtensionFragmentsApi>().with({
    id: 'core.extension-fragments',
    pluginId: 'app',
  });
