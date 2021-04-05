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
import { UrlPatternDiscovery } from '@backstage/core';
import { ChromeUXReportApi } from './api';
import nock from 'nock';
import { getPeriod } from './utils';

describe('ChromeUXReportApi', () => {
  const mockBaseUrl = 'http://backstage:9191/api/chromeuxreport';
  const configApi = {
    getOptionalString: () => mockBaseUrl,
  } as Partial<Config>;
  const discoveryApi = UrlPatternDiscovery.compile(mockBaseUrl);
  const metrics = {
    origin_id: 1,
    period_id: 1,
    connection_type: '4G',
    form_factor: 'Desktop',
    first_contentful_paint: { fast: 0.8, average: 0.15, slow: 0.05 },
    largest_contentful_paint: { fast: 0.8, average: 0.15, slow: 0.05 },
    dom_content_loaded: { fast: 0.8, average: 0.15, slow: 0.05 },
    onload: { fast: 0.8, average: 0.15, slow: 0.05 },
    first_input: { fast: 0.8, average: 0.15, slow: 0.05 },
    layout_instability: { fast: 0.8, average: 0.15, slow: 0.05 },
    notifications: { fast: 0.8, average: 0.15, slow: 0.05 },
    time_to_first_byte: { fast: 0.8, average: 0.15, slow: 0.05 },
  };
  // @ts-ignore Partial<Config> not assignable to Config.
  const chromeUXReportApi = new ChromeUXReportApi({ configApi, discoveryApi });
  const defaultPeriod = getPeriod();

  it('should return metrics without period', async () => {
    // @ts-ignore Partial<Config> not assignable to Config.
    const origin = 'backstage.io';
    nock(mockBaseUrl, {
      reqheaders: {
        'content-type': 'application/json',
      },
    })
      .post('/metrics', {
        origin,
        period: `${defaultPeriod}`,
      })
      .reply(200, metrics);

    const result = await chromeUXReportApi.getChromeUXMetrics(origin);
    expect(result).toEqual(metrics);
  });

  it('should return empty object without period when status code is 404', async () => {
    const origin = 'backstage.io';

    nock(mockBaseUrl, {
      reqheaders: {
        'content-type': 'application/json',
      },
    })
      .post('/metrics', {
        origin,
        period: `${defaultPeriod}`,
      })
      .reply(404, {});

    const result = await chromeUXReportApi.getChromeUXMetrics(origin);
    expect(result).toEqual({});
  });

  it('should return metrics with period', async () => {
    const origin = 'backstage.io';
    const period = '202009';

    nock(mockBaseUrl, {
      reqheaders: {
        'content-type': 'application/json',
      },
    })
      .post('/metrics', {
        origin,
        period,
      })
      .reply(200, metrics);

    const result = await chromeUXReportApi.getChromeUXMetrics(origin, period);
    expect(result).toEqual(metrics);
  });

  it('should return empty object with period when status code is 404', async () => {
    const origin = 'backstage.io';
    const period = '202009';

    nock(mockBaseUrl, {
      reqheaders: {
        'content-type': 'application/json',
      },
    })
      .post('/metrics', {
        origin,
        period,
      })
      .reply(404, {});

    const result = await chromeUXReportApi.getChromeUXMetrics(origin, period);
    expect(result).toEqual({});
  });
});
