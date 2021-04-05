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
import React from 'react';
import { ChromeUXReportChart } from './ChromeUXReportChart';
import { wrapInTestApp } from '@backstage/test-utils';
import { render, waitFor } from '@testing-library/react';
import { ApiProvider, ApiRegistry } from '@backstage/core';
import { ChromeUXReportApi, chromeuxReportApiRef } from '../api';

describe('ChromeUXReportChart', () => {
  const chromeUXReportApi: Partial<ChromeUXReportApi> = {
    getChromeUXMetrics: async () => ({
      metrics: {
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
      },
    }),
  };

  const renderWrapped = (children: React.ReactNode) =>
    render(
      wrapInTestApp(
        <ApiProvider
          apis={ApiRegistry.from([[chromeuxReportApiRef, chromeUXReportApi]])}
        >
          {children}
        </ApiProvider>,
      ),
    );

  it('render snapshot', async () => {
    const origin = 'Backstage';
    const { asFragment } = renderWrapped(
      <ChromeUXReportChart origin={origin} />,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('render successfully', async () => {
    const origin = 'Backstage';
    const { container } = renderWrapped(
      <ChromeUXReportChart origin={origin} />,
    );
    const period = container.getElementsByClassName('period');

    await waitFor(async () => {
      expect(period).toHaveLength(1);
      expect(period).not.toBeNull();
    });
  });
});
