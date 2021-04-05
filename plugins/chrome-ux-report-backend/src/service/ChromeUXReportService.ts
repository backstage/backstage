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
  private readonly queryClient: Query;

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
      fast_fp: metrics.fast_fp,
      avg_fp: metrics.avg_fp,
      slow_fp: metrics.slow_fp,
      fast_fcp: metrics.fast_fcp,
      avg_fcp: metrics.avg_fcp,
      slow_fcp: metrics.slow_fcp,
      fast_dcl: metrics.fast_dcl,
      avg_dcl: metrics.avg_dcl,
      slow_dcl: metrics.slow_dcl,
      fast_ol: metrics.fast_ol,
      avg_ol: metrics.avg_ol,
      slow_ol: metrics.slow_ol,
      fast_fid: metrics.fast_fid,
      avg_fid: metrics.avg_fid,
      slow_fid: metrics.slow_fid,
      fast_ttfb: metrics.fast_ttfb,
      avg_ttfb: metrics.avg_ttfb,
      slow_ttfb: metrics.slow_ttfb,
      small_cls: metrics.small_cls,
      medium_cls: metrics.medium_cls,
      large_cls: metrics.large_cls,
      fast_lcp: metrics.fast_lcp,
      avg_lcp: metrics.avg_lcp,
      slow_lcp: metrics.slow_lcp,
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

      const rows = await this.queryClient.queryUXMetrics(origin, period);

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
