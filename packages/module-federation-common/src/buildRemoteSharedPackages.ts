/*
 * Copyright 2025 The Backstage Authors
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

import { SharedImport } from './types';
import type { moduleFederationPlugin } from '@module-federation/sdk';

/**
 * @public
 */
export function buildRemoteSharedPackages(
  sharedImports: SharedImport[],
): moduleFederationPlugin.SharedObject {
  return Object.fromEntries(
    sharedImports.map(p => [
      p.name,
      {
        singleton: true,
        requiredVersion: p.requiredVersion ?? '*',
        eager: false,
        ...(p.importInRemote === undefined ? {} : { import: p.importInRemote }),
      },
    ]),
  );
}
