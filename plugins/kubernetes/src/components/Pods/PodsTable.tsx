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

import React, { useMemo } from 'react';
import { V1Pod } from '@kubernetes/client-node';
import { PodDrawer } from './PodDrawer';
import { containerStatuses } from '../../utils/pod';
import { Table, TableColumn } from '@backstage/core-components';
import * as columnFactories from './columns';

type PodsTablesProps = {
  pods: V1Pod[];
  extraColumns?: TableColumn<V1Pod>[];
  podTableColumns?: TableColumn<V1Pod>[];
  children?: React.ReactNode;
};

export const PodsTable = ({
  pods,
  extraColumns = [],
  podTableColumns,
}: PodsTablesProps) => {
  const tableStyle = {
    minWidth: '0',
    width: '100%',
  };

  const defaultColumns: TableColumn<V1Pod>[] = [
    columnFactories.createNameColumn(),
    columnFactories.createPhaseColumn(),
    columnFactories.createStatusColumn(),
  ];

  return (
    <div style={tableStyle}>
      <Table
        options={{ paging: true, search: false }}
        data={pods}
        columns={podTableColumns || defaultColumns.concat(extraColumns)}
      />
    </div>
  );
};
