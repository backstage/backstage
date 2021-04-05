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
import { BigQuery } from '@google-cloud/bigquery'; // used Google's official BigQuery SDK.

function createBigQueryClient(config: Config) {
  const projectId = config.getString('chromeUXReport.projectId');
  const keyPath = config.getString('chromeUXReport.keyPath');

  return new BigQuery({
    projectId: projectId,
    keyFilename: keyPath,
  });
}

export class Query {
  private readonly config: Config;

  constructor(config: Config) {
    this.config = config;
  }

  async queryUXMetrics(origin: string, period: string) {
    const client = createBigQueryClient(this.config);

    if (!client) {
      throw Error('Cannot create BigQuery Client.');
    }

    const query = `SELECT *
      FROM
      \`chrome-ux-report.materialized.metrics_summary\`
      WHERE
      origin = '${origin}' 
      AND
      yyyymm = ${period}
    `;

    const queryOptions = {
      query,
      // Location must match that of the dataset(s) referenced in the query.
      location: 'US',
    };

    const [job] = await client.createQueryJob(queryOptions);

    const [rows] = await job.getQueryResults();

    return rows[0];
  }
}
