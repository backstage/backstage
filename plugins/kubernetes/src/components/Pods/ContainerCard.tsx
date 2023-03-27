/*
 * Copyright 2023 The Backstage Authors
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

import { IContainer, IContainerStatus } from 'kubernetes-models/v1';
import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  Typography,
} from '@material-ui/core';

import { DateTime } from 'luxon';

import { PodLogContext, PodLogsDialog } from './PodLogs';
import { StructuredMetadataTable } from '@backstage/core-components';

export interface ContainerCardProps {
  logContext: PodLogContext;
  containerSpec?: IContainer;
  containerStatus: IContainerStatus;
}

export const ContainerCard: React.FC<ContainerCardProps> = ({
  logContext,
  containerSpec,
  containerStatus,
}: ContainerCardProps) => {
  // This should never be undefined
  if (containerSpec === undefined) {
    return <Typography>error reading pod from cluster</Typography>;
  }

  return (
    <Card>
      <CardHeader
        title={containerStatus.name}
        subheader={containerStatus.image}
      />
      <CardContent>
        <Grid container>
          <Grid item xs={12}>
            {containerStatus.state?.running !== undefined && (
              <>
                <Typography variant="subtitle2">
                  Started:{' '}
                  {DateTime.fromISO(
                    containerStatus.state?.running?.startedAt as any,
                  ).toRelative({
                    locale: 'en',
                  })}
                </Typography>
              </>
            )}
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2">Container health</Typography>
          </Grid>
          <Grid item xs={12}>
            <StructuredMetadataTable
              metadata={{
                'not waiting to start':
                  containerStatus.state?.waiting === undefined,
                started: containerStatus.started,
                ready: containerStatus.ready,
                'no restarts': containerStatus.restartCount === 0,
                'readiness probe set':
                  containerSpec && containerSpec?.readinessProbe !== undefined,
              }}
            />
          </Grid>
        </Grid>
      </CardContent>
      <CardActions disableSpacing>
        <PodLogsDialog
          logContext={{
            containerName: containerStatus.name,
            ...logContext,
          }}
        />
      </CardActions>
    </Card>
  );
};
