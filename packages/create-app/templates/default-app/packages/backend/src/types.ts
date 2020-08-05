import Knex from 'knex';
import { Logger } from 'winston';
import { Config } from '@backstage/config';

export type PluginEnvironment = {
  logger: Logger;
  database: Knex;
  config: Config;
};
