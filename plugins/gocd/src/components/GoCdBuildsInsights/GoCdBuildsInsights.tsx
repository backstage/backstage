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
import { groupBy, mean } from 'lodash';
import {
  PipelineHistory,
  Job,
  toBuildResultStatus,
  GoCdBuildResultStatus,
} from '../../api/gocdApi.model';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { DateTime, Duration } from 'luxon';

export type GoCdBuildsInsightsProps = {
  pipelineHistory: PipelineHistory | undefined;
  loading: boolean;
  error: Error | undefined;
};

function runFrequency(pipelineHistory: PipelineHistory): string {
  const lastMonth = DateTime.now().minus({ month: 1 });
  const buildLastMonth = pipelineHistory.pipelines
    .map(p => p.scheduled_date)
    .filter((d): d is number => !!d)
    .map(d => DateTime.fromMillis(d))
    .filter(d => d > lastMonth).length;
  return `${buildLastMonth} last month`;
}

function meanTimeBetweenFailures(jobs: Job[]): string {
  const timeBetweenFailures: Duration[] = [];
  for (let index = 1; index < jobs.length; index++) {
    const job = jobs[index];
    if (!job.result) {
      continue;
    }
    if (toBuildResultStatus(job.result) === GoCdBuildResultStatus.error) {
      let previousFailedJob: Job | null = null;
      for (let j = index - 1; j >= 0; j--) {
        const candidateJob = jobs[j];
        if (!candidateJob.result) {
          continue;
        }
        if (
          toBuildResultStatus(candidateJob.result) ===
          GoCdBuildResultStatus.error
        ) {
          previousFailedJob = candidateJob;
          break;
        }
      }
      if (
        !previousFailedJob ||
        !job.scheduled_date ||
        !previousFailedJob.scheduled_date
      ) {
        continue;
      }
      const failedJobDate = DateTime.fromMillis(job.scheduled_date);
      const previousFailedJobDate = DateTime.fromMillis(
        previousFailedJob.scheduled_date,
      );
      const timeBetweenFailure = failedJobDate.diff(previousFailedJobDate);
      timeBetweenFailures.push(timeBetweenFailure);
    }
  }
  return formatMean(timeBetweenFailures);
}

/**
 * Imagine a sequence like:
 * S - S - S - F - S - F - F - S - S
 *
 * We iterate until finding a failure, and then iterate forward
 * until we find the first immediate success to then
 * calculate the time difference between the scheduling of the jobs.
 */
function meanTimeToRecovery(jobs: Job[]): string {
  const timeToRecoverIntervals: Duration[] = [];
  for (let index = 0; index < jobs.length; index++) {
    const job = jobs[index];
    if (!job.result) {
      continue;
    }
    if (toBuildResultStatus(job.result) === GoCdBuildResultStatus.error) {
      let nextSuccessfulJob: Job | null = null;
      for (let j = index + 1; j < jobs.length; j++) {
        const candidateJob = jobs[j];
        if (!candidateJob.result) {
          continue;
        }
        if (
          toBuildResultStatus(candidateJob.result) ===
          GoCdBuildResultStatus.successful
        ) {
          nextSuccessfulJob = candidateJob;
          break;
        }
      }
      if (
        !nextSuccessfulJob ||
        !job.scheduled_date ||
        !nextSuccessfulJob.scheduled_date
      ) {
        continue;
      }
      const failedJobDate = DateTime.fromMillis(job.scheduled_date);
      const successfulJobDate = DateTime.fromMillis(
        nextSuccessfulJob.scheduled_date,
      );
      const timeToRecovery = successfulJobDate.diff(failedJobDate);
      timeToRecoverIntervals.push(timeToRecovery);
    }
  }

  return formatMean(timeToRecoverIntervals);
}

function formatMean(durations: Duration[]): string {
  if (durations.length === 0) {
    return 'N/A';
  }

  const mttr: Duration = Duration.fromMillis(
    mean(durations.map(i => i.milliseconds)),
  );
  return mttr.toFormat("d'd' h'h' m'm' s's'");
}

function failureRate(jobs: Job[]): {
  title: string;
  subtitle: string;
} {
  const resultGroups = new Map(
    Object.entries(groupBy(jobs, 'result')).map(([key, value]) => [
      toBuildResultStatus(key),
      value.flat(),
    ]),
  );
  const failedJobs = resultGroups.get(GoCdBuildResultStatus.error);
  if (!failedJobs) {
    return {
      title: '0',
      subtitle: '(no failed jobs found)',
    };
  }

  resultGroups.delete(GoCdBuildResultStatus.error);
  const nonFailedJobs = Array.from(resultGroups.values()).flat();

  const totalJobs = failedJobs.length + nonFailedJobs.length;
  const percentage = (failedJobs.length / totalJobs) * 100;
  const decimalPercentage = (Math.round(percentage * 100) / 100).toFixed(2);
  return {
    title: `${decimalPercentage}%`,
    subtitle: `(${failedJobs.length} out of ${totalJobs} jobs)`,
  };
}

export const GoCdBuildsInsights = (
  props: GoCdBuildsInsightsProps,
): JSX.Element => {
  const { pipelineHistory, loading, error } = props;

  if (loading || error || !pipelineHistory) {
    return <></>;
  }

  // We reverse the array to calculate insights to make sure jobs are ordered
  // by their schedule date.
  const stages = pipelineHistory.pipelines
    .slice()
    .reverse()
    .map(p => p.stages)
    .flat();
  const jobs = stages.map(s => s.jobs).flat();

  const failureRateObj: { title: string; subtitle: string } = failureRate(jobs);

  return (
    <Box data-testid="GoCdBuildsInsightsBox" sx={{ mb: 1 }}>
      <Grid container spacing={1}>
        <Grid item xs={6} sm={3}>
          <Tooltip title="What is your deployment frequency?">
            <Card>
              <CardContent>
                <Typography variant="body2">Run Frequency</Typography>
                <Typography variant="h4">
                  {runFrequency(pipelineHistory)}
                </Typography>
              </CardContent>
            </Card>
          </Tooltip>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Tooltip title="How long does it take to fix a failure?">
            <Card>
              <CardContent>
                <Typography variant="body2">Mean Time to Recovery</Typography>
                <Typography variant="h4">{meanTimeToRecovery(jobs)}</Typography>
              </CardContent>
            </Card>
          </Tooltip>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Tooltip title="How often do changes fail?">
            <Card>
              <CardContent>
                <Typography variant="body2">
                  Mean Time Between Failures
                </Typography>
                <Typography variant="h4">
                  {meanTimeBetweenFailures(jobs)}
                </Typography>
              </CardContent>
            </Card>
          </Tooltip>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Tooltip title="What percentage of changes result in a failure?">
            <Card>
              <CardContent>
                <Typography variant="body2">Failure Rate</Typography>
                <Typography variant="h4">{failureRateObj.title}</Typography>
                <Typography variant="body2">
                  {failureRateObj.subtitle}
                </Typography>
              </CardContent>
            </Card>
          </Tooltip>
        </Grid>
      </Grid>
    </Box>
  );
};
