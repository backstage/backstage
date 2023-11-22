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

import { AnyApiFactory } from '@backstage/core-plugin-api';
import { PortableSchema } from '../schema';
import {
  ExtensionInputValues,
  createExtension,
  coreExtensionData,
} from '../wiring';
import { AnyExtensionInputMap } from '../wiring/createExtension';
import { Expand } from '../types';

/** @public */
export function createApiExtension<
  TConfig extends {},
  TInputs extends AnyExtensionInputMap,
>(options: {
  factory:
    | AnyApiFactory
    | ((options: {
        config: TConfig;
        inputs: Expand<ExtensionInputValues<TInputs>>;
      }) => AnyApiFactory);
  namespace?: string;
  name?: string;
  configSchema?: PortableSchema<TConfig>;
  inputs?: TInputs;
}) {
  const { factory, configSchema, inputs: extensionInputs } = options;

  return createExtension({
    kind: 'api',
    namespace: options.namespace,
    name: options.name,
    attachTo: { id: 'core', input: 'apis' },
    inputs: extensionInputs,
    configSchema,
    output: {
      api: coreExtensionData.apiFactory,
    },
    factory({ config, inputs }) {
      if (typeof factory === 'function') {
        return { api: factory({ config, inputs }) };
      }
      return { api: factory };
    },
  });
}
