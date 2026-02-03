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

import { assertError } from '@backstage/errors';
import { exitWithError } from '../lib/errors';

type ActionFunc = (...args: any[]) => Promise<void>;
type ActionExports<TModule extends object> = {
  [KName in keyof TModule as TModule[KName] extends ActionFunc
    ? KName
    : never]: TModule[KName];
};

// Wraps an action function so that it always exits and handles errors
export function lazy<TModule extends object>(
  moduleLoader: () => Promise<TModule>,
  exportName: keyof ActionExports<TModule>,
): (...args: any[]) => Promise<never> {
  return async (...args: any[]) => {
    try {
      const mod = await moduleLoader();
      const actualModule = (
        mod as unknown as { default: ActionExports<TModule> }
      ).default;
      const actionFunc = actualModule[exportName] as ActionFunc;
      await actionFunc(...args);

      process.exit(0);
    } catch (error) {
      assertError(error);
      exitWithError(error);
    }
  };
}
