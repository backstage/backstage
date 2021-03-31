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
import { BigQuery, QueryRowsResponse } from '@google-cloud/bigquery'; // used Google's official BigQuery SDK.

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
  metrics = [
    'first_paint',
    'first_contentful_paint',
    'largest_contentful_paint',
    'dom_content_loaded',
    'onload',
  ];

  async queryUXMetrics(origin: string, period: string) {
    const client = createBigQueryClient(this.config);

    const query = `SELECT *
      FROM
      \`chrome-ux-report.all.202102\`
      WHERE
      origin = '${origin}' AND 
      effective_connection_type.name = '4G' AND
      form_factor.name = 'desktop'
    `;

    const queryOptions = {
      query,
      // Location must match that of the dataset(s) referenced in the query.
      location: 'US',
    };

    //const [job] = await client.createQueryJob(queryOptions);

    //const [rows] = await job.getQueryResults();
    const rows: any = [];
    console.log(rows);
    const result = this.getMetricResults(rows);

    console.log(result);
    return result;
  }

  getMetricResults(rows: QueryRowsResponse[]) {
    const obj = rows[0];
    const result: any = {};

    this.metrics.forEach((metric: string) => {
      var fast = 0;
      var average = 0;
      var slow = 0;
/*       var flattedArr: any = obj[`${metric}`].histogram.bin.flat();

      flattedArr.forEach((element: any) => {
        if (element.start <= 1000) {
          fast += element.density;
        } else if (element.start > 1000 && element.start <= 2500) {
          average += element.density;
        } else {
          slow += element.density;
        }
      }); */

      result[`${metric}`] = {
        fast: 0.25,
        slow: 0.25,
        average: 0.25,
      };
    });

    return result;
  }
}
