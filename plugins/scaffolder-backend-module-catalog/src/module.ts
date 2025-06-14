/*
 * Copyright 2025 The Backstage Authors
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
import { createBackendModule } from '@backstage/backend-plugin-api';
import { scaffolderActionsExtensionPoint } from '@backstage/plugin-scaffolder-node/alpha';
import { createCatalogQueryAction } from './actions/catalogQuery';
import { catalogServiceRef } from '@backstage/plugin-catalog-node';
import { createCatalogByRefsAction } from './actions/catalogByRefs';
import { createCatalogByRefAction } from './actions/catalogByRef';
import { createCatalogRefreshAction } from './actions/catalogRefresh';
import { createCatalogValidateAction } from './actions/catalogValidate';

/**
 * A backend module for the Scaffolder plugin that provides actions to interact with the Catalog.
 *
 * @public
 */
export const scaffolderModule = createBackendModule({
  moduleId: 'catalog',
  pluginId: 'scaffolder',
  register({ registerInit }) {
    registerInit({
      deps: {
        scaffolderActions: scaffolderActionsExtensionPoint,
        catalog: catalogServiceRef,
      },
      async init({ scaffolderActions, catalog }) {
        scaffolderActions.addActions(
          createCatalogQueryAction({ catalog }),
          createCatalogByRefsAction({ catalog }),
          createCatalogByRefAction({ catalog }),
          createCatalogRefreshAction({ catalog }),
          createCatalogValidateAction({ catalog }),
        );
      },
    });
  },
});
