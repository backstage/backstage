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

  metrics = [
    'first_paint',
    'first_contentful_paint',
    'largest_contentful_paint',
    'dom_content_loaded',
    'onload',
    'first_input',
    'experimental',
  ];

  async queryUXMetrics(origin: string, period: string) {
    const client = createBigQueryClient(this.config);

    const query = `SELECT *
      FROM
      \`chrome-ux-report.all.${period}\`
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

    const [job] = await client.createQueryJob(queryOptions);

    const [rows] = await job.getQueryResults();

    const result = this.getMetrics(rows[0]);

    return result;
  }

  getMetrics(rows: any) {
    const result: any = {};

    this.metrics.forEach(metric => {
      switch (metric) {
        case 'first_input':
          var flattedArr = rows['first_input']['delay'].histogram.bin.flat();
          result['first_input_delay'] = this.calculateMetrics(flattedArr);
          break;
        case 'experimental':
          var flattedArr = rows['experimental'][
            'time_to_first_byte'
          ].histogram.bin.flat();
          result['time_to_first_byte'] = this.calculateMetrics(flattedArr);
          break;
        default:
          var flattedArr = rows[`${metric}`].histogram.bin.flat();
          result[`${metric}`] = this.calculateMetrics(flattedArr);
          break;
      }
    });

    return result;
  }

  calculateMetrics(histogramArray: any[]) {
    let fast = 0;
    let slow = 0;
    let average = 0;

    histogramArray.forEach(histogram => {
      if (histogram.start <= 1000) {
        fast += histogram.density;
      } else if (histogram.start > 1000 && histogram.start <= 2500) {
        average += histogram.density;
      } else {
        slow += histogram.density;
      }
    });

    return {
      fast,
      slow,
      average,
    };
  }
}
