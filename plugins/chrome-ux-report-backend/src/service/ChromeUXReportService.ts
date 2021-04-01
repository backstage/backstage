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

import { Logger } from 'winston';
import { Database } from './database/Database';
import { Query } from './Query';
import { Metric, Options } from './types';

export class ChromeUXReportService {
  private readonly database: Database;
  private readonly logger: Logger;
  private readonly queryClient: Query

  constructor(options: Options) {
    options.logger.debug(`creating chrome ux report client`);
    this.database = options.database;
    this.logger = options.logger;
    this.queryClient = options.query;
  }

  private async getOriginId(origin: string): Promise<number> {
    try {
      return await this.database.getOriginId(origin);
    } catch (error) {
      this.logger.error(
        `There is an error while getting origin from database, error ${error.message}`,
      );
      throw error;
    }
  }

  private async getPeriodId(period: string): Promise<number> {
    try {
      return this.database.getPeriodId(period);
    } catch (error) {
      this.logger.error(
        `There is an error while getting period from database, error ${error.message}`,
      );
      throw error;
    }
  }

  private async addOrigin(origin: string): Promise<boolean> {
    try {
      await this.database.addOrigin(origin);
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
      await this.database.addPeriod(period);
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
      await this.database.addUXMetrics({
        origin_id: originId,
        period_id: periodId,
        connection_type: '4G',
        form_factor: 'Desktop',
        first_paint: metrics.first_paint,
        first_contentful_paint: metrics.first_contentful_paint,
        largest_contentful_paint: metrics.largest_contentful_paint,
        dom_content_loaded: metrics.dom_content_loaded,
        onload: metrics.onload,
        first_input_delay: metrics.first_input_delay,
        time_to_first_byte: metrics.time_to_first_byte,
      });
      return true; 
  }

  async getUXMetrics(origin: string, period: string): Promise<Metric> {
    try {
      let originId = await this.getOriginId(origin);
      let periodId = await this.getPeriodId(period);

       if (originId && periodId) {
        return this.database.getUXMetrics(originId, periodId);
      } 

      if (!originId) {
        await this.addOrigin(origin);
        originId = await this.getOriginId(origin);
      }

      if (!periodId) {
        await this.addPeriod(period);
        periodId = await this.getPeriodId(period);
      }

      const rows = await this.queryClient.queryUXMetrics(
        origin,
        period
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
