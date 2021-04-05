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
  query: Query;
}

export type Metric = {
  fast_fp: number;
  avg_fp: number;
  slow_fp: number;
  fast_fcp: number;
  avg_fcp: number;
  slow_fcp: number;
  fast_dcl: number;
  avg_dcl: number;
  slow_dcl: number;
  fast_ol: number;
  avg_ol: number;
  slow_ol: number;
  fast_fid: number;
  avg_fid: number;
  slow_fid: number;
  fast_ttfb: number;
  avg_ttfb: number;
  slow_ttfb: number;
  fast_lcp: number;
  avg_lcp: number;
  slow_lcp: number;
};

