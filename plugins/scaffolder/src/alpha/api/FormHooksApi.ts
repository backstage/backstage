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

import { ApiHolder } from '@backstage/core-plugin-api';
import { ScaffolderFormHooksApi } from './types';
import {
  ScaffolderFormHook,
  ScaffolderInitialFormHook,
} from '@backstage/plugin-scaffolder-react/alpha';

export class DefaultScaffolderFormHooksApi implements ScaffolderFormHooksApi {
  constructor(
    private readonly options: {
      formHooks: Array<ScaffolderInitialFormHook>;
      apiHolder: ApiHolder;
    },
  ) {}

  async getFormHooks(): Promise<ScaffolderFormHook[]> {
    return this.options.formHooks
      .map(hook => {
        try {
          const resolvedDeps = Object.entries(hook.deps ?? {}).map(
            ([key, value]) => {
              const api = this.options.apiHolder.get(value);
              if (!api) {
                // eslint-disable-next-line no-console
                throw new Error(
                  `Failed to resolve apiRef ${value.id} for form hook ${hook.id} - it will be disabled`,
                );
              }
              return [key, api];
            },
          );

          return {
            id: hook.id,
            // todo(blam): should probably use zod to validate the input here
            // or maybe move that to the `createScaffolderFormHook` method instead.
            fn: input => hook.fn(input, Object.fromEntries(resolvedDeps)),
          } as ScaffolderFormHook;
        } catch (ex) {
          // eslint-disable-next-line no-console
          console.error(ex);
          return undefined;
        }
      })
      .filter((h): h is ScaffolderFormHook => !!h);
  }
}
