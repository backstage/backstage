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

const migrationsDir = resolvePackagePath(
  '@backstage/plugin-chrome-ux-report-backend',
  'migrations',
);

export type SitesRow = {
  id: number;
  origin: string;
};

export type MonthWithYearRow = {
  id: number;
  date: string;
};

export type UXMetricsRow = {
  id: number;
  sites_id: number;
  monthsWithYear_id: number;
  connection_type: string;
  form_factor: string;
  first_contentful_paint: any;
  largest_contentful_paint: any;
  dom_content_loaded: any;
  onload: any;
  first_input: any;
  layout_instability: any;
  notifications: any;
  time_to_first_byte: any;
};

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

  async addSite(origin: string): Promise<void> {
    try {
      await this.database<SitesRow>('sites').insert({
        origin,
      });
    } catch (e) {
      this.logger.error(e.message);
    }
  }

  async listSites(): Promise<{ sites: any }> {
    const rows = await this.database<SitesRow>('sites').select();

    return {
      sites: rows.map(row => ({
        origin: row.origin,
      })),
    };
  }

  async getSiteId(origin: string): Promise<any> {
    const [site] = await this.database<SitesRow>('sites')
      .where({
        origin: origin,
      })
      .select('id');

    return site ? site?.id : undefined;
  }

  async removeSite(sites: string[]): Promise<void> {
    await this.database('sites').delete().whereIn('id', sites);
  }

  async addMonthWithYear(date: any): Promise<void> {
    try {
      await this.database<MonthWithYearRow>('monthsWithYear').insert({
        date,
      });
    } catch (e) {
      this.logger.error(e.message);
    }
  }

  async getMonthWithYearId(date: string): Promise<any> {
    const [monthWithYear] = await this.database<MonthWithYearRow>(
      'monthsWithYear',
    )
      .where({
        date: date,
      })
      .select('id');

    return monthWithYear ? monthWithYear?.id : undefined;
  }

  async listMonthWithYear(): Promise<{ dates: any }> {
    const rows = await this.database<MonthWithYearRow>(
      'monthsWithYear',
    ).select();

    return {
      dates: rows.map(row => ({
        date: row.date,
      })),
    };
  }

  async removeMonthWithYear(dates: string[]): Promise<void> {
    await this.database('monthsWithYear').delete().whereIn('id', dates);
  }

  async addUXMetrics(metrics: any): Promise<void> {
    const {
      sites_id,
      monthsWithYear_id,
      connection_type,
      form_factor,
      first_contentful_paint,
      largest_contentful_paint,
      dom_content_loaded,
      onload,
      first_input,
      layout_instability,
      notifications,
      time_to_first_byte,
    } = metrics;

    try {
      await this.database<UXMetricsRow>('uxMetrics').insert({
        sites_id,
        monthsWithYear_id,
        connection_type,
        form_factor,
        first_contentful_paint,
        largest_contentful_paint,
        dom_content_loaded,
        onload,
        first_input,
        layout_instability,
        notifications,
        time_to_first_byte,
      });
    } catch (e) {
      this.logger.error(e.message);
    }
  }

  async getUXMetrics(sitesId: number, monthWithYearId: number): Promise<any> {
    const [metrics] = await this.database<UXMetricsRow>(
      'uxMetrics',
    )
      .where({
        sites_id: sitesId,
        monthsWithYear_id: monthWithYearId
      })
      .select();

      return metrics;
  }
}
