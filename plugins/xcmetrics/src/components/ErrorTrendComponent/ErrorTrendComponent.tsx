/*
 * Copyright 2021 The Backstage Authors
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
import { Progress, TrendLine } from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';
import { BuildCount, xcmetricsApiRef } from '../../api';
import { useAsync } from 'react-use';
import { Alert } from '@material-ui/lab';

const TRENDLINE_TITLE = 'Error Rate';

interface ErrorTrendProps {
  days: number;
}

export const ErrorTrendComponent = ({ days }: ErrorTrendProps) => {
  const client = useApi(xcmetricsApiRef);
  const { value: buildCounts, loading, error } = useAsync(
    async (): Promise<BuildCount[]> => client.getBuildCounts(days),
    [],
  );

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  } else if (!buildCounts) {
    return <TrendLine data={Array(days).fill(0)} title={TRENDLINE_TITLE} />;
  }

  let max = 0;
  const averageErrors = buildCounts.map(counts => {
    if (counts.builds === 0) return 0;
    const dayAverage = counts.errors / counts.builds;
    max = Math.max(max, dayAverage);
    return dayAverage;
  });

  return <TrendLine data={averageErrors} title={TRENDLINE_TITLE} max={max} />;
};
