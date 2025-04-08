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

import { Logger } from 'winston';
import { Config } from '@backstage/config';
import { PluginCacheManager, TokenManager } from '@backstage/backend-common';
import { IdentityApi } from '@backstage/plugin-auth-node';
import { PermissionEvaluator } from '@backstage/plugin-permission-common';
import { EventBroker, EventsService } from '@backstage/plugin-events-node';
import { SignalsService } from '@backstage/plugin-signals-node';
import {
  UrlReaderService,
  SchedulerService,
  DatabaseService,
  DiscoveryService,
} from '@backstage/backend-plugin-api';

export type PluginEnvironment = {
  logger: Logger;
  cache: PluginCacheManager;
  database: DatabaseService;
  config: Config;
  reader: UrlReaderService;
  discovery: DiscoveryService;
  tokenManager: TokenManager;
  permissions: PermissionEvaluator;
  scheduler: SchedulerService;
  identity: IdentityApi;
  /**
   * @deprecated use `events` instead
   */
  eventBroker: EventBroker;
  events: EventsService;
  signals: SignalsService;
};
