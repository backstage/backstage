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

import { ComponentRef } from '../components';
import { createExtensionBlueprint } from '../wiring';
import { createComponentExtension } from './createComponentExtension';
import { lazy, ComponentType } from 'react';

// this is hard to do with blueprints... no TProps for the elements
export const ComponentBlueprint = createExtensionBlueprint({
  kind: 'component',
  attachTo: { id: 'app', input: 'components' },
  output: [createComponentExtension.componentDataRef],
  dataRefs: {
    component: createComponentExtension.componentDataRef,
  },
  factory(
    {
      ref,
      loader,
    }: {
      ref: ComponentRef<any>;
      loader:
        | {
            lazy: (values: any) => Promise<ComponentType<any>>;
          }
        | {
            sync: (values: any) => ComponentType<any>;
          };
    },
    { config, inputs },
  ) {
    if ('sync' in loader) {
      return [
        createComponentExtension.componentDataRef({
          ref,
          impl: loader.sync({ config, inputs }),
        }),
      ];
    }

    const lazyLoader = loader.lazy;
    const ExtensionComponent = lazy(() =>
      lazyLoader({ config, inputs }).then(Component => ({
        default: Component,
      })),
    );

    return [
      createComponentExtension.componentDataRef({
        ref,
        impl: ExtensionComponent,
      }),
    ];
  },
});
