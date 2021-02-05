import { Logger } from 'winston';
import { Config } from '@backstage/config';
import {
  PluginDatabaseManager,
  PluginEndpointDiscovery,
  UrlReader,
} from '@backstage/backend-common';

export type PluginEnvironment = {
  logger: Logger;
  database: PluginDatabaseManager;
  config: Config;
  reader: UrlReader
  discovery: PluginEndpointDiscovery;
};
