/*
 * Copyright 2026 The Backstage Authors
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

import { ApiHolder } from '../apis/system';
import { createExtensionBlueprint, createExtensionDataRef } from '../wiring';

/**
 * @public
 */
export type ExtensionPredicateContextProviderResolver = (options: {
  apis: ApiHolder;
}) => string[];

/**
 * @public
 */
export type ExtensionPredicateContextProviderLoader = (options: {
  apis: ApiHolder;
}) => Promise<string[]>;

const resolverDataRef =
  createExtensionDataRef<ExtensionPredicateContextProviderResolver>().with({
    id: 'core.extension-predicate-context-provider.resolver',
  });

const loaderDataRef =
  createExtensionDataRef<ExtensionPredicateContextProviderLoader>().with({
    id: 'core.extension-predicate-context-provider.loader',
  });

/**
 * @public
 */
export type ExtensionPredicateContextProviderSyncParams = {
  resolver: ExtensionPredicateContextProviderResolver;
  loader?: never;
};

/**
 * @public
 */
export type ExtensionPredicateContextProviderAsyncParams = {
  loader: ExtensionPredicateContextProviderLoader;
  resolver?: never;
};

/**
 * Creates extensions that provide predicate context values, either
 * synchronously via `resolver` or asynchronously via `loader`.
 *
 * @public
 */
export const ExtensionPredicateContextProviderBlueprint =
  createExtensionBlueprint({
    kind: 'extension-predicate-context-provider',
    attachTo: { id: 'root', input: 'predicateContextProviders' },
    output: [resolverDataRef.optional(), loaderDataRef.optional()],
    dataRefs: {
      resolver: resolverDataRef,
      loader: loaderDataRef,
    },
    *factory(
      params:
        | ExtensionPredicateContextProviderSyncParams
        | ExtensionPredicateContextProviderAsyncParams,
    ) {
      if ('resolver' in params && params.resolver) {
        yield resolverDataRef(params.resolver);
      } else if ('loader' in params && params.loader) {
        yield loaderDataRef(params.loader);
      }
    },
  });
