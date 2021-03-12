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
  Header,
  Page,
  Content,
  HeaderLabel,
  Progress,
  useApi
} from '@backstage/core';
import Alert from '@material-ui/lab/Alert';
import { useAsync } from 'react-use';
import Chart from 'react-google-charts';
import { chromeuxReportApiRef } from '../../api';

export const ChromeUXReport = () => {
  const chromeuxReportApi = useApi(chromeuxReportApiRef);

  const { value, loading, error } = useAsync(async (): Promise<any> => {
    const response = await chromeuxReportApi.getChromeUXMetrics();
    return response.rates;
  }, []);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  return (<Page themeId="tool">
    <Header title="Chrome UX Report" subtitle="Optional subtitle">
      <HeaderLabel label="Owner" value="Team X"/>
      <HeaderLabel label="Lifecycle" value="Alpha"/>
    </Header>
    <Content>
      <Chart
        width='90%'
        height='80%'
        chartType="BarChart"
        loader={<Progress />}
        data={[
          ['Months', 'Fast', 'Average', 'Slow'],
          ['Aralik',value.fast_fcp_rate, value.avg_fcp_rate, value.slow_fcp_rate],
          ['Ocak', value.fast_fcp_rate, value.avg_fcp_rate, value.slow_fcp_rate],
          ['Subat',value.fast_fcp_rate, value.avg_fcp_rate, value.slow_fcp_rate],
          ['Mart',value.fast_fcp_rate, value.avg_fcp_rate, value.slow_fcp_rate],
        ]}
        options={{
          title: 'First Contentful Paint - FCP',
          chartArea: { width: '80%' },
          isStacked: true,
          hAxis: {
            title: 'Percentage',
            minValue: 0,
          },
          animation: {
            startup: true,
            easing: 'linear',
            duration: 1500,
          },
          vAxis: {
            title: 'Months',
          },
          colors: ['#5cb85c', '#f0ad4e', '#d9534f'],
        }}
        rootProps={{ 'data-testid': '3' }}
      />
    </Content>
  </Page>);
};
