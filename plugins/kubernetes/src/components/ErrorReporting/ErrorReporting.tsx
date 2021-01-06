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
import { Table, TableColumn, InfoCard } from '@backstage/core';
import { DetectedError, DetectedErrorsByCluster } from '../../types/types';
import { Chip, Typography } from '@material-ui/core';

type ErrorReportingProps = {
  detectedErrors: DetectedErrorsByCluster;
};

const columns: TableColumn<DetectedError>[] = [
  {
    title: 'cluster',
    width: '15%',
    render: (detectedError: DetectedError) => detectedError.cluster,
  },
  {
    title: 'kind',
    width: '15%',
    render: (detectedError: DetectedError) => detectedError.kind,
  },
  {
    title: 'name',
    width: '30%',
    render: (detectedError: DetectedError) => {
      const errorCount = detectedError.names.length;

      if (errorCount === 0) {
        // This shouldn't happen
        return null;
      }

      const displayName = detectedError.names[0];

      const otherErrorCount = errorCount - 1;

      return (
        <>
          {displayName}{' '}
          {otherErrorCount > 0 && (
            <Chip
              label={`+ ${otherErrorCount} other${
                otherErrorCount > 1 ? 's' : ''
              }`}
              size="small"
            />
          )}
        </>
      );
    },
  },
  {
    title: 'messages',
    width: '40%',
    render: (detectedError: DetectedError) => (
      <>
        {detectedError.message.map((m, i) => (
          <div key={i}>{m}</div>
        ))}
      </>
    ),
  },
];

const sortBySeverity = (a: DetectedError, b: DetectedError) => {
  if (a.severity < b.severity) {
    return 1;
  } else if (b.severity < a.severity) {
    return -1;
  }
  return 0;
};

export const ErrorReporting = ({ detectedErrors }: ErrorReportingProps) => {
  const errors = Array.from(detectedErrors.values())
    .flat()
    .sort(sortBySeverity);

  return (
    <>
      {errors.length === 0 ? (
        <InfoCard title="Error Reporting">
          <div>
            <Typography variant="h6">
              Nice! There are no errors to report!
            </Typography>
            {/*  TODO the tick goes here */}
          </div>
        </InfoCard>
      ) : (
        <Table
          title="Error Reporting"
          data={errors}
          columns={columns}
          options={{ paging: true, search: false }}
        />
      )}
    </>
  );
};
