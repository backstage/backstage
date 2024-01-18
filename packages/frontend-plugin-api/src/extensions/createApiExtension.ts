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

import { AnyApiFactory, AnyApiRef } from '@backstage/core-plugin-api';
import { PortableSchema } from '../schema';
import {
  ResolvedExtensionInputs,
  createExtension,
  createExtensionDataRef,
} from '../wiring';
import { AnyExtensionInputMap } from '../wiring/createExtension';
import { Expand } from '../types';

/** @public */
export function createApiExtension<
  TConfig extends {},
  TInputs extends AnyExtensionInputMap,
>(
  options: (
    | {
        api: AnyApiRef;
        factory: (options: {
          config: TConfig;
          inputs: Expand<ResolvedExtensionInputs<TInputs>>;
        }) => AnyApiFactory;
      }
    | {
        factory: AnyApiFactory;
      }
  ) & {
    configSchema?: PortableSchema<TConfig>;
    inputs?: TInputs;
  },
) {
  const { factory, configSchema, inputs: extensionInputs } = options;

  const apiRef =
    'api' in options ? options.api : (factory as { api: AnyApiRef }).api;

  return createExtension({
    kind: 'api',
    // Since ApiRef IDs use a global namespace we use the namespace here in order to override
    // potential plugin IDs and always end up with the format `api:<api-ref-id>`
    namespace: apiRef.id,
    attachTo: { id: 'app', input: 'apis' },
    inputs: extensionInputs,
    configSchema,
    output: {
      api: createApiExtension.factoryDataRef,
    },
    factory({ config, inputs }) {
      if (typeof factory === 'function') {
        return { api: factory({ config, inputs }) };
      }
      return { api: factory };
    },
  });
}

/** @public */
export namespace createApiExtension {
  export const factoryDataRef =
    createExtensionDataRef<AnyApiFactory>('core.api.factory');
}
