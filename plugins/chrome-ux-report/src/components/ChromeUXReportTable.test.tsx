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
import { ChromeUXReportTable } from './ChromeUXReportTable';
import { wrapInTestApp } from '@backstage/test-utils';
import { render, waitFor } from "@testing-library/react";
import {
  ApiProvider,
  ApiRegistry
} from "../../../../packages/core-api";
import { ChromeUXReportApi, chromeuxReportApiRef } from "../api";

describe('ChromeUXReportTable', () => {
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
            [chromeuxReportApiRef, chromeUXReportApi]
          ])}
        >
          {children}
        </ApiProvider>,
      ),
    );


  it('render successfully', async () => {
    const origin = 'Backstage';
    const rendered = renderWrapped(<ChromeUXReportTable origin={origin} />);
    const formFactor = await rendered.findAllByText('Desktop');
    const connectionType =  await rendered.findAllByText('4G');
    const fastValue = await rendered.findAllByText('80%');
    const averageValue = await rendered.findAllByText('15%');
    const slowValue = await rendered.findAllByText('5%');

    await waitFor(async () => {
      expect(formFactor[0]).toBeInTheDocument();
      expect(connectionType[0]).toBeInTheDocument();
      expect(fastValue[0]).toBeInTheDocument();
      expect(averageValue[0]).toBeInTheDocument();
      expect(slowValue[0]).toBeInTheDocument();
    });
  });
});
