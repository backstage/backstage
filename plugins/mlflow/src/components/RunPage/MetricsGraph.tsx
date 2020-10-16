/*
 * Copyright 2020 Spotify AB
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
import React, { useState, useEffect } from 'react';
import { InfoCard, Table, TableColumn } from '@backstage/core';
import { Select, MenuItem } from '@material-ui/core';
import { mlFlowClient } from '../../index';
import { Metric } from '../../MLFlowClient';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

type MetricsGraphProps = { runId: string; metrics: Metric[] };

const MetricsGraph = ({ runId, metrics }: MetricsGraphProps) => {
  const [selectedMetric, setSelectedMetric] = useState<string>(
    metrics.length > 0 ? metrics[0].key : '',
  );
  const [metricHistory, setMetricHistory] = useState<Metric[]>([]);
  const [xAxis, setXAxis] = useState<string>('step');

  useEffect(() => {
    mlFlowClient
      .getMetricHistory(runId, selectedMetric)
      .then(newMetrics => setMetricHistory(newMetrics));
  }, [selectedMetric, runId]);

  if (metrics.length === 0) {
    return (
      <InfoCard title="Run Metrics">
        There aren't any metrics associated with this run.
      </InfoCard>
    );
  }

  const updateMetric = (newValue: string) => {
    setSelectedMetric(newValue);
  };

  const updateXAxis = (newValue: string) => {
    setXAxis(newValue);
  };

  const paramColumns: TableColumn[] = [
    { title: 'Key', field: 'key' },
    { title: 'Value', field: 'value' },
  ];

  return (
    <InfoCard>
      <Table
        title="Run Metrics"
        options={{ search: false, paging: false }}
        columns={paramColumns}
        data={metrics}
      />
      Choose a metric:{' '}
      <Select
        variant="outlined"
        value={selectedMetric}
        onChange={e => updateMetric(e.target.value as string)}
      >
        {metrics.map(metric => {
          return (
            <MenuItem key={metric.key} value={metric.key}>
              {metric.key}
            </MenuItem>
          );
        })}
      </Select>
      <Select
        variant="outlined"
        value={xAxis}
        onChange={e => updateXAxis(e.target.value as string)}
      >
        <MenuItem value="step">Step</MenuItem>
        <MenuItem value="timestamp">Time (wall)</MenuItem>
        {/* <MenuItem value="relative">Time (relative)</MenuItem> */}
      </Select>
      <LineChart width={800} height={400} data={metricHistory}>
        <Line type="monotone" dataKey="value" stroke="#8884d8" />
        <Tooltip />
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey={xAxis} />
        <YAxis />
      </LineChart>
    </InfoCard>
  );
};

export default MetricsGraph;
