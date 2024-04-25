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

export { coreServices } from './coreServices';
export type {
  AuthService,
  BackstageCredentials,
  BackstageUserPrincipal,
  BackstageServicePrincipal,
  BackstagePrincipalTypes,
  BackstageNonePrincipal,
} from './AuthService';
export type {
  CacheService,
  CacheServiceOptions,
  CacheServiceSetOptions,
} from './CacheService';
export type { RootConfigService } from './RootConfigService';
export type { DatabaseService } from './DatabaseService';
export type { DiscoveryService } from './DiscoveryService';
export type {
  HttpRouterService,
  HttpRouterServiceAuthPolicy,
} from './HttpRouterService';
export type { HttpAuthService } from './HttpAuthService';
export type {
  LifecycleService,
  LifecycleServiceStartupHook,
  LifecycleServiceStartupOptions,
  LifecycleServiceShutdownHook,
  LifecycleServiceShutdownOptions,
} from './LifecycleService';
export type { LoggerService } from './LoggerService';
export type {
  PermissionsService,
  PermissionsServiceRequestOptions,
} from './PermissionsService';
export type { PluginMetadataService } from './PluginMetadataService';
export type { RootHttpRouterService } from './RootHttpRouterService';
export type { RootLifecycleService } from './RootLifecycleService';
export type { RootLoggerService } from './RootLoggerService';
export { readSchedulerServiceTaskScheduleDefinitionFromConfig } from './SchedulerService';
export type {
  SchedulerService,
  SchedulerServiceTaskDescriptor,
  SchedulerServiceTaskFunction,
  SchedulerServiceTaskInvocationDefinition,
  SchedulerServiceTaskRunner,
  SchedulerServiceTaskScheduleDefinition,
  SchedulerServiceTaskScheduleDefinitionConfig,
} from './SchedulerService';
export type { TokenManagerService } from './TokenManagerService';
export type {
  ReadTreeOptions,
  ReadTreeResponse,
  ReadTreeResponseDirOptions,
  ReadTreeResponseFile,
  ReadUrlResponse,
  ReadUrlOptions,
  SearchOptions,
  SearchResponse,
  SearchResponseFile,
  UrlReaderService,
} from './UrlReaderService';
export type { BackstageUserInfo, UserInfoService } from './UserInfoService';
export type { IdentityService } from './IdentityService';
