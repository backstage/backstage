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
import { render, waitFor } from "@testing-library/react";
import {
  ApiProvider,
  ApiRegistry,
  ConfigApi,
  configApiRef,
  ConfigReader
} from "../../../../packages/core-api";
import { ChromeUXReportApi, chromeuxReportApiRef } from "../api";

describe('ChromeUXReportPage', () => {
  const configApi: ConfigApi = new ConfigReader({
    chromeUXReport: {
      origins: [{
        site: 'backstage',
        name: 'Backstage'
      }]
    },
  });

  const chromeUXReportApi: Partial<ChromeUXReportApi> = {
    getChromeUXMetrics: async () => ({
      metrics: {
        origin_id: 1,
        period_id: 1,
        connection_type: '4G',
        form_factor: 'Desktop',
        first_contentful_paint: {
          rates: { fast: 0.80, average: 0.15, slow: 0.05 }
        },
        largest_contentful_paint: {
          rates: { fast: 0.80, average: 0.15, slow: 0.05 }
        },
        dom_content_loaded: {
          rates: { fast: 0.80, average: 0.15, slow: 0.05 }
        },
        onload: {
          rates: { fast: 0.80, average: 0.15, slow: 0.05 }
        },
        first_input: {
          rates: { fast: 0.80, average: 0.15, slow: 0.05 }
        },
        layout_instability: {
          rates: { fast: 0.80, average: 0.15, slow: 0.05 }
        },
        notifications: {
          rates: { fast: 0.80, average: 0.15, slow: 0.05 }
        },
        time_to_first_byte: {
          rates: { fast: 0.80, average: 0.15, slow: 0.05 }
        },
      }
    })
  };

  const renderWrapped = (children: React.ReactNode) =>
    render(
      wrapInTestApp(
        <ApiProvider
          apis={ApiRegistry.from([
            [configApiRef, configApi],
            [chromeuxReportApiRef, chromeUXReportApi]
          ])}
        >
          {children}
        </ApiProvider>,
      ),
    );


  it('render successfully', async () => {
    const rendered = renderWrapped(<ChromeUXReportPage />);
    const headerTitle = await rendered.findByText('Chrome UX Report');
    const headerSubtitle = await rendered.findByText('Chrome UX Report is a powerful plugin for analyzing your site’s speed in a variety of different ways.');

    await waitFor(async () => {
      expect(headerTitle).toBeInTheDocument();
      expect(headerSubtitle).toBeInTheDocument();
    });
  });
});
