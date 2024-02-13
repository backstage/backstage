# search-backend-module-catalog

This package exports a module that extends the search backend to also indexing the entities of your catalog.

## Installation

Add the module package as a dependency:

```bash
# From your Backstage root directory
yarn --cwd packages/backend add @backstage/plugin-search-backend-module-catalog
```

Add the collator to your backend instance, along with the search plugin itself:

```tsx
// packages/backend-next/src/index.ts
import { createBackend } from '@backstage/backend-defaults';
import { searchPlugin } from '@backstage/plugin-search-backend/alpha';
import { searchModuleCatalogCollator } from '@backstage/plugin-search-backend-module-catalog/alpha';

const backend = createBackend();
backend.add(searchPlugin());
backend.add(searchModuleCatalogCollator());
backend.start();
```

You may also want to add configuration parameters to your app-config, for example for controlling the scheduled indexing interval. These parameters should be placed under the `search.collators.catalog` key. See [the config definition file](https://github.com/backstage/backstage/blob/master/plugins/search-backend-module-catalog/config.d.ts) for more details.

## Advanced Customizations

This module also has an extension point, which lets you inject advanced customizations. Here's an example of how to leverage that extension point to tweak the transformer used for building the search indexer documents:

```tsx
// packages/backend-next/src/index.ts
import { createBackend } from '@backstage/backend-defaults';
import { createBackendModule } from '@backstage/backend-plugin-api';
import { searchPlugin } from '@backstage/plugin-search-backend/alpha';
import { CatalogCollatorEntityTransformer } from '@backstage/plugin-search-backend-module-catalog';
import {
  searchModuleCatalogCollator,
  catalogCollatorExtensionPoint,
} from '@backstage/plugin-search-backend-module-catalog/alpha';

const customTransformer: CatalogCollatorEntityTransformer = entity => ({
  title: entity.metadata.title || entity.metadata.name,
  text: entity.metadata.description || '',
  componentType: entity.spec?.type?.toString() || 'other',
  type: entity.spec?.type?.toString() || 'other',
  namespace: entity.metadata.namespace || 'default',
  kind: entity.kind,
  lifecycle: (entity.spec?.lifecycle as string) || '',
  owner: (entity.spec?.owner as string) || '',
});

const backend = createBackend();
backend.add(searchPlugin());
backend.add(searchModuleCatalogCollator());
backend.add(
  createBackendModule({
    pluginId: 'search',
    moduleId: 'my-catalog-collator-options',
    register(reg) {
      reg.registerInit({
        deps: { collator: catalogCollatorExtensionPoint },
        init({ collator }) {
          collator.setEntityTransformer(customTransformer);
        },
      });
    },
  })(),
);
backend.start();
```
