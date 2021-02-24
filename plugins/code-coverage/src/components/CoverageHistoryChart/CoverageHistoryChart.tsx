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

import React from 'react';
import {
  Box,
  Card,
  CardContent,
  MenuItem,
  Select,
  Typography,
} from '@material-ui/core';
import {
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import { useAsync } from 'react-use';
import { useApi } from '@backstage/core-api';
import { useEntity } from '@backstage/plugin-catalog-react';
import { codeCoverageApiRef } from '../../api';
import { Progress } from '@backstage/core';
import { Alert } from '@material-ui/lab';
import TrendingDownIcon from '@material-ui/icons/TrendingDown';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import TrendingFlatIcon from '@material-ui/icons/TrendingFlat';

type Coverage = 'line' | 'branch';

const getTrendIcon = (trend: number) => {
  switch (true) {
    case trend > 0:
      return <TrendingUpIcon style={{ color: 'green' }} />;
    case trend < 0:
      return <TrendingDownIcon style={{ color: 'red' }} />;
    case trend === 0:
    default:
      return <TrendingFlatIcon />;
  }
};

export const CoverageHistoryChart = () => {
  const { entity } = useEntity();
  const codeCoverageApi = useApi(codeCoverageApiRef);
  const {
    loading: loadingHistory,
    error: errorHistory,
    value: valueHistory,
  } = useAsync(
    async () =>
      await codeCoverageApi.getCoverageHistoryForEntity({
        kind: entity.kind,
        namespace: entity.metadata.namespace || 'default',
        name: entity.metadata.name,
      }),
  );

  if (loadingHistory) {
    return <Progress />;
  } else if (errorHistory) {
    return <Alert severity="error">{errorHistory.message}</Alert>;
  }

  if (!valueHistory.history.length) {
    return (
      <Box>
        <Card>
          <CardContent>
            <Box mb={2} display="flex" justifyContent="space-between">
              <Typography variant="h5">History</Typography>
            </Box>
            No coverage history found
          </CardContent>
        </Card>
      </Box>
    );
  }

  const oldestCoverage = valueHistory.history[0];
  const [latestCoverage] = valueHistory.history.slice(-1);

  const getTrendForCoverage = (type: Coverage) => {
    if (!oldestCoverage[type].percentage) {
      return 0;
    }
    return (
      ((latestCoverage[type].percentage - oldestCoverage[type].percentage) /
        oldestCoverage[type].percentage) *
      100
    );
  };

  const lineTrend = getTrendForCoverage('line');
  const branchTrend = getTrendForCoverage('branch');

  return (
    <Box>
      <Card>
        <CardContent>
          <Box mb={2} display="flex" justifyContent="space-between">
            <Typography variant="h5">History</Typography>
            <Select>
              <MenuItem>7</MenuItem>
            </Select>
          </Box>
          <Box px={6} display="flex">
            <Box display="flex" mr={4}>
              {getTrendIcon(lineTrend)}
              <Typography>
                Current line: {latestCoverage.line.percentage}%<br />(
                {Math.floor(lineTrend)}% change over{' '}
                {valueHistory.history.length} builds)
              </Typography>
            </Box>
            <Box display="flex">
              {getTrendIcon(branchTrend)}
              <Typography>
                Current branch: {latestCoverage.branch.percentage}%<br />(
                {Math.floor(branchTrend)}% change over{' '}
                {valueHistory.history.length} builds)
              </Typography>
            </Box>
          </Box>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={valueHistory.history}
              margin={{ right: 48, top: 32 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis dataKey="line.percentage" />
              <YAxis dataKey="branch.percentage" />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="branch.percentage"
                stroke="#8884d8"
              />
              <Line
                type="monotone"
                dataKey="line.percentage"
                stroke="#82ca9d"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </Box>
  );
};
