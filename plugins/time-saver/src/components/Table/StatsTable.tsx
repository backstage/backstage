/*
 * Copyright 2024 The Backstage Authors
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
import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import { configApiRef, useApi } from '@backstage/core-plugin-api';
import { DataGrid, GridColDef, GridSortModel } from '@mui/x-data-grid';

type Stat = {
  id: string;
  sum: number;
  team: string;
  template_name: string;
  [key: string]: string | number;
};

type AllStatsChartResponse = {
  stats: Stat[];
};

interface StatsTableProps {
  team?: string;
  template_name?: string;
}

const StatsTable: React.FC<StatsTableProps> = ({ team, template_name }) => {
  const [data, setData] = useState<Stat[] | null>(null);
  const [sortModel, setSortModel] = useState<GridSortModel>([
    { field: 'sum', sort: 'asc' },
  ]);

  const configApi = useApi(configApiRef);

  useEffect(() => {
    let url = `${configApi.getString(
      'backend.baseUrl',
    )}/api/time-saver/getStats`;
    if (team) {
      url = `${url}?team=${team}`;
    } else if (template_name) {
      url = `${url}?templateName=${template_name}`;
    }

    fetch(url)
      .then(response => response.json())
      .then((dt: AllStatsChartResponse) => {
        const statsWithIds = dt.stats.map((stat, index) => ({
          ...stat,
          id: index.toString(),
        }));
        setData(statsWithIds);
        setSortModel([{ field: 'sum', sort: 'desc' }]);
      })
      .catch();
  }, [configApi, team, template_name]);

  if (!data) {
    return <CircularProgress />;
  }

  const columns: GridColDef[] = [
    { field: 'team', headerName: 'Team', flex: 1, sortable: true },
    {
      field: 'template_name',
      headerName: 'Template Name',
      flex: 1,
      sortable: true,
    },
    { field: 'sum', headerName: 'Sum', flex: 1, sortable: true },
  ].filter(col => data.some(row => !!row[col.field]));

  return (
    <Paper
      style={{ height: 400, width: '100%', margin: '16px', padding: '16px' }}
    >
      <DataGrid
        rows={data}
        columns={columns}
        sortModel={sortModel}
        onSortModelChange={model => setSortModel(model)}
      />
    </Paper>
  );
};

export default StatsTable;
