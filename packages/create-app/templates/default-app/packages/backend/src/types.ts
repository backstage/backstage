import { Logger } from 'winston';
import { Config } from '@backstage/config';
import {
  PluginDatabaseClientFactory,
  PluginEndpointDiscovery,
  UrlReader
} from '@backstage/backend-common';

export type PluginEnvironment = {
  logger: Logger;
  databaseClientFactory: PluginDatabaseClientFactory;
  config: Config;
  reader: UrlReader
  discovery: PluginEndpointDiscovery;
};
