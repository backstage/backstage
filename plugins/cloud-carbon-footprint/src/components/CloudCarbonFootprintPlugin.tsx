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
import React, { PropsWithChildren, useEffect, useState } from 'react';
import { Route } from 'react-router';
import { Grid, ThemeProvider } from '@material-ui/core';
import { GridRowParams } from '@material-ui/data-grid';
import {
  CardTab,
  Content,
  Header,
  HeaderLabel,
  InfoCard,
  Page,
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
import { FlatRoutes } from '@backstage/core-app-api';
import { RecommendationRow } from '@cloud-carbon-footprint/client/dist/Types';
import moment from 'moment';
import RecommendationsFilterBar from '@cloud-carbon-footprint/client/dist/pages/RecommendationsPage/RecommendationsFilterBar';
import RecommendationsSidePanel from '@cloud-carbon-footprint/client/dist/pages/RecommendationsPage/RecommendationsSidePanel';
import RecommendationsTable from '@cloud-carbon-footprint/client/dist/pages/RecommendationsPage/RecommendationsTable';
import { Methodology } from '@cloud-carbon-footprint/client/dist/pages/EmissionsMetricsPage/EmissionsSidePanel/EmissionsSidePanel';
import { useEmissionsData, useRecommendationsData } from './hooks';

const Wrapper = ({ children }: PropsWithChildren<{}>) => (
  <Page themeId="tool">
    <Header title="Cloud Carbon Footprint" type="tool">
      <HeaderLabel label="Owner" value="Team X" />
      <HeaderLabel label="Lifecycle" value="Alpha" />
    </Header>
    <Content>
      <ThemeProvider theme={determineTheme()}>
        <FlatRoutes>
          <Route path="/*" element={<>{children}</>} />
        </FlatRoutes>
      </ThemeProvider>
    </Content>
  </Page>
);

export const CloudCarbonFootprintPlugin = () => {
  const endDate: moment.Moment = moment.utc();
  const startDate: moment.Moment = moment.utc(
    Date.UTC(endDate.year() - 2, 0, 1, 0, 0, 0, 0),
  );
  const [baseUrl, setUrl] = useState<string | undefined>(undefined);
  const discovery: DiscoveryApi = useApi(discoveryApiRef);
  useEffect(() => {
    discovery.getBaseUrl('cloud-carbon-footprint').then(url => setUrl(url));
  }, []);
  const [selectedRecommendation, setSelectedRecommendation] =
    useState<RecommendationRow>();
  const [useKilograms, setUseKilograms] = useState(false);

  const handleRowClick = (params: GridRowParams, _event: any) => {
    if (selectedRecommendation && params.row.id === selectedRecommendation.id) {
      setSelectedRecommendation(undefined);
    } else {
      setSelectedRecommendation(params.row as RecommendationRow);
    }
  };

  const emissions = useEmissionsData(baseUrl, startDate, endDate);
  const recommendations = useRecommendationsData(baseUrl, emissions.data);

  return (
    <Wrapper>
      <TabbedLayout>
        <TabbedLayout.Route path="/emissions" title="Emissions">
          <Grid container spacing={3} direction="column">
            <Grid item>
              <EmissionsFilterBar
                filters={emissions.filters}
                setFilters={emissions.setFilters}
                filteredDataResults={emissions.filterOptions}
              />
            </Grid>
            <Grid item>
              <TabbedCard title="Estimated Emissions">
                <CardTab label="Cloud Usage">
                  <EmissionsOverTimeCard
                    filteredData={emissions.filteredData}
                  />
                </CardTab>
                <CardTab label="Breakdown">
                  <Grid container direction="row" spacing={3}>
                    <CarbonComparisonCard data={emissions.filteredData} />
                    <EmissionsBreakdownCard
                      data={emissions.filteredData}
                      baseUrl={baseUrl}
                    />
                  </Grid>
                </CardTab>
              </TabbedCard>
            </Grid>
          </Grid>
        </TabbedLayout.Route>
        <TabbedLayout.Route path="/recommendations" title="Recommendations">
          <Grid container spacing={3} direction="column">
            <Grid item>
              <RecommendationsFilterBar
                filters={recommendations.filters}
                setFilters={recommendations.setFilters}
                filteredDataResults={recommendations.filterOptions}
                setUseKilograms={setUseKilograms}
              />
            </Grid>
            <Grid item>
              {selectedRecommendation && (
                <RecommendationsSidePanel
                  recommendation={selectedRecommendation}
                  onClose={() => setSelectedRecommendation(undefined)}
                />
              )}
              <RecommendationsTable
                emissionsData={recommendations.filteredEmissionsData}
                recommendations={recommendations.filteredRecommendationData}
                handleRowClick={handleRowClick}
                useKilograms={useKilograms}
              />
            </Grid>
          </Grid>
        </TabbedLayout.Route>
        <TabbedLayout.Route path="/carbon-map" title="Carbon Intensity Map">
          <Grid container spacing={3} direction="column">
            <CarbonIntensityMap />
          </Grid>
        </TabbedLayout.Route>
        <TabbedLayout.Route path="/methodology" title="Methodology">
          <Grid container spacing={3} direction="column">
            <InfoCard title="How do we get our carbon estimates?">
              <Methodology />
            </InfoCard>
          </Grid>
        </TabbedLayout.Route>
      </TabbedLayout>
    </Wrapper>
  );
};
