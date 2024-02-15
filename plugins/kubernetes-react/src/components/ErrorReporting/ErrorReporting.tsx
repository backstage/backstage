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
import * as React from 'react';
import {
  ClusterAttributes,
  DetectedError,
  DetectedErrorsByCluster,
} from '@backstage/plugin-kubernetes-common';
import { Table, TableColumn } from '@backstage/core-components';

/**
 *
 *
 * @public
 */
export type ErrorReportingProps = {
  detectedErrors: DetectedErrorsByCluster;
  clusters: ClusterAttributes[];
};

const columns: TableColumn<Row>[] = [
  {
    title: 'cluster',
    width: '10%',
    render: (row: Row) => row.cluster.title || row.cluster.name,
  },
  {
    title: 'namespace',
    width: '10%',
    render: (row: Row) => row.error.sourceRef.namespace,
  },
  {
    title: 'kind',
    width: '10%',
    render: (row: Row) => row.error.sourceRef.kind,
  },
  {
    title: 'name',
    width: '30%',
    render: (row: Row) => {
      return <>{row.error.sourceRef.name} </>;
    },
  },
  {
    title: 'messages',
    width: '40%',
    render: (row: Row) => row.error.message,
  },
];

interface Row {
  cluster: ClusterAttributes;
  error: DetectedError;
}

const sortBySeverity = (a: Row, b: Row) => {
  if (a.error.severity < b.error.severity) {
    return 1;
  } else if (b.error.severity < a.error.severity) {
    return -1;
  }
  return 0;
};

/**
 *
 *
 * @public
 */
export const ErrorReporting = ({
  detectedErrors,
  clusters,
}: ErrorReportingProps) => {
  const errors = Array.from(detectedErrors.entries())
    .flatMap(([clusterName, resourceErrors]) => {
      return resourceErrors.map(e => ({
        cluster: clusters.find(c => c.name === clusterName)!,
        error: e,
      }));
    })
    .sort(sortBySeverity);

  return (
    <>
      {errors.length !== 0 && (
        <Table
          title="Error Reporting"
          data={errors}
          columns={columns}
          options={{ paging: true, search: false, emptyRowsWhenPaging: false }}
        />
      )}
    </>
  );
};
