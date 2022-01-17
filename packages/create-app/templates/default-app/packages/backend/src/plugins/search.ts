import { useHotCleanup } from '@backstage/backend-common';
import { createRouter } from '@backstage/plugin-search-backend';
import {
  IndexBuilder,
  LunrSearchEngine,
} from '@backstage/plugin-search-backend-node';
import { PluginEnvironment } from '../types';
import { DefaultCatalogCollator } from '@backstage/plugin-catalog-backend';
import { DefaultTechDocsCollator } from '@backstage/plugin-techdocs-backend';

export default async function createPlugin({
  logger,
  permissions,
  discovery,
  config,
  tokenManager,
}: PluginEnvironment) {
  // Initialize a connection to a search engine.
  const searchEngine = new LunrSearchEngine({ logger });
  const indexBuilder = new IndexBuilder({ logger, searchEngine });

  // Collators are responsible for gathering documents known to plugins. This
  // collator gathers entities from the software catalog.
  indexBuilder.addCollator({
    defaultRefreshIntervalSeconds: 600,
    collator: DefaultCatalogCollator.fromConfig(config, {
      discovery,
      tokenManager,
    }),
  });

  // collator gathers entities from techdocs.
  indexBuilder.addCollator({
    defaultRefreshIntervalSeconds: 600,
    collator: DefaultTechDocsCollator.fromConfig(config, {
      discovery,
      logger,
      tokenManager,
    }),
  });

  // The scheduler controls when documents are gathered from collators and sent
  // to the search engine for indexing.
  const { scheduler } = await indexBuilder.build();

  // A 3 second delay gives the backend server a chance to initialize before
  // any collators are executed, which may attempt requests against the API.
  setTimeout(() => scheduler.start(), 3000);
  useHotCleanup(module, () => scheduler.stop());

  return await createRouter({
    engine: indexBuilder.getSearchEngine(),
    types: indexBuilder.getDocumentTypes(),
    permissions,
    config,
    logger,
  });
}
