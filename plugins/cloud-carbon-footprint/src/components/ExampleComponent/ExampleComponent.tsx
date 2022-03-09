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

const Wrapper = ({ children }: PropsWithChildren<{}>) => (
  <FlatRoutes>
    <Route path="/*" element={<>{children}</>} />
  </FlatRoutes>
);

export const ExampleComponent = () => {
  // const dateRangeType: string = config().DATE_RANGE.TYPE
  // const dateRangeValue: string = config().DATE_RANGE.VALUE
  const endDate: moment.Moment = moment.utc();

  let startDate: moment.Moment;
  // if (config().PREVIOUS_YEAR_OF_USAGE) {
  startDate = moment.utc(Date.UTC(endDate.year() - 2, 0, 1, 0, 0, 0, 0));
  // } else {
  //   startDate = moment
  //   .utc()
  //   .subtract(dateRangeValue, dateRangeType as unitOfTime.DurationConstructor)
  // }

  const discovery: DiscoveryApi = useApi(discoveryApiRef);
  useEffect(() => {
    discovery.getBaseUrl('cloud-carbon-footprint').then(url => setUrl(url));
  }, []);

  const [baseUrl, setUrl] = useState<string | undefined>(undefined);

  const { data } = useRemoteService(
    [],
    startDate,
    endDate,
    false,
    undefined,
    baseUrl,
  );

  const filteredDataResults: FilterResultResponse =
    useFilterDataFromEstimates(data);

  const buildFilters = (filteredResponse: FilterResultResponse) => {
    const updatedConfig = EmissionsFilters.generateConfig(filteredResponse);
    return new EmissionsFilters(updatedConfig);
  };

  const { filteredData, filters, setFilters } = useFilters(
    data,
    buildFilters,
    filteredDataResults,
  );
  const filteredEstimationData = filteredData as EstimationResult[];

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
              <div>Recommendations-page</div>
            </TabbedLayout.Route>
          </TabbedLayout>
        </Wrapper>
      </Content>
    </Page>
  );
};
