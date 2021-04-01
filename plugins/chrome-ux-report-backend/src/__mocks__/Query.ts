/*
 * Copyright 2020 Spotify AB
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

function createBigQueryClient(config: Config) {
  const projectId = config.getString('chromeUXReport.projectId');
  const keyPath = config.getString('chromeUXReport.keyPath');

  if (!projectId || !keyPath) {
    throw Error('You must give project id and key path');
  }

  return true;
}

export class MockQuery {
  private readonly config: Config;

  metrics = [
    'first_paint',
    'first_contentful_paint',
    'largest_contentful_paint',
    'dom_content_loaded',
    'onload',
    'first_input',
    'experimental',
  ];
  
  constructor(config: Config) {
    this.config = config;
  }

  async queryUXMetrics(origin: string, month: string) {
    if (!origin || !month) {
      // rate info to be removed.
      throw Error('Origin or month or rate info not given...');
    }

    if (!createBigQueryClient(this.config)) {
      throw Error('Cannot create BigQuery Client.');
    }

    return this.getMetrics();
  }

  getMetrics() {
    return {
      first_paint: JSON.stringify(this.calculateMetrics()),
      first_contentful_paint: JSON.stringify(this.calculateMetrics()),
      largest_contentful_paint: JSON.stringify(this.calculateMetrics()),
      dom_content_loaded: JSON.stringify(this.calculateMetrics()),
      onload: JSON.stringify(this.calculateMetrics()),
      first_input_delay: JSON.stringify(this.calculateMetrics()),
      time_to_first_byte: JSON.stringify(this.calculateMetrics()),
    };
  }

  calculateMetrics() {
    return {
      fast: 0.25,
      average: 0.25,
      slow: 0.25,
    };
  }
}
