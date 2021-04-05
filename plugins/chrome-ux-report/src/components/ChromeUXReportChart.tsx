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
import { useApi, Progress } from '@backstage/core';
import { chromeuxReportApiRef } from '../api';
import { useAsync } from 'react-use';
import Alert from '@material-ui/lab/Alert';
import { Chart } from 'react-google-charts';
import { getPeriod, getRoundOfMetric } from '../utils';

export const ChromeUXReportChart = ({ origin }: { origin: string }) => {
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
    fast_fp,
    avg_fp,
    slow_fp,
    fast_fcp,
    avg_fcp,
    slow_fcp,
    fast_dcl,
    avg_dcl,
    slow_dcl,
    fast_ol,
    avg_ol,
    slow_ol,
    fast_fid,
    avg_fid,
    slow_fid,
    fast_ttfb,
    avg_ttfb,
    slow_ttfb,
    fast_lcp,
    avg_lcp,
    slow_lcp,
  } = value;

  return (
    <div>
      <div
        className="period"
        style={{
          display: 'flex',
          position: 'absolute',
          zIndex: 99,
          alignItems: 'center',
          justifyContent: 'center',
          width: '95%',
          marginTop: '30px',
          fontSize: '25px',
          fontWeight: 'bold',
          color: 'grey',
        }}
      >
        {getPeriod()}
      </div>
      <Chart
        width="100%"
        height="70vh"
        chartType="BarChart"
        loader={<Progress />}
        data={[
          ['METRICS', 'FAST', 'AVERAGE', 'SLOW'],
          [
            'First Contentful Paint',
            getRoundOfMetric(fast_fcp),
            getRoundOfMetric(avg_fcp),
            getRoundOfMetric(slow_fcp),
          ],
          [
            'Largest Contentful Paint',
            getRoundOfMetric(fast_lcp),
            getRoundOfMetric(avg_lcp),
            getRoundOfMetric(slow_lcp),
          ],
          [
            'Dom Content Loaded',
            getRoundOfMetric(fast_dcl),
            getRoundOfMetric(avg_dcl),
            getRoundOfMetric(slow_dcl),
          ],
          [
            'First Input Delay',
            getRoundOfMetric(fast_fid),
            getRoundOfMetric(avg_fid),
            getRoundOfMetric(slow_fid),
          ],
          [
            'Onload',
            getRoundOfMetric(fast_ol),
            getRoundOfMetric(avg_ol),
            getRoundOfMetric(slow_ol),
          ],
          [
            'First Paint',
            getRoundOfMetric(fast_fp),
            getRoundOfMetric(avg_fp),
            getRoundOfMetric(slow_fp),
          ],
          [
            'Time To First Byte',
            getRoundOfMetric(fast_ttfb),
            getRoundOfMetric(avg_ttfb),
            getRoundOfMetric(slow_ttfb),
          ],
        ]}
        options={{
          isStacked: true,
          hAxis: {
            title: 'PERCENTAGE',
            titleTextStyle: {
              color: 'grey',
              bold: true,
            },
            textStyle: {
              color: '#CCCCCC',
              bold: true,
            },
            viewWindowMode: 'explicit',
            viewWindow: {
              min: 0,
              max: 100,
            },
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
              bold: true,
            },
            textStyle: {
              color: '#CCCCCC',
              bold: true,
            },
          },
          legend: {
            textStyle: {
              color: 'grey',
              bold: true,
            },
          },
          backgroundColor: '#424242',
          colors: ['#5cb85c', '#f0ad4e', '#d9534f'],
          chartArea: {
            left: 300,
            top: 130,
          },
        }}
        rootProps={{ 'data-testid': '3' }}
      />
    </div>
  );
};
