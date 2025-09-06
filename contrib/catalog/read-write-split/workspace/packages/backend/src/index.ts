import { createBackend } from '@backstage/backend-defaults';
import {
  coreServices,
  createBackendFeatureLoader,
} from '@backstage/backend-plugin-api';
import { catalogService } from './catalogService';

const backend = createBackend();

backend.add(import('@backstage/plugin-catalog-backend'));
backend.add(catalogService);
// Here at the root level, you can add more features that you want to apply to
// BOTH the read and write nodes, as needed.

backend.add(
  createBackendFeatureLoader({
    deps: { config: coreServices.rootConfig },
    async *loader({ config }) {
      if (config.getString('catalog.role') !== 'write') {
        return;
      }

      // Here inside the loader, you can add more features that you want to
      // apply to ONLY the write nodes, as needed. This is where providers and
      // processors go, for example. The incremental ingestion provider line
      // below is just an example.
      yield import(
        '@backstage/plugin-catalog-backend-module-incremental-ingestion'
      );
    },
  }),
);

backend.start();
