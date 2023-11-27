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
import React, { ChangeEvent, useEffect, useState } from 'react';
import {
  Typography,
  Box,
  IconButton,
  Tooltip,
  Button,
  Chip,
  ButtonGroup,
  Grid,
  makeStyles,
  createStyles,
  Theme,
  TablePagination,
  Select,
  MenuItem,
  TextField,
  CircularProgress,
} from '@material-ui/core';
import {
  EmptyState,
  Link,
  MarkdownContent,
  InfoCard,
} from '@backstage/core-components';
import GitHubIcon from '@material-ui/icons/GitHub';
import RetryIcon from '@material-ui/icons/Replay';
import SyncIcon from '@material-ui/icons/Sync';
import ExternalLinkIcon from '@material-ui/icons/Launch';
import { useRouteRef } from '@backstage/core-plugin-api';
import { useWorkflowRuns, WorkflowRun } from '../useWorkflowRuns';
import { WorkflowRunStatus } from '../WorkflowRunStatus';
import { buildRouteRef } from '../../routes';
import { getProjectNameFromEntity } from '../getProjectNameFromEntity';
import { getHostnameFromEntity } from '../getHostnameFromEntity';

import { Alert, Color } from '@material-ui/lab';
import { Entity } from '@backstage/catalog-model';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      border: `1px solid ${theme.palette.divider}`,
      boxShadow: theme.shadows[2],
      borderRadius: '4px',
      overflow: 'visible',
      position: 'relative',
      margin: theme.spacing(4, 1, 1),
      flex: '1',
      minWidth: '0px',
    },
    externalLinkIcon: {
      fontSize: 'inherit',
      verticalAlign: 'middle',
    },
    bottomline: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: '-5px',
    },
    pagination: {
      width: '100%',
    },
  }),
);

type WorkflowRunsCardViewProps = {
  runs?: WorkflowRun[];
  searchTerm: string;
  loading: boolean;
  onChangePageSize: (pageSize: number) => void;
  onChangePage: (page: number) => void;
  page: number;
  total: number;
  pageSize: number;
  projectName: string;
};

const statusColors: Record<string, string> = {
  skipped: 'warning',
  canceled: 'info',
  timed_out: 'error',
  failure: 'error',
  success: 'success',
};

const matchesSearchTerm = (run: WorkflowRun, searchTerm: string) => {
  const lowerCaseSearchTerm = searchTerm.toLocaleLowerCase();
  return (
    run.workflowName?.toLocaleLowerCase().includes(lowerCaseSearchTerm) ||
    run.source.branchName?.toLocaleLowerCase().includes(lowerCaseSearchTerm) ||
    run.status?.toLocaleLowerCase().includes(lowerCaseSearchTerm) ||
    run.id?.toLocaleLowerCase().includes(lowerCaseSearchTerm)
  );
};

export const WorkflowRunsCardView = ({
  runs,
  searchTerm,
  loading,
  onChangePageSize,
  onChangePage,
  page,
  total,
  pageSize,
}: WorkflowRunsCardViewProps) => {
  const classes = useStyles();
  const routeLink = useRouteRef(buildRouteRef);

  const filteredRuns = runs?.filter(run => matchesSearchTerm(run, searchTerm));

  return (
    <Grid container spacing={3}>
      {filteredRuns && runs?.length !== 0 ? (
        filteredRuns.map(run => (
          <Grid key={run.id} item container xs={12} sm={4} md={4} xl={4}>
            <Box className={classes.card}>
              <Box
                display="flex"
                flexDirection="column"
                m={3}
                alignItems="center"
                justifyContent="center"
              >
                <Box pt={2} sx={{ width: '100%' }} textAlign="center">
                  <Tooltip
                    title={run.status ?? 'No Status'}
                    placement="top-start"
                  >
                    <Alert
                      variant="outlined"
                      severity={
                        statusColors[
                          run.conclusion as keyof typeof statusColors
                        ] as Color
                      }
                      style={{ alignItems: 'center' }}
                    >
                      <Typography variant="h6">
                        <Link to={routeLink({ id: run.id })}>
                          <Typography color="primary" variant="h6">
                            {run.workflowName}
                          </Typography>
                        </Link>
                      </Typography>
                    </Alert>
                  </Tooltip>
                  <Tooltip title={run.message ?? 'No run message'}>
                    <Typography
                      variant="body2"
                      component="span"
                      style={{ fontSize: 'smaller' }}
                    >
                      <MarkdownContent
                        content={`Commit ID : ${run.source.commit.hash!}`}
                      />
                    </Typography>
                  </Tooltip>

                  {run.source.branchName && (
                    <MarkdownContent
                      content={`Branch : ${run.source.branchName}`}
                    />
                  )}
                  <Chip
                    key={run.id}
                    size="small"
                    label={`Workflow ID : ${run.id}`}
                  />
                  <Chip
                    size="small"
                    label={
                      <Box display="flex" alignItems="center">
                        <WorkflowRunStatus
                          status={run.status}
                          conclusion={run.conclusion}
                        />
                      </Box>
                    }
                  />
                  <div className={classes.bottomline}>
                    {run.githubUrl && (
                      <Link to={run.githubUrl}>
                        Workflow runs on GitHub{' '}
                        <ExternalLinkIcon
                          className={classes.externalLinkIcon}
                        />
                      </Link>
                    )}
                    <ButtonGroup>
                      <Tooltip title="Rerun workflow">
                        <IconButton
                          onClick={run.onReRunClick}
                          style={{ fontSize: '12px' }}
                        >
                          <RetryIcon />
                        </IconButton>
                      </Tooltip>
                    </ButtonGroup>
                  </div>
                </Box>
              </Box>
            </Box>
          </Grid>
        ))
      ) : (
        <Box p={2}>
          {loading ? <CircularProgress /> : 'No matching runs found.'}
        </Box>
      )}
      <div className={classes.pagination}>
        <TablePagination
          component="div"
          count={total}
          page={page}
          rowsPerPage={pageSize}
          onPageChange={(_, newPage) => onChangePage(newPage)}
          onRowsPerPageChange={event =>
            onChangePageSize(parseInt(event.target.value, 6))
          }
          labelRowsPerPage="Workflows per page"
          rowsPerPageOptions={[6, 12, 18, { label: 'All', value: -1 }]}
        />
      </div>
    </Grid>
  );
};

type WorkflowRunsCardProps = {
  entity: Entity;
};

const WorkflowRunsCardSearch = ({
  searchTerm,
  handleSearch,
  retry,
}: {
  searchTerm: string;
  handleSearch: (event: ChangeEvent<HTMLInputElement>) => void;
  retry: () => void;
}) => {
  return (
    <>
      <Box flexGrow={1} />
      <TextField
        type="search"
        label="Search"
        value={searchTerm}
        onChange={handleSearch}
        data-testid="search-control"
        style={{ marginRight: '20px' }}
      />
      <ButtonGroup>
        <Tooltip title="Reload workflow runs">
          <IconButton onClick={retry}>
            <SyncIcon />
          </IconButton>
        </Tooltip>
      </ButtonGroup>
    </>
  );
};

export const WorkflowRunsCard = ({ entity }: WorkflowRunsCardProps) => {
  const projectName = getProjectNameFromEntity(entity);
  const hostname = getHostnameFromEntity(entity);
  const [owner, repo] = (projectName ?? '/').split('/');
  const [branch, setBranch] = useState<string | undefined>('default');
  const [runs, setRuns] = useState<WorkflowRun[] | undefined>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const [
    { runs: runsData, branches, defaultBranch, ...cardProps },
    { retry, setPage, setPageSize },
  ] = useWorkflowRuns({
    hostname,
    owner,
    repo,
    branch: branch === 'all' ? undefined : branch,
  });

  const githubHost = hostname || 'github.com';
  const hasNoRuns = !cardProps.loading && !runsData;

  const handleMenuChange = (
    event: ChangeEvent<{ name?: string; value: unknown }>,
  ) => {
    const selectedValue = event.target.value as string;
    setBranch(selectedValue);
    setPage(0);
    retry();
  };

  useEffect(() => {
    setRuns(runsData);
  }, [runsData, branch]);

  useEffect(() => {
    setBranch(defaultBranch);
  }, [defaultBranch]);

  return (
    <Grid item>
      {hasNoRuns ? (
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
      ) : (
        <InfoCard
          title={
            <Box display="flex" alignItems="center">
              <GitHubIcon />
              <Box mr={1} />
              <Typography variant="h6">{projectName}</Typography>

              <Select
                value={branch}
                key={branch}
                label="Branch"
                onChange={handleMenuChange}
                data-testid="menu-control"
                style={{
                  marginLeft: '30px',
                  marginRight: '20px',
                  width: '230px',
                }}
              >
                {branches.map(branchItem => (
                  <MenuItem key={branchItem.name} value={branchItem.name}>
                    {branchItem.name === defaultBranch ? (
                      <Typography variant="body2" component="span">
                        {branchItem.name}{' '}
                        <Typography
                          variant="body2"
                          component="span"
                          style={{ color: 'lightgray', fontSize: 'x-small' }}
                        >
                          (default)
                        </Typography>
                      </Typography>
                    ) : (
                      branchItem.name
                    )}
                  </MenuItem>
                ))}

                <MenuItem
                  value="all"
                  key="all"
                  style={{ color: 'lightGrey', fontSize: 'small' }}
                >
                  select all branches
                </MenuItem>
              </Select>

              <WorkflowRunsCardSearch
                searchTerm={searchTerm}
                handleSearch={handleSearch}
                retry={retry}
              />
            </Box>
          }
        >
          <WorkflowRunsCardView
            runs={runs}
            loading={cardProps.loading}
            onChangePageSize={setPageSize}
            onChangePage={setPage}
            page={cardProps.page}
            total={cardProps.total}
            pageSize={cardProps.pageSize}
            searchTerm={searchTerm}
            projectName={projectName}
          />
        </InfoCard>
      )}
    </Grid>
  );
};

export default WorkflowRunsCard;
