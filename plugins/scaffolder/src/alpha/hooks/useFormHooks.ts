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
import { useApi, useApiHolder } from '@backstage/core-plugin-api';
import { formHooksApiRef } from '../api/ref';
import useAsync from 'react-use/esm/useAsync';
import { useMemo } from 'react';
import { ScaffolderFormHookContext } from '@backstage/plugin-scaffolder-react/alpha';

/** @internal */
type BoundFieldHook = {
  fn: (ctx: ScaffolderFormHookContext<any>) => Promise<void>;
};

export const useFormHooks = () => {
  const formHooksApi = useApi(formHooksApiRef);
  const { value: hooks } = useAsync(() => formHooksApi.getFormHooks(), []);
  const apiHolder = useApiHolder();

  return useMemo(() => {
    const hooksMap = new Map<string, BoundFieldHook>();

    for (const hook of hooks ?? []) {
      try {
        const resolvedDeps = Object.entries(hook.deps ?? {}).map(
          ([key, value]) => {
            const api = apiHolder.get(value);
            if (!api) {
              throw new Error(
                `Failed to resolve apiRef ${value.id} for form hook ${hook.id} it will be disabled`,
              );
            }
            return [key, api];
          },
        );

        hooksMap.set(hook.id, {
          fn: ctx => hook.fn(ctx, Object.fromEntries(resolvedDeps)),
        });
      } catch (ex) {
        // eslint-disable-next-line no-console
        console.error(ex);
        return undefined;
      }
    }
    return hooksMap;
  }, [apiHolder, hooks]);
};
