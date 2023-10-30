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

import React, { lazy } from 'react';
import {
  AnyExtensionInputMap,
  ExtensionInputValues,
  coreExtensionData,
  createExtension,
} from '../wiring';
import { Expand } from '../types';
import { PortableSchema } from '../schema';
import { ExtensionError, ExtensionBoundary, ComponentRef } from '../components';

/** @public */
export function createComponentExtension<
  TRef extends ComponentRef<any>,
  TConfig extends {},
  TInputs extends AnyExtensionInputMap,
>(options: {
  ref: TRef;
  disabled?: boolean;
  inputs?: TInputs;
  configSchema?: PortableSchema<TConfig>;
  component: (values: {
    config: TConfig;
    inputs: Expand<ExtensionInputValues<TInputs>>;
  }) => Promise<TRef['T']>;
}) {
  const id = options.ref.id;
  return createExtension({
    id,
    attachTo: { id: 'core', input: 'components' },
    inputs: options.inputs,
    disabled: options.disabled,
    configSchema: options.configSchema,
    output: {
      component: coreExtensionData.component,
    },
    factory({ config, inputs, source }) {
      const ExtensionComponent = lazy(() =>
        options
          .component({ config, inputs })
          .then(component => ({ default: component }))
          .catch(error => ({
            default: () => <ExtensionError error={error} />,
          })),
      );

      return {
        component: {
          ref: options.ref,
          impl: props => (
            <ExtensionBoundary id={id} source={source}>
              <ExtensionComponent {...props} />
            </ExtensionBoundary>
          ),
        },
      };
    },
  });
}
