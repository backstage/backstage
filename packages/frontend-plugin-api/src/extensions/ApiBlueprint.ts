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
import { createExtensionBlueprint } from '../wiring';
import { createApiExtension } from './createApiExtension';
import { AnyApiFactory, AnyApiRef } from '@backstage/core-plugin-api';

export const ApiBlueprint = createExtensionBlueprint({
  kind: 'api',
  attachTo: { id: 'app', input: 'apis' },
  output: [createApiExtension.factoryDataRef],
  dataRefs: {
    factory: createApiExtension.factoryDataRef,
  },
  *factory(
    params: // remove this form.
    | {
          api: AnyApiRef;
          factory: (params: unknown) => AnyApiFactory;
        }
      | {
          factory: AnyApiFactory;
        },
    { config, inputs },
  ) {
    yield createApiExtension.factoryDataRef(
      typeof params.factory === 'function'
        ? params.factory({ config, inputs })
        : params.factory,
    );
  },
  namespace: params => {
    const apiRef =
      'api' in params ? params.api : (params.factory as { api: AnyApiRef }).api;

    return apiRef.id;
  },
});
