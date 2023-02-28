import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { loggerToWinstonLogger } from '@backstage/backend-common';
import {
  searchIndexBuilderRef,
  searchEngineExtensionPoint,
  searchIndexExtensionPoint,
} from '@backstage/plugin-search-backend-node';

import { createRouter } from './service/router';

export const searchPlugin = createBackendPlugin({
  pluginId: 'search',
  register(env) {
    env.registerInit({
      deps: {
        logger: coreServices.logger,
        config: coreServices.config,
        permissions: coreServices.permissions,
        http: coreServices.httpRouter,
        searchIndexBuilder: searchIndexBuilderRef,
        searchEngineRegistry: searchEngineExtensionPoint,
        searchIndexRegistry: searchIndexExtensionPoint,
      },
      async init({
        config,
        logger,
        permissions,
        http,
        searchEngineRegistry,
        searchIndexRegistry,
        searchIndexBuilder,
      }) {
        const searchEngine = searchEngineRegistry.getSearchEngine();
        const collators = searchIndexRegistry.getCollators();
        const decorators = searchIndexRegistry.getDecorators();

        const { scheduler } = searchIndexBuilder.build({
          searchEngine,
          collators,
          decorators,
        });
        scheduler.start();

        const router = await createRouter({
          config,
          permissions,
          logger: loggerToWinstonLogger(logger),
          engine: searchEngine,
          types: searchIndexBuilder.getDocumentTypes(),
        });
        // We register the router with the http service.
        http.use(router);
      },
    });
  },
});
