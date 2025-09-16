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
import type { UserOptions } from '@module-federation/runtime/types';
import { ForwardedError } from '@backstage/errors';

/**
 * @public
 */
export async function buildHostSharedPackages(
  sharedImports: SharedImport[],
): Promise<{
  shared: UserOptions['shared'];
  errors: ForwardedError[];
}> {
  const result: UserOptions['shared'] = {};
  const errors: ForwardedError[] = [];
  for (const sharedImport of sharedImports) {
    try {
      const module = await sharedImport.module();
      result[sharedImport.name] = {
        version: sharedImport.version ?? '*',
        lib: () => module,
        shareConfig: {
          singleton: true,
          requiredVersion: sharedImport.requiredVersion ?? '*',
          eager:
            sharedImport.eagerInHost === undefined
              ? true
              : sharedImport.eagerInHost,
        },
      };
    } catch (e) {
      errors.push(
        new ForwardedError(
          `Failed to dynamically import "${sharedImport.name}" and add it to module federation shared packages:`,
          e,
        ),
      );
    }
  }

  return { shared: result, errors };
}
