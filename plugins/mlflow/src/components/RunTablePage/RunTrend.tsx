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
import { InfoCard } from '@backstage/core';
import {
  FormControl,
  FormHelperText,
  Grid,
  MenuItem,
  Select,
} from '@material-ui/core';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { Run } from '../../MLFlowClient';

type MetricWithRun = {
  runId?: string;
  key: string;
  value: number;
  timestamp: number;
  dateString: string;
  step: number;
};

const metricWithRunSortFn = (m1: MetricWithRun, m2: MetricWithRun) => {
  return m1.timestamp - m2.timestamp;
};
function reformatRuns(runs: Run[]): Record<string, MetricWithRun[]> {
  const runMetrics = runs.flatMap(runToTrendMetric);
  const allKeys = new Set(runMetrics.map(rm => rm.key));
  let keyToMetricSeries: Record<string, MetricWithRun[]> = {};
  allKeys.forEach(key => {
    keyToMetricSeries = {
      [key]: runMetrics.filter(rm => rm.key === key).sort(metricWithRunSortFn),
      ...keyToMetricSeries,
    };
  });
  return keyToMetricSeries;
}
function runToTrendMetric(run: Run): MetricWithRun[] {
  return run.data.metrics.map(m => {
    return {
      ...m,
      runId: run.info.run_id,
      timestamp: parseInt(m.timestamp, 10),
      dateString: new Date(parseInt(m.timestamp, 10)).toLocaleString(),
    };
  });
}

export const RunTrend = ({ runs }: { runs: Run[] }) => {
  const [availableMetrics, setAvailableMetrics] = useState<string[]>([]);
  const [selectedMetric, setSelectedMetric] = useState<string>('');
  const [parsedRuns, setParsedRuns] = useState<Record<string, MetricWithRun[]>>(
    { loading: [] },
  );
  const [trendData, setTrendData] = useState<MetricWithRun[]>([]);

  // THERE ARE THREE STEPS TO MANAGING THE STATE IN HERE:

  // 0. When new runs prop comes in, we parse them into a
  // mapping from (metric name) -> (array of metric values)
  useEffect(() => {
    setParsedRuns(reformatRuns(runs));
  }, [runs]);

  // 1. Once runs are loaded, find the available metrics and set the values in the dropdown.
  useEffect(() => {
    const allMetrics: string[] = Object.keys(parsedRuns);
    setAvailableMetrics(allMetrics);
    setSelectedMetric(allMetrics[0]);
  }, [parsedRuns]);

  // 2. When a person picks a different metric, update selectedMetric
  function updateMetric(metric: string) {
    setSelectedMetric(metric);
  }

  // 3. When parsedRuns OR selectedMetric are changed, refresh the trend data used in the chart.
  useEffect(() => {
    setTrendData(parsedRuns[selectedMetric]);
  }, [parsedRuns, selectedMetric]);

  return (
    <InfoCard title="Metric trends over time">
      <Grid container direction="column" spacing={3}>
        <Grid item>
          <FormControl variant="outlined">
            <Select
              value={selectedMetric}
              onChange={e => updateMetric(e.target.value as string)}
            >
              {availableMetrics.map((metric, k) => {
                return (
                  <MenuItem key={k} value={metric}>
                    {metric}
                  </MenuItem>
                );
              })}
            </Select>
            <FormHelperText>Select a metric</FormHelperText>
          </FormControl>
        </Grid>
        <Grid item>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={trendData}>
              <Line type="monotone" dataKey="value" stroke="#8884d8" />
              <Tooltip />
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="dateString" />
              <YAxis />
            </LineChart>
          </ResponsiveContainer>
        </Grid>
      </Grid>
    </InfoCard>
  );
};
