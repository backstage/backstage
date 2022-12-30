/*
 * Copyright 2022 The Backstage Authors
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

import React, { useCallback, useEffect } from 'react';

import {
  Typography,
  IconButton,
  Tooltip,
  Button,
  makeStyles,
  Grid,
} from '@material-ui/core';
import RetryIcon from '@material-ui/icons/Replay';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { useWorkflowRuns } from '../../useWorkflowRuns';
import { getProjectNameFromEntity } from '../../getProjectNameFromEntity';
import { Entity } from '@backstage/catalog-model';
import { readGithubIntegrationConfigs } from '@backstage/integration';

import { EmptyState } from '@backstage/core-components';
import { configApiRef, useApi, useApp } from '@backstage/core-plugin-api';
import { useEntity } from '@backstage/plugin-catalog-react';
import { useDrawer } from '@backstage/plugin-interactive-drawers';
import Run from './Run';

const useStyles = makeStyles(theme => ({
  emptyState: {
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
    height: '100%',
  },
}));

export function WorkflowRunsDrawer({ path }: { path: string }) {
  const { entity } = useEntity();
  return <WorkflowRunsList entity={entity} path={path} />;
}

function WorkflowRunsList({
  entity,
  branch,
  path,
}: {
  entity: Entity;
  branch?: string;
  path: string;
}) {
  const config = useApi(configApiRef);
  const { Progress } = useApp().getComponents();
  const { emptyState } = useStyles();
  const { setTitle } = useDrawer();

  useEffect(() => {
    setTitle(`${entity.metadata.name} runs`);
  }, [setTitle, entity.metadata.name]);

  const projectName = getProjectNameFromEntity(entity);
  // TODO: Get github hostname from metadata annotation
  const hostname = readGithubIntegrationConfigs(
    config.getOptionalConfigArray('integrations.github') ?? [],
  )[0].host;
  const [owner, repo] = (projectName ?? '/').split('/');

  const [{ runs, page, total, pageSize, loading }, { retry, setPage }] =
    useWorkflowRuns({
      hostname,
      owner,
      repo,
      branch,
      initialPageSize: 10,
    });

  const prevPage = useCallback(() => {
    setPage(curPage => curPage - 1);
  }, [setPage]);
  const nextPage = useCallback(() => {
    setPage(curPage => curPage + 1);
  }, [setPage]);

  const githubHost = hostname || 'github.com';
  const hasNoRuns = !loading && !runs;

  return hasNoRuns ? (
    <div className={emptyState}>
      <EmptyState
        missing="data"
        title="No Workflow Data"
        description="This component has GitHub Actions enabled, but no data was found. Have you created any Workflows? Click the button below to create a new Workflow."
        action={
          <Button
            variant="contained"
            color="primary"
            href={`https://${githubHost}/${projectName}/actions/new`}
          >
            Create new Workflow
          </Button>
        }
      />
    </div>
  ) : (
    <>
      <div>
        <Grid container alignItems="center" direction="row">
          <Grid item xs={2}>
            <IconButton onClick={prevPage}>
              <ChevronLeftIcon />
            </IconButton>
          </Grid>
          <Grid item xs={6} alignItems="center">
            <Typography>
              Page {page + 1} of {Math.ceil(total / pageSize)}
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <IconButton onClick={nextPage}>
              <ChevronRightIcon />
            </IconButton>
          </Grid>
          <Grid item xs={2}>
            <Tooltip title="Retry / refresh">
              <IconButton onClick={retry}>
                <RetryIcon />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      </div>
      <div>
        {loading ? <Progress /> : null}
        {runs?.map(run => (
          <Run key={run.url + run.id} run={run} path={path} />
        ))}
        <div style={{ height: 1 }} />
      </div>
    </>
  );
}
