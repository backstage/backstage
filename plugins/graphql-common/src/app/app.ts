import { envelop, useExtendContext } from '@envelop/core';
import { useGraphQLModules } from '@envelop/graphql-modules';
import { createApplication, Module } from 'graphql-modules';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { Catalog } from './modules/catalog/catalog';
import { Core } from './modules/core/core';
import { transformDirectives } from './mappers';
import { EntityRef, EnvelopPlugins } from './types';
import { useDataLoader } from '@envelop/dataloader';
import DataLoader from 'dataloader';
import { stringifyEntityRef } from '@backstage/catalog-model';

export type createGraphQLAppOptions<Plugins extends EnvelopPlugins, Loader extends DataLoader<any, any>> = {
  loader: () => Loader
  plugins?: Plugins,
  modules?: Module[],
  refToId?: (ref: EntityRef) => string,
}

const defaultRefToId = (ref: EntityRef) => {
  return typeof ref === 'string' ? ref : stringifyEntityRef(ref)
}

export function createGraphQLApp<
  Plugins extends EnvelopPlugins,
  Loader extends DataLoader<any, any>
>(options: createGraphQLAppOptions<Plugins, Loader>) {
  const { modules, plugins, loader, refToId = defaultRefToId } = options;
  const application = createApplication({
    schemaBuilder: ({ typeDefs, resolvers }) =>
      transformDirectives(
        makeExecutableSchema({ typeDefs, resolvers }),
      ),
    modules: [Core, Catalog, ...modules ?? []],
  });

  const run = envelop({
    plugins: [
      useGraphQLModules(application),
      useDataLoader('loader', loader),
      useExtendContext(() => ({ refToId })),
      ...plugins ?? []
    ],
  });

  return { run, application };
}
