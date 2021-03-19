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

import { Config } from '@backstage/config';
import { Logger } from 'winston';
import { Database } from './database/Database';
import { queryUXMetrics } from './Query';
import { Metric, Options } from './types';

export class ChromeUXReport {
  private readonly database: Database;
  private readonly logger: Logger;
  private readonly config: Config;

  constructor(options: Options) {
    options.logger.debug(`creating chrome ux report client`);
    this.config = options.config;
    this.database = options.database;
    this.logger = options.logger;
  }

  private async getSiteId(origin: string): Promise<number> {
    try {
      return await this.database.getSiteId(origin);
    } catch (error) {
      this.logger.error(
        `There is an error while getting origin from database, error ${error.message}`,
      );
      throw error;
    }
  }

  private async getPeriodId(period: string): Promise<number> {
    try {
      return this.database.getMonthWithYearId(period);
    } catch (error) {
      this.logger.error(
        `There is an error while getting period from database, error ${error.message}`,
      );
      throw error;
    }
  }

  private async addOrigin(origin: string): Promise<boolean> {
    try {
      await this.database.addSite(origin);
      return true;
    } catch (error) {
      this.logger.error(
        `There is an error while adding origin to database, error ${error.message}`,
      );
      throw error;
    }
  }

  private async addPeriod(period: string): Promise<boolean> {
    try {
      await this.database.addMonthWithYear(period);
      return true;
    } catch (error) {
      this.logger.error(
        `There is an error while adding period to database, error ${error.message}`,
      );
      throw error;
    }
  }

  private async addUXMetrics(
    originId: number,
    periodId: number,
    metrics: Metric,
  ): Promise<boolean> {
    try {
      await this.database.addUXMetrics({
        sites_id: originId,
        monthsWithYear_id: periodId,
        connection_type: '4G',
        form_factor: 'Desktop',
        first_contentful_paint: metrics,
        largest_contentful_paint: metrics,
        dom_content_loaded: metrics,
        onload: metrics,
        first_input: metrics,
        layout_instability: metrics,
        notifications: metrics,
        time_to_first_byte: metrics,
      });
      return true;
    } catch (error) {
      this.logger.error(
        `There is an error while adding period to database, error ${error.message}`,
      );
      throw error;
    }
  }

  async getUXMetrics(origin: string, period: string): Promise<Metric> {
    try {
      let originId = await this.getSiteId(origin);
      let periodId = await this.getPeriodId(period);
      //let metrics: Metric;

      if (originId && periodId) {
        return this.database.getUXMetrics(originId, periodId);
      }

      if (!originId) {
        await this.addOrigin(origin);
        originId = await this.getSiteId(origin);
      }

      if (!periodId) {
        await this.addPeriod(period);
        periodId = await this.getPeriodId(period);
      }

      const [rows] = await queryUXMetrics(
        origin,
        period,
        { longName: 'first_contentful_paint', shortName: 'fcp' },
        this.config,
      );

      await this.addUXMetrics(originId, periodId, rows);
      
      return this.database.getUXMetrics(originId, periodId);
    } catch (error) {
      this.logger.error(
        `There is an error while getting ux metrics from database, error ${error.message}`,
      );
      throw error;
    }
  }
}
