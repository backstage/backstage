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

import { resolvePackagePath } from '@backstage/backend-common';
import { Knex } from 'knex';
import { Logger } from 'winston';
import { OriginsRow, PeriodRow, UXMetricsRow } from '../types';

const migrationsDir = resolvePackagePath(
  '@backstage/plugin-chrome-ux-report-backend',
  'migrations',
);

type Options = {
  database: any;
  logger: Logger;
};
export class Database {
  private readonly database: Knex;
  private readonly logger: Logger;

  private constructor(options: Options) {
    this.database = options.database;
    this.logger = options.logger;
  }

  static async create(options: Options): Promise<Database> {
    const { database } = options;

    await database.migrate.latest({
      directory: migrationsDir,
    });

    return new Database(options);
  }

  async addOrigin(origin: string): Promise<void> {
    await this.database<OriginsRow>('origins').insert({
      origin,
    });
  }

  async listOrigins(): Promise<{ origins: any }> {
    const rows = await this.database<OriginsRow>('origins').select();

    return {
      origins: rows.map(row => ({
        origin: row.origin,
      })),
    };
  }

  async getOriginId(origin: string): Promise<any> {
    const [originId] = await this.database<OriginsRow>('origins')
      .where({
        origin: origin,
      })
      .select('id');

    return originId ? originId?.id : undefined;
  }

  async removeOrigin(origins: string[]): Promise<void> {
    await this.database('origins').delete().whereIn('id', origins);
  }

  async addPeriod(period: any): Promise<void> {
    await this.database<PeriodRow>('periods').insert({
      period,
    });
  }

  async getPeriodId(period: string): Promise<any> {
    const [periodId] = await this.database<PeriodRow>('periods')
      .where({
        period: period,
      })
      .select('id');

    return periodId ? periodId?.id : undefined;
  }
  async listPeriod(): Promise<{ periods: any }> {
    const rows = await this.database<PeriodRow>('periods').select();

    return {
      periods: rows.map(row => ({
        period: row.period,
      })),
    };
  }

  async removePeriod(dates: string[]): Promise<void> {
    await this.database('periods').delete().whereIn('id', dates);
  }

  async addUXMetrics(metrics: any): Promise<void> {
    await this.database<UXMetricsRow>('uxMetrics').insert(metrics);
  }

  async getUXMetrics(originId: number, periodId: number): Promise<any> {
    const [metrics] = await this.database<UXMetricsRow>('uxMetrics')
      .where({
        origin_id: originId,
        period_id: periodId,
      })
      .select();

    return metrics;
  }
}
