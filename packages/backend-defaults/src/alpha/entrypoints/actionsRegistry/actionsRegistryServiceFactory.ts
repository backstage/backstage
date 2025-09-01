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

import {
  coreServices,
  createServiceFactory,
} from '@backstage/backend-plugin-api';
import { DefaultActionsRegistryService } from './DefaultActionsRegistryService';
import { actionsRegistryServiceRef } from '@backstage/backend-plugin-api/alpha';
import { actionsRegistryPermissions } from './permissions';

/**
 * @public
 */
export const actionsRegistryServiceFactory = createServiceFactory({
  service: actionsRegistryServiceRef,
  deps: {
    metadata: coreServices.pluginMetadata,
    httpRouter: coreServices.httpRouter,
    httpAuth: coreServices.httpAuth,
    logger: coreServices.logger,
    auth: coreServices.auth,
    permissions: coreServices.permissions,
    permissionsRegistry: coreServices.permissionsRegistry,
  },
  factory: ({
    metadata,
    httpRouter,
    httpAuth,
    logger,
    auth,
    permissions,
    permissionsRegistry,
  }) => {
    permissionsRegistry.addPermissions(actionsRegistryPermissions);

    const actionsRegistryService = DefaultActionsRegistryService.create({
      httpAuth,
      logger,
      auth,
      metadata,
      permissions,
    });

    httpRouter.use(actionsRegistryService.createRouter());

    return actionsRegistryService;
  },
});
