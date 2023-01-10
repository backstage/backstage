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
import { envelop, useExtendContext } from '@envelop/core';
import { useGraphQLModules } from '@envelop/graphql-modules';
import { createApplication, Module } from 'graphql-modules';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { Core } from './core/core';
import { mapDirectives } from './mapDirectives';
import { EnvelopPlugins } from './types';
import { useDataLoader } from '@envelop/dataloader';
import DataLoader from 'dataloader';
import {
  CompoundEntityRef,
  stringifyEntityRef,
} from '@backstage/catalog-model';

/** @public */
export type createGraphQLAppOptions<
  Plugins extends EnvelopPlugins,
  Loader extends DataLoader<any, any>,
> = {
  loader: () => Loader;
  plugins?: Plugins;
  modules?: Module[];
  refToId?: (ref: CompoundEntityRef | string) => string;
};

const defaultRefToId = (ref: CompoundEntityRef | string) => {
  return typeof ref === 'string' ? ref : stringifyEntityRef(ref);
};

/** @public */
export function createGraphQLApp<
  Plugins extends EnvelopPlugins,
  Loader extends DataLoader<any, any>,
>(options: createGraphQLAppOptions<Plugins, Loader>) {
  const { modules, plugins, loader, refToId = defaultRefToId } = options;
  const application = createApplication({
    schemaBuilder: ({ typeDefs, resolvers }) =>
      mapDirectives(makeExecutableSchema({ typeDefs, resolvers })),
    modules: [Core, ...(modules ?? [])],
  });

  const run = envelop({
    plugins: [
      useGraphQLModules(application),
      useDataLoader('loader', loader),
      useExtendContext(() => ({ refToId })),
      ...(plugins ?? []),
    ],
  });

  return { run, application };
}
