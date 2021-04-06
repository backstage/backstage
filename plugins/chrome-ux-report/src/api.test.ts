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
    fast_fp: 0.9,
    avg_fp: 0.08,
    slow_fp: 0.02,
    fast_fcp: 0.9,
    avg_fcp: 0.08,
    slow_fcp: 0.02,
    fast_dcl: 0.9,
    avg_dcl: 0.08,
    slow_dcl: 0.02,
    fast_ol: 0.9,
    avg_ol: 0.08,
    slow_ol: 0.02,
    fast_fid: 0.9,
    avg_fid: 0.08,
    slow_fid: 0.02,
    fast_ttfb: 0.9,
    avg_ttfb: 0.08,
    slow_ttfb: 0.02,
    fast_lcp: 0.9,
    avg_lcp: 0.08,
    slow_lcp: 0.02,
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
