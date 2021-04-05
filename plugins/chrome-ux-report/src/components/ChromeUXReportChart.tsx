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
import {
  useApi,
  Progress
} from '@backstage/core';
import { chromeuxReportApiRef } from "../api";
import { useAsync } from "react-use";
import Alert from "@material-ui/lab/Alert";
import { Chart } from "react-google-charts";

export const ChromeUXReportChart = ({ origin }: { origin: string; }) => {
  const chromeUXReportApi = useApi(chromeuxReportApiRef);

  const { value, loading, error } = useAsync(async (): Promise<any> => {
    const response = await chromeUXReportApi.getChromeUXMetrics(origin);
    return response.metrics;
  }, []);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  const {
    first_contentful_paint,
    largest_contentful_paint,
    dom_content_loaded,
    first_input_delay,
    onload,
    first_paint,
    time_to_first_byte
  } = value;

  return <Chart
    width='100%'
    height='800px'
    chartType="BarChart"
    loader={<Progress />}
    data={[
      ['METRICS', 'FAST', 'AVERAGE', 'SLOW'],
      ['FIRST CONTENTFUL PAINT',first_contentful_paint.fast, first_contentful_paint.average, first_contentful_paint.slow],
      ['LARGEST CONTENTFUL PAINT', largest_contentful_paint.fast, largest_contentful_paint.average, largest_contentful_paint.slow],
      ['DOM CONTENT LOADED',dom_content_loaded.fast, dom_content_loaded.average, dom_content_loaded.slow],
      ['FIRST INPUT DELAY',first_input_delay.fast, first_input_delay.average, first_input_delay.slow],
      ['ONLOAD',onload.fast, onload.average, onload.slow],
      ['FIRST PAINT',first_paint.fast, first_paint.average, first_paint.slow],
      ['TIME TO FIRST BYTE',time_to_first_byte.fast, time_to_first_byte.average, time_to_first_byte.slow]
    ]}
    options={{
      isStacked: true,
      hAxis: {
        title: 'PERCENTAGE',
        format: "#.#%",
        titleTextStyle: {
          color: 'grey',
          bold: true
        },
        textStyle: {
          color: "#CCCCCC",
          bold: true
        },
        minValue:0
      },
      animation: {
        startup: true,
        easing: 'linear',
        duration: 500,
      },
      vAxis: {
        title: 'METRICS',
        titleTextStyle: {
          color: 'grey',
          bold: true
        },
        textStyle: {
          color: "#CCCCCC",
          bold: true
        }
      },
      legend: {
        textStyle: {
          color: 'grey',
          bold: true
        }
      },
      backgroundColor: '#424242',
      colors: ['#5cb85c', '#f0ad4e', '#d9534f'],
      chartArea:{left:350,top:130}
    }}
    rootProps={{ 'data-testid': '3' }}
  />;
};
