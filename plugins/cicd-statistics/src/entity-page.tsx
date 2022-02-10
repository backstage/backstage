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

import React, { useCallback, useState, useMemo, useEffect } from 'react';
import { Grid, makeStyles, Theme } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { useEntity } from '@backstage/plugin-catalog-react';
import { useApi, errorApiRef } from '@backstage/core-plugin-api';
import { DateTime } from 'luxon';

import {
  useCicdStatistics,
  UseCicdStatisticsOptions,
} from './hooks/use-cicd-statistics';
import { useCicdConfiguration } from './hooks/use-cicd-configuration';
import { buildsToChartableStages } from './charts/logic/conversions';
import { ZoomProvider, useZoom } from './charts/zoom';
import { StageChart } from './charts/stage-chart';
import { StatusChart } from './charts/status-chart';
import {
  ChartFilter,
  ChartFilters,
  getDefaultChartFilter,
  getDefaultViewOptions,
  ViewOptions,
} from './components/chart-filters';
import {
  CicdConfiguration,
  FilterStatusType,
  FilterBranchType,
} from './apis/types';
import { cleanupBuildTree } from './utils/stage-names';
import { renderFallbacks, useAsyncChain } from './components/progress';
import { sortFilterStatusType } from './utils/api';

export function EntityPageCicdCharts() {
  const state = useCicdConfiguration();

  return renderFallbacks(state, value => (
    <ZoomProvider>
      <CicdCharts cicdConfiguration={value} />
    </ZoomProvider>
  ));
}

const useStyles = makeStyles<Theme>(
  theme => ({
    pane: {
      padding: theme.spacing(1, 1, 1, 1),
    },
  }),
  {
    name: 'CicdStatisticsView',
  },
);

function startOfDay(date: Date) {
  return DateTime.fromJSDate(date).startOf('day').toJSDate();
}
function endOfDay(date: Date) {
  return DateTime.fromJSDate(date).endOf('day').toJSDate();
}
function cleanChartFilter(filter: ChartFilter): ChartFilter {
  return {
    ...filter,
    status: sortFilterStatusType(filter.status as FilterStatusType[]),
  };
}

interface CicdChartsProps {
  cicdConfiguration: CicdConfiguration;
}

function CicdCharts(props: CicdChartsProps) {
  const { cicdConfiguration } = props;

  const errorApi = useApi(errorApiRef);
  const { entity } = useEntity();

  const classes = useStyles();

  const { resetZoom } = useZoom();

  const [chartFilter, setChartFilter] = useState(
    getDefaultChartFilter(cicdConfiguration),
  );
  const [fetchedChartData, setFetchedChartData] = useState({
    abortController: null as null | AbortController,
    chartFilter,
  });

  const [viewOptions, setViewOptions] = useState(
    getDefaultViewOptions(cicdConfiguration),
  );

  const fetchStatisticsOptions = useMemo((): UseCicdStatisticsOptions => {
    const abortController = new AbortController();
    fetchedChartData.abortController = abortController;
    return {
      abortController,
      entity,
      timeFrom: startOfDay(fetchedChartData.chartFilter.fromDate),
      timeTo: endOfDay(fetchedChartData.chartFilter.toDate),
      filterStatus: fetchedChartData.chartFilter.status as FilterStatusType[],
      filterType: fetchedChartData.chartFilter.branch as FilterBranchType,
    };
  }, [entity, fetchedChartData]);

  const statisticsState = useCicdStatistics(fetchStatisticsOptions);

  const updateFilter = useCallback(() => {
    // Abort previous fetch
    fetchedChartData.abortController?.abort();

    setFetchedChartData({ abortController: null, chartFilter });
  }, [fetchedChartData, setFetchedChartData, chartFilter]);

  const chartableStagesState = useAsyncChain(
    statisticsState,
    async value =>
      buildsToChartableStages(
        await cleanupBuildTree(value.builds, {
          formatStageName: cicdConfiguration.formatStageName,
          lowerCase: viewOptions.lowercaseNames,
        }),
        { normalizeTimeRange: viewOptions.normalizeTimeRange },
      ),
    [statisticsState, cicdConfiguration, viewOptions],
  );

  useEffect(() => {
    resetZoom();
  }, [resetZoom, statisticsState.value]);

  const onFilterChange = useCallback((filter: ChartFilter) => {
    setChartFilter(cleanChartFilter(filter));
  }, []);

  const onViewOptionsChange = useCallback(
    (options: ViewOptions) => {
      setViewOptions(options);
    },
    [setViewOptions],
  );

  useEffect(() => {
    if (
      !chartableStagesState.error ||
      chartableStagesState.error?.name === 'AbortError'
    ) {
      return;
    }
    errorApi.post(chartableStagesState.error);
  }, [errorApi, chartableStagesState.error]);

  return (
    <Grid container>
      <Grid item lg={2} className={classes.pane}>
        <ChartFilters
          analysis={chartableStagesState.value}
          cicdConfiguration={cicdConfiguration}
          initialFetchFilter={chartFilter}
          currentFetchFilter={fetchedChartData.chartFilter}
          onChangeFetchFilter={onFilterChange}
          updateFetchFilter={updateFilter}
          initialViewOptions={viewOptions}
          onChangeViewOptions={onViewOptionsChange}
        />
      </Grid>
      <Grid item xs={12} lg={10} className={classes.pane}>
        {renderFallbacks(chartableStagesState, chartableStages => (
          <>
            {chartableStages.stages.size > 0 ? null : (
              <Alert severity="info">No data</Alert>
            )}
            {!statisticsState.value?.builds?.length ||
            !chartableStagesState.value?.daily?.values?.length ? null : (
              <StatusChart analysis={chartableStagesState.value} />
            )}
            <StageChart
              stage={chartableStages.total}
              defaultCollapsed={0}
              defaultHidden={viewOptions.hideLimit}
              chartTypes={viewOptions.chartTypes}
            />
            {[...chartableStages.stages.entries()].map(([name, stage]) => (
              <StageChart
                key={name}
                stage={stage}
                defaultCollapsed={viewOptions.collapsedLimit}
                defaultHidden={viewOptions.hideLimit}
                chartTypes={viewOptions.chartTypes}
              />
            ))}
          </>
        ))}
      </Grid>
    </Grid>
  );
}
