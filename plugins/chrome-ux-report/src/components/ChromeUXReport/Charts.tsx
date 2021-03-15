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

import { Progress, useApi } from '@backstage/core';
import Chart from 'react-google-charts';
import React from 'react';
import { chromeuxReportApiRef } from '../../api';
import { useAsync } from 'react-use';
import Alert from '@material-ui/lab/Alert';

export const Charts = ({
  metric,
}: {
  metric: { longName: string; shortName: string };
}) => {
  const chromeuxReportApi = useApi(chromeuxReportApiRef);
  const { longName, shortName } = metric;

  const { value, loading, error } = useAsync(async (): Promise<any> => {
    const response = await chromeuxReportApi.getChromeUXMetrics(shortName);
    return response.rates;
  }, []);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  const { fast, average, slow } = value;

  return (
    <Chart
      width="70%"
      height="100%"
      chartType="BarChart"
      loader={<Progress />}
      data={[
        ['Months', 'Fast', 'Average', 'Slow'],
        ['Aralik', fast, average, slow],
        ['Ocak', fast, average, slow],
        ['Subat', fast, average, slow],
        ['Mart', fast, average, slow],
      ]}
      options={{
        title: `${longName} - ${shortName.toLocaleUpperCase('en-US')}`,
        chartArea: { width: '80%' },
        isStacked: true,
        hAxis: {
          title: 'Percentage',
          minValue: 0,
        },
        animation: {
          startup: true,
          easing: 'linear',
          duration: 500,
        },
        vAxis: {
          title: 'Months',
        },
        backgroundColor: '#424242',
        colors: ['#5cb85c', '#f0ad4e', '#d9534f'],
      }}
      rootProps={{ 'data-testid': '3' }}
    />
  );
};
