/*
 * Copyright 2020 The Backstage Authors
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

import { ComponentType, PropsWithChildren } from 'react';
import { TypesToApiRefs, useApiHolder } from '@backstage/frontend-plugin-api';
import { NotImplementedError } from '@backstage/errors';

/**
 * Wrapper for giving component an API context.
 *
 * @param apis - APIs for the context.
 * @public
 */
export function withApis<T extends {}>(apis: TypesToApiRefs<T>) {
  return function withApisWrapper<TProps extends T>(
    WrappedComponent: ComponentType<TProps>,
  ) {
    const Hoc = (props: PropsWithChildren<Omit<TProps, keyof T>>) => {
      const apiHolder = useApiHolder();

      const impls = {} as T;

      for (const key in apis) {
        if (Object.hasOwn(apis, key)) {
          const ref = apis[key];

          const api = apiHolder.get(ref);
          if (!api) {
            throw new NotImplementedError(
              `No implementation available for ${ref}`,
            );
          }
          impls[key] = api;
        }
      }

      return <WrappedComponent {...(props as TProps)} {...impls} />;
    };
    const displayName =
      WrappedComponent.displayName || WrappedComponent.name || 'Component';

    Hoc.displayName = `withApis(${displayName})`;

    return Hoc;
  };
}
