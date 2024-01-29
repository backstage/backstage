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
import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  ChartOptions,
  ArcElement,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { configApiRef, useApi } from '@backstage/core-plugin-api';
import { getRandomColor } from '../utils';
import CircularProgress from '@mui/material/CircularProgress';

ChartJS.register(Title, Tooltip, ArcElement);

type GroupDivisionPieChartResponse = {
  stats: {
    percentage: string;
    team: string;
  }[];
};

export function GroupDivisionPieChart(): React.ReactElement {
  const configApi = useApi(configApiRef);

  const [data, setData] = useState<GroupDivisionPieChartResponse | null>(null);

  useEffect(() => {
    fetch(
      `${configApi.getString('backend.baseUrl')}/api/time-saver/getStats/group`,
    )
      .then(response => response.json())
      .then(dt => setData(dt))
      .catch();
  }, [configApi]);

  if (!data) {
    return <CircularProgress />;
  }

  const options: ChartOptions<'pie'> = {
    plugins: {
      title: {
        display: true,
        text: 'Team Percentage Distribution',
      },
    },
    responsive: true,
  };

  const labels = data.stats.map(stat => stat.team);
  const percentages = data.stats.map(stat => parseFloat(stat.percentage));

  const backgroundColors = Array.from({ length: labels.length }, () =>
    getRandomColor(),
  );

  const dataAll = {
    labels,
    datasets: [
      {
        data: percentages,
        backgroundColor: backgroundColors,
        hoverBackgroundColor: backgroundColors,
      },
    ],
  };

  return <Pie options={options} data={dataAll} />;
}
