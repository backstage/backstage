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

import { Backend, createSpecializedBackend } from '@backstage/backend-app-api';
import { auditorServiceFactory } from '@backstage/backend-defaults/auditor';
import { authServiceFactory } from '@backstage/backend-defaults/auth';
import { cacheServiceFactory } from '@backstage/backend-defaults/cache';
import { databaseServiceFactory } from '@backstage/backend-defaults/database';
import { discoveryServiceFactory } from '@backstage/backend-defaults/discovery';
import { httpAuthServiceFactory } from '@backstage/backend-defaults/httpAuth';
import { httpRouterServiceFactory } from '@backstage/backend-defaults/httpRouter';
import { lifecycleServiceFactory } from '@backstage/backend-defaults/lifecycle';
import { loggerServiceFactory } from '@backstage/backend-defaults/logger';
import { permissionsServiceFactory } from '@backstage/backend-defaults/permissions';
import { permissionsRegistryServiceFactory } from '@backstage/backend-defaults/permissionsRegistry';
import { rootConfigServiceFactory } from '@backstage/backend-defaults/rootConfig';
import { rootHealthServiceFactory } from '@backstage/backend-defaults/rootHealth';
import { rootHttpRouterServiceFactory } from '@backstage/backend-defaults/rootHttpRouter';
import { rootLifecycleServiceFactory } from '@backstage/backend-defaults/rootLifecycle';
import { rootLoggerServiceFactory } from '@backstage/backend-defaults/rootLogger';
import { schedulerServiceFactory } from '@backstage/backend-defaults/scheduler';
import { urlReaderServiceFactory } from '@backstage/backend-defaults/urlReader';
import { userInfoServiceFactory } from '@backstage/backend-defaults/userInfo';
import { eventsServiceFactory } from '@backstage/plugin-events-node';

export const defaultServiceFactories = [
  auditorServiceFactory,
  authServiceFactory,
  cacheServiceFactory,
  rootConfigServiceFactory,
  databaseServiceFactory,
  discoveryServiceFactory,
  httpAuthServiceFactory,
  httpRouterServiceFactory,
  lifecycleServiceFactory,
  loggerServiceFactory,
  permissionsServiceFactory,
  permissionsRegistryServiceFactory,
  rootHealthServiceFactory,
  rootHttpRouterServiceFactory,
  rootLifecycleServiceFactory,
  rootLoggerServiceFactory,
  schedulerServiceFactory,
  userInfoServiceFactory,
  urlReaderServiceFactory,
  eventsServiceFactory,
];

/**
 * @public
 */
export function createBackend(): Backend {
  return createSpecializedBackend({ defaultServiceFactories });
}
