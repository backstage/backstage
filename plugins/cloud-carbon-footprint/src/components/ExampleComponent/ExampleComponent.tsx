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
import React, {PropsWithChildren, SyntheticEvent, useEffect, useState} from 'react';
import { Route } from 'react-router';
import { Grid, ThemeProvider } from '@material-ui/core';
import { GridRowParams } from '@material-ui/data-grid';
import {
  CardTab,
  Content,
  ContentHeader,
  Header,
  HeaderLabel,
  Page,
  SupportButton,
  TabbedCard,
  TabbedLayout,
} from '@backstage/core-components';
import EmissionsOverTimeCard from '@cloud-carbon-footprint/client/dist/pages/EmissionsMetricsPage/EmissionsOverTimeCard';
import CarbonComparisonCard from '@cloud-carbon-footprint/client/dist/pages/EmissionsMetricsPage/CarbonComparisonCard';
import EmissionsBreakdownCard from '@cloud-carbon-footprint/client/dist/pages/EmissionsMetricsPage/EmissionsBreakdownCard';
import CarbonIntensityMap from '@cloud-carbon-footprint/client/dist/pages/EmissionsMetricsPage/CarbonIntensityMap';
import EmissionsFilterBar from '@cloud-carbon-footprint/client/dist/pages/EmissionsMetricsPage/EmissionsFilterBar';
import {
  DiscoveryApi,
  discoveryApiRef,
  useApi,
} from '@backstage/core-plugin-api';

import { determineTheme } from '@cloud-carbon-footprint/client/dist/utils/themes';

// @ts-ignore
import { EstimationResult } from '@cloud-carbon-footprint/common';
import { FlatRoutes } from '../../../../../packages/core-app-api';
import { useFilterDataFromEstimates } from '@cloud-carbon-footprint/client/dist/utils/helpers';
import { EmissionsFilters } from '@cloud-carbon-footprint/client/dist/pages/EmissionsMetricsPage/EmissionsFilterBar/utils/EmissionsFilters';
import { FilterResultResponse } from '@cloud-carbon-footprint/client/dist/Types';
import useFilters from '@cloud-carbon-footprint/client/dist/common/FilterBar/utils/FilterHook';
import { useRemoteService } from '@cloud-carbon-footprint/client/dist/utils/hooks';
import moment from 'moment';
import {
  useRemoteRecommendationsService
} from "@cloud-carbon-footprint/client/dist/utils/hooks";
import {
  EmissionsAndRecommendationResults,
  RecommendationRow
} from "@cloud-carbon-footprint/client/dist/Types";
import {
  useFilterDataFromRecommendations
} from "@cloud-carbon-footprint/client/dist/utils/helpers/transformData";
import {
  RecommendationsFilters
} from "@cloud-carbon-footprint/client/dist/pages/RecommendationsPage/RecommendationsFilterBar/utils/RecommendationsFilters";
import RecommendationsFilterBar from "@cloud-carbon-footprint/client/dist/pages/RecommendationsPage/RecommendationsFilterBar";
import RecommendationsSidePanel from "@cloud-carbon-footprint/client/dist/pages/RecommendationsPage/RecommendationsSidePanel";
import RecommendationsTable from "@cloud-carbon-footprint/client/dist/pages/RecommendationsPage/RecommendationsTable";

const Wrapper = ({ children }: PropsWithChildren<{}>) => (
  <FlatRoutes>
    <Route path="/*" element={<>{children}</>} />
  </FlatRoutes>
);

const useEmissionsData = (
  baseUrl: string | undefined,
  startDate: moment.Moment,
  endDate: moment.Moment,
) => {
  // Emission Data
  const { data: emissionData } = useRemoteService(
    [],
    startDate,
    endDate,
    false,
    undefined,
    baseUrl,
  );

  // Filters for Emission Page

  const filteredDataResults: FilterResultResponse =
    useFilterDataFromEstimates(emissionData);

  const buildFilters = (filteredResponse: FilterResultResponse) => {
    const updatedConfig = EmissionsFilters.generateConfig(filteredResponse);
    return new EmissionsFilters(updatedConfig);
  };

  const { filteredData, filters, setFilters } = useFilters(
    emissionData,
    buildFilters,
    filteredDataResults,
  );
  const filteredEstimationData = filteredData as EstimationResult[];
  return {
    emissionData, filteredDataResults, filters, setFilters, filteredEstimationData
  }
}

const useRecommendationsData = (
  baseUrl: string | undefined,
  emissionData: EstimationResult[],
) => {
// Recommendation Data
  const {data: recommendationData, loading: recommendationsLoading} =
    useRemoteRecommendationsService(undefined, baseUrl)

  const combinedData: EmissionsAndRecommendationResults = {
    recommendations: recommendationData,
    emissions: emissionData.flatMap(
      (estimationResult) => estimationResult.serviceEstimates,
    ),
  }

// Filters for Recommendations Page
  const isEmissionsDataLoaded = combinedData.emissions.length > 0
  const filteredDataResults: FilterResultResponse =
    useFilterDataFromRecommendations(combinedData)

  const buildFilters = (filteredResponse: FilterResultResponse) => {
    const updatedConfig =
      RecommendationsFilters.generateConfig(filteredResponse)
    return new RecommendationsFilters(updatedConfig)
  }

  const {filteredData, filters, setFilters} = useFilters(
    combinedData,
    buildFilters,
    filteredDataResults,
    isEmissionsDataLoaded,
  )
  const {
    recommendations: filteredRecommendationData,
    emissions: filteredEmissionsData,
  } = filteredData as EmissionsAndRecommendationResults

  return {filteredDataResults, filteredRecommendationData, filteredEmissionsData, recfilters: filters, setRecFilters: setFilters }
}

export const ExampleComponent = () => {
  // const dateRangeType: string = config().DATE_RANGE.TYPE
  // const dateRangeValue: string = config().DATE_RANGE.VALUE
  const endDate: moment.Moment = moment.utc();

  const startDate: moment.Moment  = moment.utc(Date.UTC(endDate.year() - 2, 0, 1, 0, 0, 0, 0));
  // } else {
  //   startDate = moment
  //   .utc()
  //   .subtract(dateRangeValue, dateRangeType as unitOfTime.DurationConstructor)
  // }
  const [baseUrl, setUrl] = useState<string | undefined>(undefined);

  const discovery: DiscoveryApi = useApi(discoveryApiRef);
  useEffect(() => {
    discovery.getBaseUrl('cloud-carbon-footprint').then(url => setUrl(url));
  }, []);
  const [selectedRecommendation, setSelectedRecommendation] =
    useState<RecommendationRow>()
  const [useKilograms, setUseKilograms] = useState(false)
  const handleRowClick = (
    params: GridRowParams,
    _event: MuiEvent<SyntheticEvent>,
  ) => {
    if (selectedRecommendation && params.row.id === selectedRecommendation.id) {
      setSelectedRecommendation(undefined)
    } else {
      setSelectedRecommendation(params.row as RecommendationRow)
    }
  }

  const {emissionData, filteredDataResults, filters, setFilters, filteredEstimationData} = useEmissionsData(baseUrl, startDate, endDate)
  const {filteredDataResults: recFilteredDataResults, filteredRecommendationData, filteredEmissionsData, recfilters, setRecFilters } = useRecommendationsData(baseUrl, emissionData)


  return (
    <Page themeId="tool">
      <Header
        title="Welcome to cloud-carbon-footprint!"
        subtitle="Optional subtitle"
      >
        <HeaderLabel label="Owner" value="Team X" />
        <HeaderLabel label="Lifecycle" value="Alpha" />
      </Header>
      <Content>
        <ContentHeader title="Cloud Carbon Footprint Plugin">
          <SupportButton>A description of your plugin goes here.</SupportButton>
        </ContentHeader>
        <Wrapper>
          <TabbedLayout>
            <TabbedLayout.Route path="/emissions" title="Emissions">
              <Grid container spacing={3} direction="column">
                <ThemeProvider theme={determineTheme()}>
                  <EmissionsFilterBar
                    filters={filters}
                    setFilters={setFilters}
                    filteredDataResults={filteredDataResults}
                  />
                  <TabbedCard>
                    <CardTab label="Emissions Over Time">
                      <EmissionsOverTimeCard
                        filteredData={filteredEstimationData}
                      />
                    </CardTab>
                    <CardTab label="Carbon Comparison">
                      <CarbonComparisonCard data={filteredEstimationData} />
                    </CardTab>
                    <CardTab label="Emissions Breakdown">
                      <EmissionsBreakdownCard
                        data={filteredEstimationData}
                        baseUrl={baseUrl}
                      />
                    </CardTab>
                  </TabbedCard>
                  <CarbonIntensityMap />
                </ThemeProvider>
              </Grid>
            </TabbedLayout.Route>
            <TabbedLayout.Route path="/recommendations" title="Recommendations">
              <Grid container spacing={3} direction="column">
                <ThemeProvider theme={determineTheme()}>
                  <RecommendationsFilterBar
                    filters={recfilters}
                    setFilters={setRecFilters}
                    filteredDataResults={recFilteredDataResults}
                    setUseKilograms={setUseKilograms}
                  />
                  {selectedRecommendation && (
                    <RecommendationsSidePanel
                      recommendation={selectedRecommendation}
                      onClose={() => setSelectedRecommendation(undefined)}
                    />
                  )}
                  <RecommendationsTable
                    emissionsData={filteredEmissionsData}
                    recommendations={filteredRecommendationData}
                    handleRowClick={handleRowClick}
                    useKilograms={useKilograms}
                  />
                </ThemeProvider>
              </Grid>
            </TabbedLayout.Route>
          </TabbedLayout>
        </Wrapper>
      </Content>
    </Page>
  );
};
