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
import { ChromeUXReportPage } from './ChromeUXReportPage';
import { wrapInTestApp } from '@backstage/test-utils';
import { render, waitFor } from '@testing-library/react';
import {
  ApiProvider,
  ApiRegistry,
  ConfigApi,
  configApiRef,
  ConfigReader,
} from '@backstage/core';
import { ChromeUXReportApi, chromeuxReportApiRef } from '../api';

describe('ChromeUXReportPage', () => {
  const configApi: ConfigApi = new ConfigReader({
    chromeUXReport: {
      origins: [
        {
          site: 'backstage',
          name: 'Backstage',
        },
      ],
    },
  });

  const chromeUXReportApi: Partial<ChromeUXReportApi> = {
    getChromeUXMetrics: async () => {},
  };

  const renderWrapped = (children: React.ReactNode) =>
    render(
      wrapInTestApp(
        <ApiProvider
          apis={ApiRegistry.from([
            [configApiRef, configApi],
            [chromeuxReportApiRef, chromeUXReportApi],
          ])}
        >
          {children}
        </ApiProvider>,
      ),
    );

  it('render snapshot', async () => {
    const { asFragment } = renderWrapped(<ChromeUXReportPage />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('render successfully', async () => {
    const rendered = renderWrapped(<ChromeUXReportPage />);
    const headerTitle = await rendered.findByText('Chrome UX Report');
    const headerSubtitle = await rendered.findByText(
      'Chrome UX Report is a powerful plugin for analyzing your site’s speed in a variety of different ways.',
    );

    await waitFor(async () => {
      expect(headerTitle).toBeInTheDocument();
      expect(headerSubtitle).toBeInTheDocument();
    });
  });
});
