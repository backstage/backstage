/*
 * Copyright 2020 The Backstage Authors
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

import React, { useEffect } from 'react';
import { useWorkflowRuns, WorkflowRun } from '../useWorkflowRuns';
import { WorkflowRunsTable } from '../WorkflowRunsTable';
import { useEntity } from '@backstage/plugin-catalog-react';
import { WorkflowRunStatus } from '../WorkflowRunStatus';
import { makeStyles, LinearProgress } from '@material-ui/core';
import ExternalLinkIcon from '@material-ui/icons/Launch';
import { CLOUDBUILD_ANNOTATION } from '../useProjectName';
import { getLocation } from '../useLocation';
import { getCloudbuildFilter } from '../useCloudBuildFilter';

import {
  InfoCard,
  Link,
  StructuredMetadataTable,
  WarningPanel,
} from '@backstage/core-components';
import { errorApiRef, useApi } from '@backstage/core-plugin-api';

const useStyles = makeStyles({
  externalLinkIcon: {
    fontSize: 'inherit',
    verticalAlign: 'bottom',
  },
});

const WidgetContent = ({
  error,
  loading,
  lastRun,
  branch,
}: {
  error?: Error;
  loading?: boolean;
  lastRun: WorkflowRun;
  branch: string;
}) => {
  const classes = useStyles();
  if (error)
    return <WarningPanel>Couldn't fetch latest {branch} run</WarningPanel>;
  if (loading) return <LinearProgress />;
  return (
    <StructuredMetadataTable
      metadata={{
        status: (
          <>
            <WorkflowRunStatus status={lastRun.status} />
          </>
        ),
        message: lastRun.message,
        url: (
          <Link to={lastRun.googleUrl ?? ''}>
            See more on Google{' '}
            <ExternalLinkIcon className={classes.externalLinkIcon} />
          </Link>
        ),
      }}
    />
  );
};

/** @public */
export const LatestWorkflowRunCard = (props: { branch: string }) => {
  const { branch = 'master' } = props;
  const { entity } = useEntity();
  const errorApi = useApi(errorApiRef);
  const projectId = entity?.metadata.annotations?.[CLOUDBUILD_ANNOTATION] || '';
  const location = getLocation(entity);
  const cloudBuildFilter = getCloudbuildFilter(entity);

  const [{ runs, loading, error }] = useWorkflowRuns({
    projectId,
    location,
    cloudBuildFilter,
  });
  const lastRun = runs?.[0] ?? ({} as WorkflowRun);
  useEffect(() => {
    if (error) {
      errorApi.post(error);
    }
  }, [error, errorApi]);

  return (
    <InfoCard title={`Last ${branch} build`}>
      <WidgetContent
        error={error}
        loading={loading}
        branch={branch}
        lastRun={lastRun}
      />
    </InfoCard>
  );
};

/** @public */
export const LatestWorkflowsForBranchCard = (props: { branch: string }) => {
  const { branch = 'master' } = props;
  const { entity } = useEntity();

  return (
    <InfoCard title={`Last ${branch} build`}>
      <WorkflowRunsTable entity={entity} />
    </InfoCard>
  );
};
