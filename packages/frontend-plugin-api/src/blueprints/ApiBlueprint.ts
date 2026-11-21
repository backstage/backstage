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

import { ApiFactory } from '../apis/system';
import { createExtensionBlueprint, createExtensionDataRef } from '../wiring';
import {
  createExtensionBlueprintParams,
  ExtensionBlueprintParams,
} from '../wiring/createExtensionBlueprint';
import { withBlueprintIdentity } from '../wiring/withBlueprintIdentity';

const factoryDataRef = createExtensionDataRef<ApiFactory>().with({
  id: 'core.api.factory',
});

/**
 * Creates utility API extensions.
 *
 * @public
 */
export const ApiBlueprint = withBlueprintIdentity(
  '@backstage/frontend-plugin-api#ApiBlueprint',
  createExtensionBlueprint({
    kind: 'api',
    attachTo: { id: 'root', input: 'apis' },
    output: [factoryDataRef],
    dataRefs: {
      factory: factoryDataRef,
    },
    defineParams: <
      TApi,
      TImpl extends TApi,
      TDeps extends { [name in string]: unknown },
      TApiRef extends { readonly id: string } = { readonly id: string },
      TDepRefs extends { [name in string]: { readonly id: string } } = {
        [name in string]: { readonly id: string };
      },
    >(
      // The API ref and deps are also inferred on their own, so that the IDs
      // of the refs are recorded in the literals of the extension
      params: ApiFactory<TApi, TImpl, TDeps> & {
        api: TApiRef;
        deps: TDepRefs;
      },
    ) =>
      createExtensionBlueprintParams(
        params as ApiFactory,
      ) as ExtensionBlueprintParams<
        ApiFactory,
        {
          apiRefId: TApiRef['id'];
          // Whether the ref declares the API as a promise. It's a boolean for
          // a ref with no declared type, so that it can be assigned from any ref
          apiIsPromise: TApiRef extends { readonly T: infer TValue }
            ? [TValue] extends [PromiseLike<unknown>]
              ? true
              : false
            : boolean;
          deps: { [name in keyof TDepRefs]: TDepRefs[name]['id'] };
        }
      >,
    *factory(params) {
      yield factoryDataRef(params);
    },
  }),
);
