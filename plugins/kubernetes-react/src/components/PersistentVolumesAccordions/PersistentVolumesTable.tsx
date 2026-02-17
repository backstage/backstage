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
import { PersistentVolumesDrawer } from './PersistentVolumesDrawer';
import { Table, TableColumn } from '@backstage/core-components';
import type { V1PersistentVolume } from '@kubernetes/client-node';
import {
  StatusError,
  StatusOK,
  StatusPending,
} from '@backstage/core-components';
import { getPersistentVolumeType } from '../../utils/persistentVolumes';

export type PersistentVolumesTableProps = {
  persistentVolumes: V1PersistentVolume[];
  children?: ReactNode;
};

const PersistentVolumeDrawerTrigger = ({
  persistentVolume,
}: {
  persistentVolume: V1PersistentVolume;
}) => {
  return <PersistentVolumesDrawer persistentVolume={persistentVolume} />;
};

const renderPhaseStatus = (persistentVolume: V1PersistentVolume) => {
  const phase = persistentVolume.status?.phase;

  if (phase === 'Bound') {
    return <StatusOK>Bound</StatusOK>;
  }
  if (phase === 'Available') {
    return <StatusPending>Available</StatusPending>;
  }
  if (phase === 'Released') {
    return <StatusPending>Released</StatusPending>;
  }
  if (phase === 'Pending') {
    return <StatusPending>Pending</StatusPending>;
  }
  if (phase === 'Failed') {
    return <StatusError>Failed</StatusError>;
  }
  return <>{phase ?? 'Unknown'}</>;
};

export const PersistentVolumesTable = ({
  persistentVolumes,
}: PersistentVolumesTableProps) => {
  const defaultColumns: TableColumn<V1PersistentVolume>[] = [
    {
      title: 'ID',
      field: 'metadata.uid',
      hidden: true,
    },
    {
      title: 'name',
      highlight: true,
      render: (persistentVolume: V1PersistentVolume) => {
        return (
          <PersistentVolumeDrawerTrigger persistentVolume={persistentVolume} />
        );
      },
      cellStyle: {
        width: '20%',
      },
    },
    {
      title: 'phase',
      render: renderPhaseStatus,
      cellStyle: {
        width: '9%',
      },
    },
    {
      title: 'status',
      render: (persistentVolume: V1PersistentVolume) =>
        persistentVolume.status?.phase ?? 'Unknown',
      cellStyle: {
        width: '9%',
      },
    },
    {
      title: 'capacity',
      render: (persistentVolume: V1PersistentVolume) =>
        persistentVolume.spec?.capacity?.storage ?? 'N/A',
      cellStyle: {
        width: '10%',
      },
    },
    {
      title: 'type',
      render: (persistentVolume: V1PersistentVolume) => {
        const driver = persistentVolume.spec?.csi?.driver;
        return getPersistentVolumeType(driver) ?? 'N/A';
      },
      cellStyle: {
        width: '15%',
      },
    },
    {
      title: 'claim',
      render: (persistentVolume: V1PersistentVolume) => {
        const claim = persistentVolume.spec?.claimRef;
        if (claim?.namespace && claim?.name) {
          return `${claim.namespace}/${claim.name}`;
        }
        return 'N/A';
      },
      cellStyle: {
        width: '37%',
      },
    },
  ];

  const columns: TableColumn<V1PersistentVolume>[] = [...defaultColumns];

  const tableStyle = {
    minWidth: '0',
    width: '100%',
  };

  return (
    <div style={tableStyle}>
      <Table
        options={{ paging: true, search: false, emptyRowsWhenPaging: false }}
        data={
          persistentVolumes.map((pv: V1PersistentVolume) => ({
            ...pv,
            id: pv?.metadata?.uid,
          })) as any as V1PersistentVolume[]
        }
        columns={columns}
      />
    </div>
  );
};
