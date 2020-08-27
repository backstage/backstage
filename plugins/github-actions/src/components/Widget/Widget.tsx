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
import React, { useEffect } from 'react';
import { useWorkflowRuns } from '../useWorkflowRuns';
import { WorkflowRun, WorkflowRunsTable } from '../WorkflowRunsTable';
import { Entity } from '@backstage/catalog-model';
import { WorkflowRunStatus } from '../WorkflowRunStatus';
import {
  Link,
  Theme,
  makeStyles,
  LinearProgress,
  Typography,
} from '@material-ui/core';
import {
  InfoCard,
  StructuredMetadataTable,
  errorApiRef,
  useApi,
} from '@backstage/core';
import ExternalLinkIcon from '@material-ui/icons/Launch';

const useStyles = makeStyles<Theme>({
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
  if (error) return <Typography>Couldn't fetch latest {branch} run</Typography>;
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
          <Link href={lastRun.githubUrl} target="_blank">
            See more on GitHub{' '}
            <ExternalLinkIcon className={classes.externalLinkIcon} />
          </Link>
        ),
      }}
    />
  );
};

export const Widget = ({
  entity,
  branch = 'master',
}: {
  entity: Entity;
  branch: string;
}) => {
  const errorApi = useApi(errorApiRef);
  const [owner, repo] = (
    entity?.metadata.annotations?.['backstage.io/github-actions-id'] ?? '/'
  ).split('/');
  const [{ runs, loading, error }] = useWorkflowRuns({
    owner,
    repo,
    branch,
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

const WidgetListContent = ({
  error,
  loading,
  branch,
}: {
  error?: Error;
  loading?: boolean;
  lastRun: WorkflowRun;
  branch: string;
}) => {
  if (error) return <Typography>Couldn't fetch {branch} runs</Typography>;
  if (loading) return <LinearProgress />;
  return <WorkflowRunsTable />;
};

export const WidgetList = ({
  entity,
  branch = 'master',
}: {
  entity: Entity;
  branch: string;
}) => {
  const errorApi = useApi(errorApiRef);
  const [owner, repo] = (
    entity?.metadata.annotations?.['backstage.io/github-actions-id'] ?? '/'
  ).split('/');
  const [{ runs, loading, error }] = useWorkflowRuns({
    owner,
    repo,
    branch,
  });

  const lastRun = runs?.[0] ?? ({} as WorkflowRun);
  useEffect(() => {
    if (error) {
      errorApi.post(error);
    }
  }, [error, errorApi]);

  return (
    <InfoCard title={`${branch} builds`}>
      <WidgetListContent
        error={error}
        loading={loading}
        branch={branch}
        lastRun={lastRun}
      />
    </InfoCard>
  );
};
