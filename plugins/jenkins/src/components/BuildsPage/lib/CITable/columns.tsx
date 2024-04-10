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
import { Link, Progress, TableColumn } from '@backstage/core-components';
import { alertApiRef, useApi, useRouteRef } from '@backstage/core-plugin-api';
import { useEntityPermission } from '@backstage/plugin-catalog-react/alpha';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import RetryIcon from '@material-ui/icons/Replay';
import VisibilityIcon from '@material-ui/icons/Visibility';
import HistoryIcon from '@material-ui/icons/History';
import { default as React, useState } from 'react';
import { Project } from '../../../../api/JenkinsApi';
import { buildRouteRef, jobRunsRouteRef } from '../../../../plugin';
import { JenkinsRunStatus } from '../Status';
import { jenkinsExecutePermission } from '@backstage/plugin-jenkins-common';

const FailCount = ({ count }: { count: number }): JSX.Element | null => {
  if (count !== 0) {
    return <>{count} failed</>;
  }
  return null;
};

const SkippedCount = ({ count }: { count: number }): JSX.Element | null => {
  if (count !== 0) {
    return <>{count} skipped</>;
  }
  return null;
};

const FailSkippedWidget = ({
  skipped,
  failed,
}: {
  skipped: number;
  failed: number;
}): JSX.Element | null => {
  if (skipped === 0 && failed === 0) {
    return null;
  }

  if (skipped !== 0 && failed !== 0) {
    return (
      <>
        {' '}
        (<FailCount count={failed} />, <SkippedCount count={skipped} />)
      </>
    );
  }

  if (failed !== 0) {
    return (
      <>
        {' '}
        (<FailCount count={failed} />)
      </>
    );
  }

  if (skipped !== 0) {
    return (
      <>
        {' '}
        (<SkippedCount count={skipped} />)
      </>
    );
  }

  return null;
};

export const columnFactories = Object.freeze({
  createTimestampColumn(): TableColumn<Project> {
    return {
      title: 'Timestamp',
      defaultSort: 'desc',
      hidden: true,
      field: 'lastBuild.timestamp',
    };
  },

  createBuildColumn(): TableColumn<Project> {
    return {
      title: 'Build',
      field: 'fullName',
      highlight: true,
      render: (row: Partial<Project>) => {
        const LinkWrapper = () => {
          const routeLink = useRouteRef(buildRouteRef);
          if (!row.fullName || !row.lastBuild?.number) {
            return (
              <>
                {row.fullName ||
                  row.fullDisplayName ||
                  row.displayName ||
                  'Unknown'}
              </>
            );
          }

          return (
            <Link
              to={routeLink({
                jobFullName: encodeURIComponent(row.fullName),
                buildNumber: String(row.lastBuild?.number),
              })}
            >
              {row.fullDisplayName}
            </Link>
          );
        };

        return <LinkWrapper />;
      },
    };
  },

  createSourceColumn(): TableColumn<Project> {
    return {
      title: 'Source',
      field: 'lastBuild.source.branchName',
      render: (row: Partial<Project>) => (
        <>
          <Typography paragraph>
            <Link to={row.lastBuild?.source?.url ?? ''}>
              {row.lastBuild?.source?.branchName}
            </Link>
          </Typography>
          <Typography paragraph>
            {row.lastBuild?.source?.commit?.hash}
          </Typography>
        </>
      ),
    };
  },

  createStatusColumn(): TableColumn<Project> {
    return {
      title: 'Status',
      field: 'status',
      render: (row: Partial<Project>) => {
        return (
          <Box display="flex" alignItems="center">
            <JenkinsRunStatus status={row.status} />
          </Box>
        );
      },
    };
  },

  createTestColumn(): TableColumn<Project> {
    return {
      title: 'Tests',
      sorting: false,
      render: (row: Partial<Project>) => {
        return (
          <>
            <Typography paragraph>
              {row.lastBuild?.tests && (
                <Link to={row.lastBuild?.tests.testUrl ?? ''}>
                  {row.lastBuild?.tests.passed} / {row.lastBuild?.tests.total}{' '}
                  passed
                  <FailSkippedWidget
                    skipped={row.lastBuild?.tests.skipped}
                    failed={row.lastBuild?.tests.failed}
                  />
                </Link>
              )}

              {!row.lastBuild?.tests && 'n/a'}
            </Typography>
          </>
        );
      },
    };
  },

  createLastRunDuration(): TableColumn<Project> {
    return {
      title: 'Last Run Duration',
      align: 'left',
      render: (row: Partial<Project>) => (
        <>
          <Typography>
            {row?.lastBuild?.duration
              ? (row?.lastBuild?.duration / 1000)
                  .toFixed(1)
                  .toString()
                  .concat(' s')
              : ''}{' '}
          </Typography>
        </>
      ),
    };
  },

  createActionsColumn(): TableColumn<Project> {
    return {
      title: 'Actions',
      sorting: false,
      render: (row: Partial<Project>) => {
        const ActionWrapper = () => {
          const [isLoadingRebuild, setIsLoadingRebuild] = useState(false);
          const { allowed, loading } = useEntityPermission(
            jenkinsExecutePermission,
          );

          const alertApi = useApi(alertApiRef);
          const jobRunsLink = useRouteRef(jobRunsRouteRef);

          const onRebuild = async () => {
            if (row.onRestartClick) {
              setIsLoadingRebuild(true);
              try {
                await row.onRestartClick();
                alertApi.post({
                  message: 'Jenkins re-build has successfully executed',
                  severity: 'success',
                  display: 'transient',
                });
              } catch (e) {
                alertApi.post({
                  message: `Jenkins re-build has failed. Error: ${e.message}`,
                  severity: 'error',
                });
              } finally {
                setIsLoadingRebuild(false);
              }
            }
          };

          return (
            <div style={{ width: '148px' }}>
              {row.lastBuild?.url && (
                <Tooltip title="View build">
                  <IconButton href={row.lastBuild.url} target="_blank">
                    <VisibilityIcon />
                  </IconButton>
                </Tooltip>
              )}
              {isLoadingRebuild && <Progress />}
              {!isLoadingRebuild && (
                <Tooltip title="Rerun build">
                  <IconButton
                    onClick={onRebuild}
                    disabled={loading || !allowed}
                  >
                    <RetryIcon />
                  </IconButton>
                </Tooltip>
              )}
              <Link
                to={jobRunsLink({
                  jobFullName: encodeURIComponent(row.fullName || ''),
                })}
              >
                <Tooltip title="View Runs">
                  <IconButton>
                    <HistoryIcon />
                  </IconButton>
                </Tooltip>
              </Link>
            </div>
          );
        };
        return <ActionWrapper />;
      },
      width: '10%',
    };
  },
});
