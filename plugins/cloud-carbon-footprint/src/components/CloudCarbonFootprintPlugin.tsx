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
import React, { PropsWithChildren, useEffect, useMemo, useState } from 'react';
import { Route } from 'react-router-dom';
import { Grid, ThemeProvider } from '@material-ui/core';
import {
  CardTab,
  Content,
  ErrorPanel,
  Header,
  HeaderLabel,
  InfoCard,
  Page,
  Progress,
  TabbedCard,
  TabbedLayout,
} from '@backstage/core-components';
import {
  configApiRef,
  DiscoveryApi,
  discoveryApiRef,
  useApi,
} from '@backstage/core-plugin-api';

import { FlatRoutes } from '@backstage/core-app-api';
import moment from 'moment';
import {
  CarbonComparisonCard,
  CarbonIntensityMap,
  determineTheme,
  EmissionsBreakdownCard,
  EmissionsFilterBar,
  EmissionsOverTimeCard,
  Methodology,
  RecommendationsFilterBar,
  RecommendationsTable,
  useFootprintData,
  useRecommendationData,
} from '@cloud-carbon-footprint/client';
import { Config } from '@backstage/config';

const Wrapper = ({
  children,
  error,
  loading,
}: PropsWithChildren<{ error: Error | null; loading?: boolean }>) => (
  <Page themeId="tool">
    <Header title="Cloud Carbon Footprint" type="tool">
      <HeaderLabel label="Owner" value="Team X" />
      <HeaderLabel label="Lifecycle" value="Alpha" />
    </Header>
    <Content>
      {error && (
        <p>
          <ErrorPanel error={error} />
        </p>
      )}
      {loading && <Progress />}
      <ThemeProvider theme={determineTheme()}>
        <FlatRoutes>
          <Route path="/*" element={<>{children}</>} />
        </FlatRoutes>
      </ThemeProvider>
    </Content>
  </Page>
);

export const CloudCarbonFootprintPlugin = () => {
  const config = useApi(configApiRef);
  const clientConfig = useMemo(
    () => config.getOptionalConfig('client'),
    [config],
  );
  const groupBy = useMemo(() => config.getOptionalString('groupBy'), [config]);
  const { endDate, startDate } = useMemo(
    () => determineDates(clientConfig),
    [clientConfig],
  );
  const [baseUrl, setUrl] = useState<string | null>(null);
  const discovery: DiscoveryApi = useApi(discoveryApiRef);
  useEffect(() => {
    discovery.getBaseUrl('cloud-carbon-footprint').then(url => setUrl(url));
  }, [discovery]);
  const [useKilograms, setUseKilograms] = useState(false);
  const footprint = useFootprintData({ baseUrl, startDate, endDate, groupBy });
  const recommendations = useRecommendationData({ baseUrl, groupBy });

  const error: Error | null = footprint.error || recommendations.error;
  return (
    <Wrapper error={error}>
      <TabbedLayout>
        <TabbedLayout.Route path="/emissions" title="Emissions">
          <Grid container spacing={3} direction="column">
            <Grid item>
              <EmissionsFilterBar {...footprint.filterBarProps} />
              {footprint.loading && <Progress />}
            </Grid>
            <Grid item>
              <TabbedCard title="Estimated Emissions">
                <CardTab label="Cloud Usage">
                  <EmissionsOverTimeCard data={footprint.filteredData} />
                </CardTab>
                <CardTab label="Breakdown">
                  <Grid container direction="row" spacing={3}>
                    <CarbonComparisonCard data={footprint.filteredData} />
                    <EmissionsBreakdownCard
                      data={footprint.filteredData}
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
                {...recommendations.filterBarProps}
                setUseKilograms={setUseKilograms}
              />
              {recommendations.loading && <Progress />}
            </Grid>
            <Grid item>
              <RecommendationsTable
                emissionsData={recommendations.filteredEmissionsData}
                recommendations={recommendations.filteredRecommendationData}
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

function determineDates(clientConfig: Config | undefined) {
  const endDate: moment.Moment = moment.utc();
  const defaultStartDate: moment.Moment = moment.utc().subtract(1, 'years');

  const previousYearOfUsage = clientConfig?.getOptionalBoolean(
    'previousYearOfUsage',
  );
  const dateRangeValue = clientConfig?.getOptionalNumber('dateRangeValue');
  const dateRangeType = clientConfig?.getOptionalString('dateRangeType');

  const configuredStartDate = dateRangeType && dateRangeValue
    ? moment
      .utc()
      .subtract(
        dateRangeValue,
        dateRangeType as moment.unitOfTime.DurationConstructor,
      )
    : defaultStartDate;
  const startDate: moment.Moment =
    previousYearOfUsage === true
      ? defaultStartDate
      : configuredStartDate;
  return { endDate, startDate };
}
