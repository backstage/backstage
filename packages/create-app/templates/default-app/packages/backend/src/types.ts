import { Logger } from 'winston';
import { Config } from '@backstage/config';
import {
  PluginCacheManager,
  PluginDatabaseManager,
  PluginEndpointDiscovery,
  TokenManager,
  UrlReader,
} from '@backstage/backend-common';
import { PluginTaskScheduler } from '@backstage/backend-tasks';
import { PermissionEvaluator } from '@backstage/plugin-permission-common';
import { IdentityApi } from '@backstage/plugin-auth-node';

export type PluginEnvironment = {
  logger: Logger;
  database: PluginDatabaseManager;
  cache: PluginCacheManager;
  config: Config;
  reader: UrlReader;
  discovery: PluginEndpointDiscovery;
  tokenManager: TokenManager;
  scheduler: PluginTaskScheduler;
  permissions: PermissionEvaluator;
  identity: IdentityApi;
};
