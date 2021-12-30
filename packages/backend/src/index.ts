/*
 * Copyright 2020 The Backstage Authors
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

/*
 * Hi!
 *
 * Note that this is an EXAMPLE Backstage backend. Please check the README.
 *
 * Happy hacking!
 */

/**
 * Necessary global, *strictly singleton*, import of a metadata container. Should be the first item imported of the app.
 *
 * This is needed by both inversify and nest.js.
 */
import 'reflect-metadata';

import Router from 'express-promise-router';
import {
  CacheManager,
  createServiceBuilder,
  getRootLogger,
  loadBackendConfig,
  notFoundHandler,
  DatabaseManager,
  SingleHostDiscovery,
  UrlReaders,
  useHotMemoize,
  ServerTokenManager,
  DockerContainerRunner,
} from '@backstage/backend-common';
import { Config } from '@backstage/config';
import healthcheck from './plugins/healthcheck';
import { metricsInit, metricsHandler } from './metrics';
import auth from './plugins/auth';
import azureDevOps from './plugins/azure-devops';
import catalog from './plugins/catalog';
import codeCoverage from './plugins/codecoverage';
import kubernetes from './plugins/kubernetes';
import kafka from './plugins/kafka';
import rollbar from './plugins/rollbar';
import scaffolder from './plugins/scaffolder';
import proxy from './plugins/proxy';
import search from './plugins/search';
import techdocs from './plugins/techdocs';
import techInsights from './plugins/techInsights';
import todo from './plugins/todo';
import graphql from './plugins/graphql';
import app from './plugins/app';
import badges from './plugins/badges';
import jenkins from './plugins/jenkins';
import { PluginEnvironment } from './types';
import { Container, interfaces } from 'inversify';
import { CatalogClient } from '@backstage/catalog-client';
import {
  BadgeBuilder,
  DefaultBadgeBuilder,
  injectables as badgesInjectables,
} from '@backstage/plugin-badges-backend';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './AppModule';
import {
  TodoReader,
  injectables as todosInjectables,
} from '@backstage/plugin-todo-backend';
import awilix from 'awilix';
import { TechdocsGenerator } from '@backstage/techdocs-common/dist';
import Docker from 'dockerode';

function makeCreateEnv(config: Config) {
  const root = getRootLogger();
  const reader = UrlReaders.default({ logger: root, config });
  const discovery = SingleHostDiscovery.fromConfig(config);
  const tokenManager = ServerTokenManager.noop();

  root.info(`Created UrlReader ${reader}`);

  const databaseManager = DatabaseManager.fromConfig(config);
  const cacheManager = CacheManager.fromConfig(config);

  return (plugin: string): PluginEnvironment => {
    const logger = root.child({ type: 'plugin', plugin });
    const database = databaseManager.forPlugin(plugin);
    const cache = cacheManager.forPlugin(plugin);
    return { logger, cache, database, config, reader, discovery, tokenManager };
  };
}

async function main() {
  metricsInit();
  const logger = getRootLogger();

  logger.info(
    `You are running an example backend, which is supposed to be mainly used for contributing back to Backstage. ` +
      `Do NOT deploy this to production. Read more here https://backstage.io/docs/getting-started/`,
  );

  const config = await loadBackendConfig({
    argv: process.argv,
    logger,
  });

  const createEnv = makeCreateEnv(config);

  /**
   * IoC container context modification examples.
   *
   * **In most cases these bindings would be omitted and initialized within the module itself instead of in here**
   *
   * The backend package should include these only if an integrator wants to use non-default implementations
   */

  /**
   * Inversify. Same code as in standaloneServer within Inversify package
   */
  const inversifyContainer = new Container();

  /**
   * Using without the need to modify existing subpackages immediately
   */
  inversifyContainer
    .bind<CatalogClient>(badgesInjectables.CatalogClient)
    .toFactory<CatalogClient>(
      (
        /* Already existing application context */ _context: interfaces.Context,
      ) => {
        return () => {
          return new CatalogClient({
            discoveryApi: SingleHostDiscovery.fromConfig(config),
          });
        };
      },
    );

  /**
   * Adding @injectable decoration to a concrete implementation. See {@link DefaultBadgeBuilder}
   */
  inversifyContainer
    .bind<BadgeBuilder>(badgesInjectables.BadgeBuilder)
    .to(DefaultBadgeBuilder);

  // empty line for separation

  /**
   * nest.js IoC
   *
   * See {@link AppModule} for actual registration code
   *
   */
  const nestContext = await NestFactory.createApplicationContext(AppModule);

  // empty line for separation

  /**
   * awilix
   */
  const awilixContainer = awilix.createContainer();

  const techDocsGeneratorFactory = ({
    containerRunner, // Injected by awilix based on name
  }: {
    containerRunner: DockerContainerRunner;
  }) => {
    return TechdocsGenerator.fromConfig(config, {
      logger,
      containerRunner,
    });
  };

  const dockerClient = new Docker();
  awilixContainer.register({
    /**
     *  Registering already instantiated implementation
     */
    dockerClient: awilix.asValue(dockerClient),
    /**
     *  Registering a class directly. Constructor argument object expects 'dockerClient' property, which is injected
     *  automatically based on name
     */
    containerRunner: awilix.asClass(DockerContainerRunner),
    /**
     *  Registering a factory method. Factory args object expects 'containerRunner' property, which is injected
     *  automatically based on name
     */
    techdocsGenerator: awilix.asFunction(techDocsGeneratorFactory),
  });

  const healthcheckEnv = useHotMemoize(module, () => createEnv('healthcheck'));
  const catalogEnv = useHotMemoize(module, () => createEnv('catalog'));
  const codeCoverageEnv = useHotMemoize(module, () =>
    createEnv('code-coverage'),
  );
  const scaffolderEnv = useHotMemoize(module, () => createEnv('scaffolder'));
  const authEnv = useHotMemoize(module, () => createEnv('auth'));
  const azureDevOpsEnv = useHotMemoize(module, () => createEnv('azure-devops'));
  const proxyEnv = useHotMemoize(module, () => createEnv('proxy'));
  const rollbarEnv = useHotMemoize(module, () => createEnv('rollbar'));
  const searchEnv = useHotMemoize(module, () => createEnv('search'));
  const techdocsEnv = useHotMemoize(module, () => createEnv('techdocs'));
  const todoEnv = useHotMemoize(module, () => createEnv('todo'));
  const kubernetesEnv = useHotMemoize(module, () => createEnv('kubernetes'));
  const kafkaEnv = useHotMemoize(module, () => createEnv('kafka'));
  const graphqlEnv = useHotMemoize(module, () => createEnv('graphql'));
  const appEnv = useHotMemoize(module, () => createEnv('app'));
  const badgesEnv = useHotMemoize(module, () => createEnv('badges'));
  const jenkinsEnv = useHotMemoize(module, () => createEnv('jenkins'));
  const techInsightsEnv = useHotMemoize(module, () =>
    createEnv('tech-insights'),
  );

  const apiRouter = Router();
  apiRouter.use('/catalog', await catalog(catalogEnv));
  apiRouter.use('/code-coverage', await codeCoverage(codeCoverageEnv));
  apiRouter.use('/rollbar', await rollbar(rollbarEnv));
  apiRouter.use('/scaffolder', await scaffolder(scaffolderEnv));
  apiRouter.use('/tech-insights', await techInsights(techInsightsEnv));
  apiRouter.use('/auth', await auth(authEnv));
  apiRouter.use('/azure-devops', await azureDevOps(azureDevOpsEnv));
  apiRouter.use('/search', await search(searchEnv));

  /**
   * Injecting a child container to the module. Child module should populate missing implementations
   * to the container or default to parent container implementations if such exists
   */
  apiRouter.use(
    '/badges',
    await badges({ ...badgesEnv, container: inversifyContainer.createChild() }),
  );

  /**
   * Injecting individual (nestjs) module implementation to the module. The dependency is constructed at the AppModule
   * level and available here.
   */
  apiRouter.use(
    '/todo',
    await todo({
      ...todoEnv,
      todoReader: nestContext.get<TodoReader>(todosInjectables.TodoReader),
    }),
  );

  /**
   * Injecting a scoped container to the module. A scoped module should populate missing implementations
   * to the container or default to parent container implementations if such exists
   */
  apiRouter.use(
    '/techdocs',
    await techdocs({
      ...techdocsEnv,
      container: awilixContainer.createScope(),
    }),
  );
  apiRouter.use('/kubernetes', await kubernetes(kubernetesEnv));
  apiRouter.use('/kafka', await kafka(kafkaEnv));
  apiRouter.use('/proxy', await proxy(proxyEnv));
  apiRouter.use('/graphql', await graphql(graphqlEnv));

  apiRouter.use('/jenkins', await jenkins(jenkinsEnv));
  apiRouter.use(notFoundHandler());

  const service = createServiceBuilder(module)
    .loadConfig(config)
    .addRouter('', await healthcheck(healthcheckEnv))
    .addRouter('', metricsHandler())
    .addRouter('/api', apiRouter)
    .addRouter('', await app(appEnv));

  await service.start().catch(err => {
    logger.error(err);
    process.exit(1);
  });
}

module.hot?.accept();
main().catch(error => {
  console.error('Backend failed to start up', error);
  process.exit(1);
});
