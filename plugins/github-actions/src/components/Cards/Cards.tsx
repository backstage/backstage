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

import { readGithubIntegrationConfigs } from '@backstage/integration';
import { useEntity } from '@backstage/plugin-catalog-react';
import {
  LinearProgress,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';
import ExternalLinkIcon from '@material-ui/icons/Launch';
import React, { useEffect } from 'react';
import { GITHUB_ACTIONS_ANNOTATION } from '../getProjectNameFromEntity';
import { useWorkflowRuns, WorkflowRun } from '../useWorkflowRuns';
import { WorkflowRunsTable } from '../WorkflowRunsTable';
import { WorkflowRunStatus } from '../WorkflowRunStatus';
import { configApiRef, errorApiRef, useApi } from '@backstage/core-plugin-api';
import {
  InfoCard,
  InfoCardVariants,
  Link,
  StructuredMetadataTable,
} from '@backstage/core-components';

const useStyles = makeStyles<Theme>({
  externalLinkIcon: {
    fontSize: 'inherit',
    verticalAlign: 'bottom',
  },
});

const WidgetContent = (props: {
  error?: Error;
  loading?: boolean;
  lastRun: WorkflowRun;
  branch: string;
}) => {
  const { error, loading, lastRun, branch } = props;
  const classes = useStyles();

  if (error) return <Typography>Couldn't fetch latest {branch} run</Typography>;
  if (loading) return <LinearProgress />;

  return (
    <StructuredMetadataTable
      metadata={{
        status: (
          <>
            <WorkflowRunStatus
              status={lastRun.status}
              conclusion={lastRun.conclusion}
            />
          </>
        ),
        message: lastRun.message,
        url: (
          <Link to={lastRun.githubUrl ?? ''}>
            See more on GitHub{' '}
            <ExternalLinkIcon className={classes.externalLinkIcon} />
          </Link>
        ),
      }}
    />
  );
};

/** @public */
export const LatestWorkflowRunCard = (props: {
  branch: string;
  variant?: InfoCardVariants;
}) => {
  const { branch = 'master', variant } = props;
  const { entity } = useEntity();
  const config = useApi(configApiRef);
  const errorApi = useApi(errorApiRef);
  // TODO: Get github hostname from metadata annotation
  const hostname = readGithubIntegrationConfigs(
    config.getOptionalConfigArray('integrations.github') ?? [],
  )[0].host;
  const [owner, repo] = (
    entity?.metadata.annotations?.[GITHUB_ACTIONS_ANNOTATION] ?? '/'
  ).split('/');
  const [{ runs, loading, error }] = useWorkflowRuns({
    hostname,
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
    <InfoCard title={`Last ${branch} build`} variant={variant}>
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
export const LatestWorkflowsForBranchCard = (props: {
  branch: string;
  variant?: InfoCardVariants;
}) => {
  const { branch = 'master', variant } = props;
  const { entity } = useEntity();

  return (
    <InfoCard title={`Last ${branch} build`} variant={variant}>
      <WorkflowRunsTable branch={branch} entity={entity} />
    </InfoCard>
  );
};
