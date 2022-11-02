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
import { DynatraceProblem } from '../../../api/DynatraceApi';
import { ProblemStatus } from '../ProblemStatus';
import { Link } from '@backstage/core-components';

type ProblemsTableProps = {
  problems: DynatraceProblem[];
  dynatraceBaseUrl: string;
};

const parseTimestamp = (timestamp: number | undefined) => {
  return timestamp ? new Date(timestamp).toLocaleString() : 'N/A';
};

export const ProblemsTable = (props: ProblemsTableProps) => {
  const { problems, dynatraceBaseUrl } = props;
  const columns: TableColumn[] = [
    {
      title: 'Title',
      field: 'title',
      render: (row: Partial<DynatraceProblem>) => (
        <Link
          to={`${dynatraceBaseUrl}/#problems/problemdetails;pid=${row.problemId}`}
        >
          {row.title}
        </Link>
      ),
    },
    {
      title: 'Status',
      field: 'status',
      render: (row: Partial<DynatraceProblem>) => (
        <ProblemStatus status={row.status} />
      ),
    },
    { title: 'Severity', field: 'severityLevel' },
    {
      title: 'Root Cause',
      field: 'rootCauseEntity',
      render: (row: Partial<DynatraceProblem>) => row.rootCauseEntity?.name,
    },
    {
      title: 'Affected',
      field: 'affectedEntities',
      render: (row: Partial<DynatraceProblem>) =>
        row.affectedEntities?.map(e => e.name),
    },
    {
      title: 'Start Time',
      field: 'startTime',
      render: (row: Partial<DynatraceProblem>) => parseTimestamp(row.startTime),
    },
    {
      title: 'End Time',
      field: 'endTime',
      render: (row: Partial<DynatraceProblem>) =>
        row.endTime === -1 ? 'ongoing' : parseTimestamp(row.endTime),
    },
  ];

  return (
    <Table
      options={{ search: true, paging: true }}
      columns={columns}
      data={problems.map(p => {
        return { ...p, id: p.problemId };
      })}
    />
  );
};
