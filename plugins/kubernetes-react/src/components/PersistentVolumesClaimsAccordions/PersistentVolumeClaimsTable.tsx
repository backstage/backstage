/*
 * Copyright 2021 The Backstage Authors
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

import { ReactNode } from 'react';
import { PersistentVolumeClaimsDrawer } from './PersistentVolumeClaimsDrawer';
import { Table, TableColumn } from '@backstage/core-components';
import type { V1PersistentVolumeClaim } from '@kubernetes/client-node';
import {
  StatusError,
  StatusOK,
  StatusPending,
} from '@backstage/core-components';

export type PersistentVolumeClaimsTableProps = {
  persistentVolumeClaims: V1PersistentVolumeClaim[];
  children?: ReactNode;
};

const PersistentVolumeClaimDrawerTrigger = ({
  persistentVolumeClaim,
}: {
  persistentVolumeClaim: V1PersistentVolumeClaim;
}) => {
  return (
    <PersistentVolumeClaimsDrawer
      persistentVolumeClaim={persistentVolumeClaim}
    />
  );
};

const renderPhaseStatus = (persistentVolumeClaim: V1PersistentVolumeClaim) => {
  const phase = persistentVolumeClaim.status?.phase;

  if (phase === 'Bound') {
    return <StatusOK>Bound</StatusOK>;
  }
  if (phase === 'Pending') {
    return <StatusPending>Pending</StatusPending>;
  }
  if (phase === 'Lost') {
    return <StatusError>Lost</StatusError>;
  }
  return <>{phase ?? 'Unknown'}</>;
};

export const PersistentVolumeClaimsTable = ({
  persistentVolumeClaims,
}: PersistentVolumeClaimsTableProps) => {
  const defaultColumns: TableColumn<V1PersistentVolumeClaim>[] = [
    {
      title: 'ID',
      field: 'metadata.uid',
      hidden: true,
    },
    {
      title: 'name',
      highlight: true,
      render: (persistentVolumeClaim: V1PersistentVolumeClaim) => {
        return (
          <PersistentVolumeClaimDrawerTrigger
            persistentVolumeClaim={persistentVolumeClaim}
          />
        );
      },
      cellStyle: {
        width: '25%',
      },
    },
    {
      title: 'phase',
      render: renderPhaseStatus,
      cellStyle: {
        width: '10%',
      },
    },
    {
      title: 'status',
      render: (persistentVolumeClaim: V1PersistentVolumeClaim) =>
        persistentVolumeClaim.status?.phase ?? 'Unknown',
      cellStyle: {
        width: '10%',
      },
    },
    {
      title: 'capacity',
      render: (persistentVolumeClaim: V1PersistentVolumeClaim) =>
        persistentVolumeClaim.status?.capacity?.storage ?? 'N/A',
      cellStyle: {
        width: '10%',
      },
    },
    {
      title: 'volume',
      render: (persistentVolumeClaim: V1PersistentVolumeClaim) =>
        persistentVolumeClaim.spec?.volumeName ?? 'N/A',
      cellStyle: {
        width: '45%',
      },
    },
  ];

  const columns: TableColumn<V1PersistentVolumeClaim>[] = [...defaultColumns];

  const tableStyle = {
    minWidth: '0',
    width: '100%',
  };

  return (
    <div style={tableStyle}>
      <Table
        options={{ paging: true, search: false, emptyRowsWhenPaging: false }}
        data={
          persistentVolumeClaims.map((pvc: V1PersistentVolumeClaim) => ({
            ...pvc,
            id: pvc?.metadata?.uid,
          })) as any as V1PersistentVolumeClaim[]
        }
        columns={columns}
      />
    </div>
  );
};
