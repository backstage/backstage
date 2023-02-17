/*
 * Copyright 2023 The Backstage Authors
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
import {
  Progress,
  ResponseErrorPanel,
  Table,
  TableColumn,
} from '@backstage/core-components';
import useAsync from 'react-use/lib/useAsync';
import { useApi } from '@backstage/core-plugin-api';
import { Pack, stackstormApiRef } from '../../api';

type DenseTableProps = {
  packs: Pack[];
};

export const DenseTable = ({ packs }: DenseTableProps) => {
  const columns: TableColumn[] = [
    { title: 'Name', field: 'ref' },
    { title: 'Description', field: 'description' },
    { title: 'Version', field: 'version' },
  ];

  return (
    <Table
      title="Packs"
      options={{ search: true, paging: false }}
      columns={columns}
      data={packs}
    />
  );
};

export const PacksTable = () => {
  const st2 = useApi(stackstormApiRef);

  const { value, loading, error } = useAsync(async (): Promise<Pack[]> => {
    const data = await st2.getPacks();
    return data;
  }, []);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <ResponseErrorPanel error={error} />;
  }

  return <DenseTable packs={value || []} />;
};
