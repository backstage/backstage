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

import { Logger } from 'winston';
import { Config } from '@backstage/config';
import { PluginCacheManager, TokenManager } from '@backstage/backend-common';
import { Router } from 'express';
import { IdentityApi } from '@backstage/plugin-auth-node';
import { PermissionEvaluator } from '@backstage/plugin-permission-common';
import {
  EventBroker,
  EventsService,
  HttpPostIngressOptions,
} from '@backstage/plugin-events-node';

import {
  BackendFeature,
  UrlReaderService,
  SchedulerService,
  SchedulerServiceTaskRunner,
  DatabaseService,
  DiscoveryService,
} from '@backstage/backend-plugin-api';
import { PackagePlatform, PackageRole } from '@backstage/cli-node';
import { CatalogBuilder } from '@backstage/plugin-catalog-backend';
import { TemplateAction } from '@backstage/plugin-scaffolder-node';
import { IndexBuilder } from '@backstage/plugin-search-backend-node';
import { EventsBackend } from '@backstage/plugin-events-backend';
import { PermissionPolicy } from '@backstage/plugin-permission-node';
import { ScannedPluginPackage } from '../scanner';

/**
 * @public
 *
 * @deprecated
 *
 * Support for the legacy backend system will be removed in the future.
 *
 * When adding a legacy plugin installer entrypoint in your plugin,
 * you should always take the opportunity to also implement support
 * for the new backend system if not already done.
 *
 */
export type LegacyPluginEnvironment = {
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
  eventBroker: EventBroker;
  events: EventsService;
  pluginProvider: BackendPluginProvider;
};

/**
 * @public
 */
export interface DynamicPluginProvider
  extends FrontendPluginProvider,
    BackendPluginProvider {
  plugins(options?: { includeFailed?: boolean }): DynamicPlugin[];
  getScannedPackage(plugin: DynamicPlugin): ScannedPluginPackage;
}

/**
 * @public
 */
export interface BackendPluginProvider {
  backendPlugins(options?: { includeFailed?: boolean }): BackendDynamicPlugin[];
}

/**
 * @public
 */
export interface FrontendPluginProvider {
  frontendPlugins(options?: {
    includeFailed?: boolean;
  }): FrontendDynamicPlugin[];
}

/**
 * @public
 */
export interface BaseDynamicPlugin {
  name: string;
  version: string;
  role: PackageRole;
  platform: PackagePlatform;
  failure?: string;
}

/**
 * @public
 */
export type DynamicPlugin = FrontendDynamicPlugin | BackendDynamicPlugin;

/**
 * @public
 */
export interface FrontendDynamicPlugin extends BaseDynamicPlugin {
  platform: 'web';
}

/**
 * @public
 */
export interface BackendDynamicPlugin extends BaseDynamicPlugin {
  platform: 'node';
  installer?: BackendDynamicPluginInstaller;
}

/**
 * @public
 */
export type BackendDynamicPluginInstaller =
  | LegacyBackendPluginInstaller
  | NewBackendPluginInstaller;

/**
 * @public
 */
export interface NewBackendPluginInstaller {
  kind: 'new';

  install(): BackendFeature | BackendFeature[];
}

/**
 * @public
 * @deprecated
 *
 * Support for the legacy backend system will be removed in the future.
 *
 * When adding a legacy plugin installer entrypoint in your plugin,
 * you should always take the opportunity to also implement support
 * for the new backend system if not already done.
 *
 */
export interface LegacyBackendPluginInstaller {
  kind: 'legacy';

  router?: {
    pluginID: string;
    createPlugin(env: LegacyPluginEnvironment): Promise<Router>;
  };

  catalog?(builder: CatalogBuilder, env: LegacyPluginEnvironment): void;
  scaffolder?(env: LegacyPluginEnvironment): TemplateAction<any>[];
  search?(
    indexBuilder: IndexBuilder,
    schedule: SchedulerServiceTaskRunner,
    env: LegacyPluginEnvironment,
  ): void;
  events?(
    eventsBackend: EventsBackend,
    env: LegacyPluginEnvironment,
  ): HttpPostIngressOptions[];
  permissions?: {
    policy?: PermissionPolicy;
  };
}

/**
 * @public
 */
export function isBackendDynamicPluginInstaller(
  obj: any,
): obj is BackendDynamicPluginInstaller {
  return (
    obj !== undefined &&
    'kind' in obj &&
    (obj.kind === 'new' || obj.kind === 'legacy')
  );
}
