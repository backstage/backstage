import { errorHandler } from '@backstage/backend-common';
import express from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';
import { graphqlHTTP } from 'express-graphql';
import { printSchema } from 'graphql';
import type { Module } from 'graphql-modules';
import { createGraphQLApp } from './app';
import { createLoader } from './loaders';
import type { EnvelopPlugins } from './types';
import type { CatalogClient } from '@backstage/catalog-client';

export * from './app';
export * from './loaders';
export type { Loader as EntityLoader } from './types';
export { transformSchema } from './transform';

export type RouterOptions = {
  logger: Logger;
  catalog: CatalogClient;
  modules?: Module[];
  plugins?: EnvelopPlugins;
};

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger } = options;

  const { run, application } = createGraphQLApp({
    modules: options.modules,
    loader: () => createLoader(options.catalog),
    plugins: options.plugins,
  });

  const router = Router();
  router.use(express.json());
  router.use((_, res, next) => {
    res.setHeader('Content-Security-Policy', "'self' http: 'unsafe-inline'");
    next();
  });

  router.get('/schema', (_, response) => {
    response.send(printSchema(application.schema))
  });

  router.use('/', graphqlHTTP(async () => {
    const { parse, validate, contextFactory, execute } = run();
    return {
      schema: application.schema,
      graphiql: true,
      customParseFn: parse,
      customValidateFn: validate,
      customExecuteFn: async args => {
        return execute({
          ...args,
          contextValue: await contextFactory(),
        });
      },
    };
  }));

  router.get('/health', (_, response) => {
    logger.info('PONG!');
    response.send({ status: 'ok' });
  });
  router.use(errorHandler());
  return router;
}
