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
import { createStyles, Divider, Grid, makeStyles } from '@material-ui/core';
import React from 'react';
import { Build, xcmetricsApiRef } from '../../api';
import {
  OverflowTooltip,
  Progress,
  StructuredMetadataTable,
} from '@backstage/core-components';
import { Alert } from '@material-ui/lab';
import { useAsync } from 'react-use';
import { useApi } from '@backstage/core-plugin-api';
import { formatDuration, formatStatus, formatTime } from '../../utils';
import { StatusIconComponent as StatusIcon } from '../StatusIconComponent';
import { BackstageTheme } from '@backstage/theme';
import { AccordionComponent } from '../AccordionComponent';

const useStyles = makeStyles((theme: BackstageTheme) =>
  createStyles({
    divider: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
  }),
);

interface BuildDetailsProps {
  build: Build;
}

export const BuildDetailsComponent = ({ build }: BuildDetailsProps) => {
  const classes = useStyles();
  const client = useApi(xcmetricsApiRef);
  const hostResult = useAsync(async () => client.getBuildHost(build.id), []);
  const errorsResult = useAsync(
    async () => client.getBuildErrors(build.id),
    [],
  );
  const warningsResult = useAsync(
    async () => client.getBuildWarnings(build.id),
    [],
  );
  const metadataResult = useAsync(
    async () => client.getBuildMetadata(build.id),
    [],
  );

  const buildDetails = {
    id: build.id,
    project: build.projectName,
    schema: build.schema,
    category: build.category,
    userId: build.userid,
    'started at': formatTime(build.startTimestamp),
    'ended at': formatTime(build.endTimestamp),
    duration: formatDuration(build.duration),
    status: (
      <>
        <StatusIcon buildStatus={build.buildStatus} />
        {formatStatus(build.buildStatus)}
      </>
    ),
    CI: build.isCi,
  };

  return (
    <Grid container direction="column" spacing={3}>
      <Grid container item direction="row">
        <Grid item xs={4}>
          <StructuredMetadataTable metadata={buildDetails} />
        </Grid>
        <Grid item xs={8}>
          <AccordionComponent
            id="buildHost"
            heading="Host"
            secondaryHeading={build.machineName}
          >
            {hostResult.loading && <Progress />}
            {!hostResult.loading && hostResult.value && (
              <StructuredMetadataTable metadata={hostResult.value} />
            )}
          </AccordionComponent>

          <AccordionComponent
            id="buildErrors"
            heading="Errors"
            secondaryHeading={build.errorCount}
            disabled={build.errorCount === 0}
          >
            <div>
              {errorsResult.loading && <Progress />}
              {!errorsResult.loading &&
                errorsResult.value &&
                errorsResult.value.map((error, idx) => (
                  <div key={error.id}>
                    <OverflowTooltip text={error.detail} line={5} />
                    {idx !== errorsResult.value.length - 1 && (
                      <Divider className={classes.divider} />
                    )}
                  </div>
                ))}
            </div>
          </AccordionComponent>

          <AccordionComponent
            id="buildWarnings"
            heading="Warnings"
            secondaryHeading={build.warningCount}
            disabled={build.warningCount === 0}
          >
            <div>
              {warningsResult.loading && <Progress />}
              {!warningsResult.loading &&
                warningsResult.value &&
                warningsResult.value.map((warning, idx) => (
                  <div key={warning.id}>
                    <OverflowTooltip
                      text={warning.detail ?? warning.title}
                      line={5}
                    />
                    {idx !== warningsResult.value.length - 1 && (
                      <Divider className={classes.divider} />
                    )}
                  </div>
                ))}
            </div>
          </AccordionComponent>

          <AccordionComponent
            id="buildMetadata"
            heading="Metadata"
            disabled={!metadataResult.loading && !metadataResult.value}
          >
            {metadataResult.loading && <Progress />}
            {!metadataResult.loading && metadataResult.value && (
              <StructuredMetadataTable metadata={metadataResult.value} />
            )}
          </AccordionComponent>
        </Grid>
      </Grid>
      <Grid item>{/* TODO: Sequnce chart */}</Grid>
    </Grid>
  );
};

export const withRequest = (Component: typeof BuildDetailsComponent) => ({
  buildId,
}: {
  buildId: string;
}) => {
  const client = useApi(xcmetricsApiRef);
  const { value: build, loading, error } = useAsync(
    async () => client.getBuild(buildId),
    [],
  );

  if (loading) {
    return <Progress />;
  }

  if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  if (!build) {
    return <Alert severity="error">Could not load build {buildId}</Alert>;
  }

  return <Component build={build} />;
};
