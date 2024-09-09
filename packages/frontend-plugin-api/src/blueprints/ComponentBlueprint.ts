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

import { ComponentRef } from '../components/createComponentRef';
import { createComponentExtension } from '../extensions';
import { createExtensionBlueprint } from '../wiring';
import { ComponentType as ReactComponentType, lazy } from 'react';

export interface ComponentType {
  $$type: '@backstage/component';
}

interface InternalComponentType<TProps extends {}> extends ComponentType {
  ref: ComponentRef<TProps>;
  loader:
    | {
        lazy: () => Promise<ReactComponentType<TProps>>;
      }
    | {
        sync: () => ReactComponentType<TProps>;
      };
}

export function createComponent<TProps extends {}>(options: {
  ref: ComponentRef<TProps>;
  loader:
    | {
        lazy: () => Promise<ReactComponentType<TProps>>;
      }
    | {
        sync: () => ReactComponentType<TProps>;
      };
}): ComponentType {
  return {
    $$type: '@backstage/component',
    ...options,
  };
}

const toInternalComponentType = <T extends {}>(
  type: ComponentType,
): InternalComponentType<T> => {
  if (type.$$type !== '@backstage/component') {
    throw new Error('Not a component');
  }

  return type as InternalComponentType<T>;
};

export const ComponentBlueprint = createExtensionBlueprint({
  kind: 'component',
  attachTo: { id: 'api:app/components', input: 'components' },
  dataRefs: {
    component: createComponentExtension.componentDataRef,
  },
  output: [createComponentExtension.componentDataRef],
  factory(opts: { component: ComponentType }) {
    const options = toInternalComponentType(opts.component);

    if ('sync' in options.loader) {
      return [
        createComponentExtension.componentDataRef({
          ref: options.ref,
          impl: options.loader.sync(),
        }),
      ];
    }
    const lazyLoader = options.loader.lazy;
    const ExtensionComponent = lazy(() =>
      lazyLoader().then(Component => ({
        default: Component,
      })),
    );

    return [
      createComponentExtension.componentDataRef({
        ref: options.ref,
        impl: ExtensionComponent,
      }),
    ];
  },
});
