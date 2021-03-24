/*
 * Copyright 2021 Spotify AB
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

import { PluginDatabaseManager } from '@backstage/backend-common';
import { Config } from '@backstage/config';
import { Logger } from 'winston';
import { Database } from './database/Database';
import { Query } from './Query';

export interface RouterOptions {
  logger: Logger;
  config: Config;
  database: PluginDatabaseManager;
}

export interface Options {
    logger: Logger;
    database: Database;
    query: Query
  }

export interface RateInfo {
  longName: string;
  shortName: string;
}

export type Metric = {
  id: number;
  sites_id: number;
  monthsWithYear_id: number;
  connection_type: string;
  form_factor: string;
  first_contentful_paint: {
    rates: any;
  };
  largest_contentful_paint: {
    rates: any;
  };
  dom_content_loaded: {
    rates: any;
  };
  onload: {
    rates: any;
  };
  first_input: {
    rates: any;
  };
  layout_instability: {
    rates: any;
  };
  notifications: {
    rates: any;
  };
  time_to_first_byte: {
    rates: any;
  };
};
