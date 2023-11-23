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

import React, { ComponentType, lazy } from 'react';
import { ExtensionBoundary } from '../components';
import { PortableSchema } from '../schema';
import {
  createExtension,
  Extension,
  ExtensionInputValues,
  AnyExtensionInputMap,
  createExtensionDataRef,
} from '../wiring';
import { Expand } from '../types';
import { SignInPageProps } from '@backstage/core-plugin-api';

/** @internal */
export const signInPageComponentDataRef =
  createExtensionDataRef<ComponentType<SignInPageProps>>('core.signInPage');

/**
 *
 * @public
 */
export function createSignInPageExtension<
  TConfig extends {},
  TInputs extends AnyExtensionInputMap,
>(options: {
  id: string;
  attachTo?: { id: string; input: string };
  configSchema?: PortableSchema<TConfig>;
  disabled?: boolean;
  inputs?: TInputs;
  loader: (options: {
    config: TConfig;
    inputs: Expand<ExtensionInputValues<TInputs>>;
  }) => Promise<ComponentType<SignInPageProps>>;
}): Extension<TConfig> {
  const { id } = options;

  return createExtension({
    id,
    attachTo: options.attachTo ?? { id: 'core.router', input: 'signInPage' },
    configSchema: options.configSchema,
    inputs: options.inputs,
    disabled: options.disabled,
    output: {
      component: signInPageComponentDataRef,
    },
    factory({ config, inputs, source }) {
      const ExtensionComponent = lazy(() =>
        options
          .loader({ config, inputs })
          .then(component => ({ default: component })),
      );

      return {
        component: props => (
          <ExtensionBoundary id={id} source={source} routable>
            <ExtensionComponent {...props} />
          </ExtensionBoundary>
        ),
      };
    },
  });
}
