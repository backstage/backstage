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

import * as coreServices from './coreServices';

export { coreServices };
export type { CacheService } from './cacheServiceRef';
export type { ConfigService } from './configServiceRef';
export type { DatabaseService } from './databaseServiceRef';
export type { DiscoveryService } from './discoveryServiceRef';
export type { HttpRouterService } from './httpRouterServiceRef';
export type {
  LifecycleService,
  LifecycleServiceShutdownHook,
} from './lifecycleServiceRef';
export type { LoggerService, LogMeta } from './loggerServiceRef';
export type { PermissionsService } from './permissionsServiceRef';
export type { PluginMetadataService } from './pluginMetadataServiceRef';
export type { RootHttpRouterService } from './rootHttpRouterServiceRef';
export type { RootLoggerService } from './rootLoggerServiceRef';
export type { SchedulerService } from './schedulerServiceRef';
export type { TokenManagerService } from './tokenManagerServiceRef';
export type { UrlReaderService } from './urlReaderServiceRef';
