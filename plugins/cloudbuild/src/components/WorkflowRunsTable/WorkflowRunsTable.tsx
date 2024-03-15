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
import React, { useEffect, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import RetryIcon from '@material-ui/icons/Replay';
import { useWorkflowRuns, WorkflowRun } from '../useWorkflowRuns';
import { WorkflowRunStatus } from '../WorkflowRunStatus';
import SyncIcon from '@material-ui/icons/Sync';
import { buildRouteRef } from '../../routes';
import { DateTime } from 'luxon';
import {
  Table,
  TableColumn,
  Link,
  SelectItem,
  SelectedItems,
  Select,
} from '@backstage/core-components';
import { useRouteRef } from '@backstage/core-plugin-api';
import { getCloudbuildFilter } from '../useCloudBuildFilter';
import { getLocation } from '../useLocation';
import { useProjectName } from '../useProjectName';
import GoogleIcon from '@material-ui/icons/CloudCircle';
import { Entity } from '@backstage/catalog-model';
import Grid from '@material-ui/core/Grid';

const generatedColumns: TableColumn[] = [
  {
    title: 'Status',
    width: '150px',

    render: (row: Partial<WorkflowRun>) => (
      <Box display="flex" alignItems="center">
        <WorkflowRunStatus status={row.status} />
      </Box>
    ),
  },
  {
    title: 'Build',
    field: 'id',
    type: 'numeric',
    width: '150px',
    render: (row: Partial<WorkflowRun>) => (
      <Typography variant="body2" noWrap>
        {row.id?.substring(0, 8)}
      </Typography>
    ),
  },
  {
    title: 'Source',
    field: 'source',
    highlight: true,
    width: '200px',
    render: (row: Partial<WorkflowRun>) => {
      const LinkWrapper = () => {
        const routeLink = useRouteRef(buildRouteRef);
        return (
          <Link
            data-testid="cell-source"
            to={routeLink({
              projectId: row.projectId!,
              location: row.location!,
              id: row.id!,
            })}
          >
            {row.message}
          </Link>
        );
      };

      return <LinkWrapper />;
    },
  },
  {
    title: 'Ref',
    render: (row: Partial<WorkflowRun>) => (
      <Typography variant="body2" noWrap>
        {row.substitutions?.REF_NAME}
      </Typography>
    ),
  },
  {
    title: 'Commit',
    render: (row: Partial<WorkflowRun>) => (
      <Typography variant="body2" noWrap>
        {row.substitutions?.SHORT_SHA}
      </Typography>
    ),
  },
  {
    title: 'Created',
    render: (row: Partial<WorkflowRun>) => (
      <Typography data-testid="cell-created" variant="body2" noWrap>
        {DateTime.fromISO(row.createTime ?? DateTime.now().toISO()!).toFormat(
          'dd-MM-yyyy hh:mm:ss',
        )}
      </Typography>
    ),
  },
  {
    title: 'Actions',
    render: (row: Partial<WorkflowRun>) => (
      <Tooltip title="Rerun workflow">
        <IconButton data-testid="action-rerun" onClick={row.rerun}>
          <RetryIcon />
        </IconButton>
      </Tooltip>
    ),
    width: '10%',
  },
];

type WorkflowRunsTableViewProps = {
  loading: boolean;
  retry: () => void;
  runs?: WorkflowRun[];
  projects: SelectItem[];
  setProject: (selection: SelectedItems) => void;
  project?: SelectedItems;
  page: number;
  onChangePage: (page: number) => void;
  total: number;
  pageSize: number;
  onChangePageSize: (pageSize: number) => void;
};

export const WorkflowRunsTableView = ({
  projects,
  project,
  setProject,
  loading,
  pageSize,
  page,
  retry,
  runs,
  onChangePage,
  onChangePageSize,
  total,
}: WorkflowRunsTableViewProps) => {
  return (
    <Grid container direction="column">
      <Grid item>
        <Grid item container alignItems="center" direction="row">
          <Grid item>
            <GoogleIcon />
          </Grid>
          <Grid item>
            <Typography variant="h5">GCP Cloudbuild</Typography>
          </Grid>
        </Grid>
        <Grid item>
          <Select
            label="Project"
            selected={project}
            items={projects}
            onChange={selection => {
              setProject(selection);
            }}
          />
        </Grid>
      </Grid>
      <Grid item>
        <Table
          isLoading={loading}
          options={{ paging: true, pageSize, padding: 'dense' }}
          totalCount={total}
          page={page}
          actions={[
            {
              icon: () => <SyncIcon />,
              tooltip: 'Reload workflow runs',
              isFreeAction: true,
              onClick: () => retry(),
            },
          ]}
          title="Builds"
          data={runs ?? []}
          onPageChange={onChangePage}
          onRowsPerPageChange={onChangePageSize}
          style={{ width: '100%' }}
          columns={generatedColumns}
        />
      </Grid>
    </Grid>
  );
};

type WorkflowRunsTableProps = {
  entity: Entity;
};

export const WorkflowRunsTable = ({ entity }: WorkflowRunsTableProps) => {
  const { value: projectAnnotationValue } = useProjectName(entity);
  const [projects, setProjects] = useState<SelectItem[]>([]);
  const [project, setProject] = useState<SelectedItems>();

  useEffect(() => {
    const _projects =
      projectAnnotationValue?.split(',')?.map(projectName => ({
        label: projectName.trim(),
        value: projectName.trim(),
      })) || [];
    setProjects(_projects);
    if (_projects.length > 0) {
      setProject(_projects[0].value);
    }
  }, [projectAnnotationValue]);

  let projectIndex = projects.findIndex(_project => project === _project.value);
  projectIndex = projectIndex > -1 ? projectIndex : 0;

  const location = getLocation(entity, projectIndex);
  const cloudBuildFilter = getCloudbuildFilter(entity, projectIndex);

  const [tableProps, { retry, setPage, setPageSize }] = useWorkflowRuns({
    projectId: projects?.[projectIndex]?.label,
    location,
    cloudBuildFilter,
  });

  return (
    <WorkflowRunsTableView
      {...tableProps}
      project={project}
      projects={projects}
      setProject={selection => {
        setProject(selection);
      }}
      loading={tableProps.loading}
      retry={retry}
      onChangePageSize={setPageSize}
      onChangePage={setPage}
    />
  );
};
