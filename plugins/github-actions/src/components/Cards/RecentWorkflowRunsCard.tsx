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
import { Entity } from '@backstage/catalog-model';
import { errorApiRef, useApi } from '@backstage/core-api';
import { GITHUB_ACTIONS_ANNOTATION } from '../useProjectName';
import { useWorkflowRuns } from '../useWorkflowRuns';
import React, { useEffect } from 'react';
import { Table } from '@backstage/core';
import { WorkflowRunStatus } from '../WorkflowRunStatus';
import { Card, Link, TableContainer } from '@material-ui/core';
import { generatePath, Link as RouterLink } from 'react-router-dom';

const firstLine = (message: string): string => message.split('\n')[0];

export type Props = {
  entity: Entity;
  branch?: string;
  dense?: boolean;
  limit?: number;
};

export const RecentWorkflowRunsCard = ({
  entity,
  branch,
  dense = false,
  limit = 5,
}: Props) => {
  const errorApi = useApi(errorApiRef);
  const [owner, repo] = (
    entity?.metadata.annotations?.[GITHUB_ACTIONS_ANNOTATION] ?? '/'
  ).split('/');
  const [{ runs = [], loading, error }] = useWorkflowRuns({
    owner,
    repo,
    branch,
    initialPageSize: limit,
  });
  useEffect(() => {
    if (error) {
      errorApi.post(error);
    }
  }, [error, errorApi]);

  return (
    <TableContainer component={Card}>
      <Table
        title="Recent Workflow Runs"
        subtitle={branch ? `Branch: ${branch}` : 'All Branches'}
        isLoading={loading}
        options={{
          search: false,
          paging: false,
          padding: dense ? 'dense' : 'default',
        }}
        columns={[
          {
            title: 'Commit Message',
            field: 'message',
            render: data => (
              <Link
                component={RouterLink}
                to={generatePath('./ci-cd/:id', { id: data.id! })}
              >
                {firstLine(data.message)}
              </Link>
            ),
          },
          { title: 'Branch', field: 'source.branchName' },
          { title: 'Status', field: 'status', render: WorkflowRunStatus },
        ]}
        data={runs}
      />
    </TableContainer>
  );
};
