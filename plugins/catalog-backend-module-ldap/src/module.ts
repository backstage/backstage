/*
 * Copyright 2022 The Backstage Authors
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

import {
  coreServices,
  createBackendModule,
  createExtensionPoint,
} from '@backstage/backend-plugin-api';
import { catalogProcessingExtensionPoint } from '@backstage/plugin-catalog-node/alpha';
import {
  GroupTransformer,
  UserTransformer,
} from '@backstage/plugin-catalog-backend-module-ldap';
import { LdapOrgEntityProvider } from './processors';

/**
 * Interface for {@link LdapOrgEntityProviderTransformsExtensionPoint}.
 *
 * @public
 */
export interface LdapOrgEntityProviderTransformsExtensionPoint {
  /**
   * Set the function that transforms a user entry in LDAP to an entity.
   * Optionally, you can pass separate transformers per provider ID.
   */
  setUserTransformer(
    transformer: UserTransformer | Record<string, UserTransformer>,
  ): void;

  /**
   * Set the function that transforms a group entry in LDAP to an entity.
   * Optionally, you can pass separate transformers per provider ID.
   */
  setGroupTransformer(
    transformer: GroupTransformer | Record<string, GroupTransformer>,
  ): void;
}

/**
 * Extension point used to customize the transforms used by the module.
 *
 * @public
 */
export const ldapOrgEntityProviderTransformsExtensionPoint =
  createExtensionPoint<LdapOrgEntityProviderTransformsExtensionPoint>({
    id: 'catalog.ldapOrgEntityProvider.transforms',
  });

/**
 * Registers the LdapOrgEntityProvider with the catalog processing extension point.
 *
 * @public
 */
export const catalogModuleLdapOrgEntityProvider = createBackendModule({
  pluginId: 'catalog',
  moduleId: 'ldapOrgEntityProvider',
  register(env) {
    let userTransformer:
      | UserTransformer
      | Record<string, UserTransformer>
      | undefined;
    let groupTransformer:
      | GroupTransformer
      | Record<string, GroupTransformer>
      | undefined;

    env.registerExtensionPoint(ldapOrgEntityProviderTransformsExtensionPoint, {
      setUserTransformer(transformer) {
        if (userTransformer) {
          throw new Error('User transformer may only be set once');
        }
        userTransformer = transformer;
      },
      setGroupTransformer(transformer) {
        if (groupTransformer) {
          throw new Error('Group transformer may only be set once');
        }
        groupTransformer = transformer;
      },
    });

    env.registerInit({
      deps: {
        catalog: catalogProcessingExtensionPoint,
        config: coreServices.rootConfig,
        logger: coreServices.logger,
        scheduler: coreServices.scheduler,
      },
      async init({ catalog, config, logger, scheduler }) {
        catalog.addEntityProvider(
          LdapOrgEntityProvider.fromConfig(config, {
            logger,
            scheduler,
            userTransformer: userTransformer,
            groupTransformer: groupTransformer,
          }),
        );
      },
    });
  },
});
