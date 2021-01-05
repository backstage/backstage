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
import * as React from 'react';
import { Table, TableColumn } from '@backstage/core';
import { DetectedError } from '../../types/types';
import { Chip } from '@material-ui/core';

type ErrorReportingProps = {
  detectedErrors: DetectedError[];
};

const columns: TableColumn<DetectedError>[] = [
  {
    title: 'cluster',
    render: (detectedError: DetectedError) => detectedError.cluster,
  },
  {
    title: 'kind',
    render: (detectedError: DetectedError) => detectedError.kind,
  },
  {
    title: 'name',
    render: (detectedError: DetectedError) => (
      <>
        {detectedError.name}{' '}
        {detectedError.duplicateCount > 0 && (
          <Chip
            label={`+ ${detectedError.duplicateCount} other${
              detectedError.duplicateCount > 1 ? 's' : ''
            }`}
            size="small"
          />
        )}
      </>
    ),
  },
  {
    title: 'messages',
    render: (detectedError: DetectedError) => (
      <>
        {detectedError.message.map((m, i) => (
          <div key={i}>{m}</div>
        ))}
      </>
    ),
  },
];

export const ErrorReporting = ({ detectedErrors }: ErrorReportingProps) => {
  return (
    <Table title="Error Reporting" data={detectedErrors} columns={columns} />
  );
};
