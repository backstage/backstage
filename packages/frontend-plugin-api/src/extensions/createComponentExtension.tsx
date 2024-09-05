/*
 * Copyright 2023 The Backstage Authors
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

import { lazy, ComponentType } from 'react';
import { createExtension, createExtensionDataRef } from '../wiring';
import { ComponentRef } from '../components';

/** @public */
export function createComponentExtension<TProps extends {}>(options: {
  ref: ComponentRef<TProps>;
  name?: string;
  disabled?: boolean;
  loader:
    | {
        lazy: () => Promise<ComponentType<TProps>>;
      }
    | {
        sync: () => ComponentType<TProps>;
      };
}) {
  return createExtension({
    kind: 'component',
    name: options.name ?? options.ref.id,
    attachTo: { id: 'api:app/components', input: 'components' },
    disabled: options.disabled,
    output: [createComponentExtension.componentDataRef],
    factory() {
      if ('sync' in options.loader) {
        return [
          createComponentExtension.componentDataRef({
            ref: options.ref,
            impl: options.loader.sync() as ComponentType,
          }),
        ];
      }
      const lazyLoader = options.loader.lazy;
      const ExtensionComponent = lazy(() =>
        lazyLoader().then(Component => ({
          default: Component,
        })),
      ) as unknown as ComponentType;

      return [
        createComponentExtension.componentDataRef({
          ref: options.ref,
          impl: ExtensionComponent,
        }),
      ];
    },
  });
}

/** @public */
export namespace createComponentExtension {
  export const componentDataRef = createExtensionDataRef<{
    ref: ComponentRef;
    impl: ComponentType;
  }>().with({ id: 'core.component.component' });
}
