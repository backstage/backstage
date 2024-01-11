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

import { JSX } from 'react';
import { PortableSchema } from '../schema/types';
import { Expand } from '../types';
import { coreExtensionData } from '../wiring/coreExtensionData';
import {
  AnyExtensionInputMap,
  ExtensionDefinition,
  ResolvedExtensionInputs,
  createExtension,
} from '../wiring/createExtension';

/**
 * Creates an extension that renders a React element at the app root, outside of
 * the app layout. This is useful for example for shared popups and similar.
 *
 * @public
 */
export function createAppRootElementExtension<
  TConfig extends {},
  TInputs extends AnyExtensionInputMap,
>(options: {
  namespace?: string;
  name?: string;
  attachTo?: { id: string; input: string };
  configSchema?: PortableSchema<TConfig>;
  disabled?: boolean;
  inputs?: TInputs;
  element:
    | JSX.Element
    | ((options: {
        inputs: Expand<ResolvedExtensionInputs<TInputs>>;
        config: TConfig;
      }) => JSX.Element);
}): ExtensionDefinition<TConfig> {
  return createExtension({
    kind: 'app-root-element',
    namespace: options.namespace,
    name: options.name,
    attachTo: options.attachTo ?? { id: 'app/root', input: 'elements' },
    configSchema: options.configSchema,
    disabled: options.disabled,
    inputs: options.inputs,
    output: {
      element: coreExtensionData.reactElement,
    },
    factory({ inputs, config }) {
      return {
        element:
          typeof options.element === 'function'
            ? options.element({ inputs, config })
            : options.element,
      };
    },
  });
}
