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
import React from 'react';
import { Table, TableColumn } from '@backstage/core-components';
import { EntityLink } from '../EntityLink';
import { Problem, ProblemsTableProps } from '../types';
import { ProblemStatus } from '../ProblemStatus';
import { Box } from '@material-ui/core';

export const ProblemsTable = ({ problems }: ProblemsTableProps) => {
  const columns: TableColumn[] = [
    { title: 'Title', field: 'title' },
    {
      title: 'Status',
      field: 'status',
      render: (row: Partial<Problem | undefined>) => (
        <Box display="flex" alignItems="center">
          <ProblemStatus status={row?.status} />
        </Box>
      ),
    },
    { title: 'Severity', field: 'severityLevel' },
    {
      title: 'Root Cause',
      field: 'rootCauseEntity',
      render: (row: Partial<Problem | undefined>) => (
        <Box display="flex" alignItems="center">
          <EntityLink name={row?.rootCauseEntity?.name} />
        </Box>
      ),
    },
    {
      title: 'Affected',
      field: 'affectedEntities',
      render: (row: Partial<Problem | undefined>) => (
        <Box display="flex" alignItems="center">
          <>
            {row?.affectedEntities?.map(e => {
              return <EntityLink key={e.name} name={e.name} />;
            })}
          </>
        </Box>
      ),
    },
    { title: 'Start Time', field: 'startTime' },
    { title: 'End Time', field: 'endTime' },
  ];

  return (
    <Table
      title="Problems"
      options={{ search: true, paging: true }}
      columns={columns}
      data={problems.map(p => {
        return { ...p, id: p.problemId };
      })}
    />
  );
};
