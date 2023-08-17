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
import { createBackendModule } from '@backstage/backend-plugin-api';
import { catalogServiceRef } from '@backstage/plugin-catalog-node/alpha';
import {
  graphqlLoadersExtensionPoint,
  graphqlModulesExtensionPoint,
} from '@backstage/plugin-graphql-backend';
import { createEntitiesLoadFn } from './entitiesLoadFn';
import { CATALOG_SOURCE } from './constants';
import { Relation } from './relation/relation';

/** @public */
export const graphqlModuleRelationResolver = createBackendModule({
  pluginId: 'graphql',
  moduleId: 'relationResolver',
  register(env) {
    env.registerInit({
      deps: {
        catalog: catalogServiceRef,
        modules: graphqlModulesExtensionPoint,
        loaders: graphqlLoadersExtensionPoint,
      },
      async init({ catalog, modules, loaders }) {
        modules.addModules([Relation]);
        loaders.addLoaders({ [CATALOG_SOURCE]: createEntitiesLoadFn(catalog) });
      },
    });
  },
});
