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
import { V1CronJob } from '@kubernetes/client-node';
import { KubernetesDrawer } from '../KubernetesDrawer/KubernetesDrawer';
import { Typography, Grid, Chip } from '@material-ui/core';

export const CronJobDrawer = ({
  cronJob,
  expanded,
}: {
  cronJob: V1CronJob;
  expanded?: boolean;
}) => {
  const namespace = cronJob.metadata?.namespace;
  return (
    <KubernetesDrawer
      object={cronJob}
      expanded={expanded}
      kind="CronJob"
      renderObject={(cronJobObj: V1CronJob) => ({
        schedule: cronJobObj.spec?.schedule ?? '???',
        startingDeadlineSeconds:
          cronJobObj.spec?.startingDeadlineSeconds ?? '???',
        concurrencyPolicy: cronJobObj.spec?.concurrencyPolicy ?? '???',
        lastScheduleTime: cronJobObj.status?.lastScheduleTime ?? '???',
      })}
    >
      <Grid
        container
        direction="column"
        justifyContent="flex-start"
        alignItems="flex-start"
        spacing={0}
      >
        <Grid item>
          <Typography variant="h5">
            {cronJob.metadata?.name ?? 'unknown object'}
          </Typography>
        </Grid>
        <Grid item>
          <Typography color="textSecondary" variant="body1">
            CronJob
          </Typography>
        </Grid>
        {namespace && (
          <Grid item>
            <Chip size="small" label={`namespace: ${namespace}`} />
          </Grid>
        )}
      </Grid>
    </KubernetesDrawer>
  );
};
