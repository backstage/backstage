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
import React, {PropsWithChildren} from 'react';
import {Route} from 'react-router';
import {Grid, ThemeProvider} from '@material-ui/core';
import {
  Header,
  Page,
  CardTab,
  Content,
  ContentHeader,
  HeaderLabel,
  SupportButton,
  TabbedCard,
  TabbedLayout,
} from '@backstage/core-components';
import EmissionsOverTimeCard
  from '@cloud-carbon-footprint/client/dist/pages/EmissionsMetricsPage/EmissionsOverTimeCard';
import CarbonComparisonCard
  from '@cloud-carbon-footprint/client/dist/pages/EmissionsMetricsPage/CarbonComparisonCard';
import EmissionsBreakdownCard
  from '@cloud-carbon-footprint/client/dist/pages/EmissionsMetricsPage/EmissionsBreakdownCard';
import CarbonIntensityMap
  from '@cloud-carbon-footprint/client/dist/pages/EmissionsMetricsPage/CarbonIntensityMap';
import EmissionsFilterBar
  from '@cloud-carbon-footprint/client/dist/pages/EmissionsMetricsPage/EmissionsFilterBar';

import {determineTheme} from '@cloud-carbon-footprint/client/dist/utils/themes';

import {
  EstimationResult,
} from '@cloud-carbon-footprint/common';
import {FlatRoutes} from "../../../../../packages/core-app-api";
import {useFilterDataFromEstimates} from "@cloud-carbon-footprint/client/dist/utils/helpers";
import {EmissionsFilters} from "@cloud-carbon-footprint/client/dist/pages/EmissionsMetricsPage/EmissionsFilterBar/utils/EmissionsFilters";
import {FilterResultResponse} from "@cloud-carbon-footprint/client/dist/Types";
import useFilters from "@cloud-carbon-footprint/client/dist/common/FilterBar/utils/FilterHook";

const mockData: EstimationResult[] = [
  {
    "timestamp": "2021-03-25T00:00:00.000Z",
    "serviceEstimates": [
      {
        "cloudProvider": "AWS",
        "accountName": "aws account 0",
        "serviceName": "ebs",
        "kilowattHours": 0.9099318685999922,
        "co2e": 2,
        "cost": 2.0611247334106126,
        "region": "us-east-1",
        "usesAverageCPUConstant": false
      },
      {
        "cloudProvider": "AWS",
        "accountName": "aws account 0",
        "serviceName": "s3",
        "kilowattHours": 0.000986946262424086,
        "co2e": 1,
        "cost": 2.341122015683861,
        "region": "us-east-2",
        "usesAverageCPUConstant": false
      },
      {
        "cloudProvider": "AWS",
        "accountName": "aws account 3",
        "serviceName": "ec2",
        "kilowattHours": 50.176579830111365,
        "co2e": 3,
        "cost": 2.4154850519158613,
        "region": "us-west-1",
        "usesAverageCPUConstant": false
      },
      {
        "cloudProvider": "AWS",
        "accountName": "aws account 3",
        "serviceName": "rds",
        "kilowattHours": 50.15554852182787,
        "co2e": 4,
        "cost": 1.8825350541114,
        "region": "us-west-2",
        "usesAverageCPUConstant": false
      },
      {
        "cloudProvider": "AWS",
        "accountName": "aws account 0",
        "serviceName": "lambda",
        "kilowattHours": 72.26453941514701,
        "co2e": 2,
        "cost": 2.0084835420769656,
        "region": "us-east-1",
        "usesAverageCPUConstant": false
      },
      {
        "cloudProvider": "GCP",
        "accountName": "gcp account 4",
        "serviceName": "computeEngine",
        "kilowattHours": 68.54797801901817,
        "co2e": 4,
        "cost": 1.8688785461442674,
        "region": "us-east1",
        "usesAverageCPUConstant": false
      },
      {
        "cloudProvider": "AZURE",
        "accountName": "azure account 4",
        "serviceName": "virtualMachines",
        "kilowattHours": 50.02721869884774,
        "co2e": 2,
        "cost": 2.2910467204304323,
        "region": "UK South",
        "usesAverageCPUConstant": false
      }
    ]
  },
  {
    "timestamp": "2021-02-25T00:00:00.000Z",
    "serviceEstimates": [
      {
        "cloudProvider": "AWS",
        "accountName": "aws account 0",
        "serviceName": "ebs",
        "kilowattHours": 0.9281382786569483,
        "co2e": 2,
        "cost": 2.225771432143803,
        "region": "us-east-1",
        "usesAverageCPUConstant": false
      },
      {
        "cloudProvider": "AWS",
        "accountName": "aws account 3",
        "serviceName": "s3",
        "kilowattHours": 0.00003270772530525257,
        "co2e": 4,
        "cost": 1.5028221506352941,
        "region": "us-east-2",
        "usesAverageCPUConstant": false
      },
      {
        "cloudProvider": "AWS",
        "accountName": "aws account 3",
        "serviceName": "ec2",
        "kilowattHours": 50.558103056454314,
        "co2e": 0,
        "cost": 2.440745140900739,
        "region": "us-west-1",
        "usesAverageCPUConstant": false
      },
      {
        "cloudProvider": "AWS",
        "accountName": "aws account 3",
        "serviceName": "rds",
        "kilowattHours": 62.615457571422965,
        "co2e": 0,
        "cost": 1.5955486508938537,
        "region": "us-west-2",
        "usesAverageCPUConstant": false
      },
      {
        "cloudProvider": "AWS",
        "accountName": "aws account 0",
        "serviceName": "lambda",
        "kilowattHours": 50.903421738830794,
        "co2e": 1,
        "cost": 2.238206567880293,
        "region": "us-east-1",
        "usesAverageCPUConstant": false
      },
      {
        "cloudProvider": "GCP",
        "accountName": "gcp account 1",
        "serviceName": "computeEngine",
        "kilowattHours": 65.28200479098749,
        "co2e": 3,
        "cost": 1.6177172869839958,
        "region": "us-west1",
        "usesAverageCPUConstant": false
      },
      {
        "cloudProvider": "AZURE",
        "accountName": "azure account 1",
        "serviceName": "virtualMachines",
        "kilowattHours": 61.90994721222564,
        "co2e": 2,
        "cost": 2.2081554041299234,
        "region": "UK South",
        "usesAverageCPUConstant": false
      }
    ]
  },
  {
    "timestamp": "2021-01-25T00:00:00.000Z",
    "serviceEstimates": [
      {
        "cloudProvider": "AWS",
        "accountName": "aws account 1",
        "serviceName": "ebs",
        "kilowattHours": 0.9290466782034781,
        "co2e": 0,
        "cost": 1.9170203054445436,
        "region": "us-east-1",
        "usesAverageCPUConstant": false
      },
      {
        "cloudProvider": "AWS",
        "accountName": "aws account 1",
        "serviceName": "s3",
        "kilowattHours": 0.00007414638904524828,
        "co2e": 0,
        "cost": 2.3496108515083787,
        "region": "us-east-2",
        "usesAverageCPUConstant": false
      },
      {
        "cloudProvider": "AWS",
        "accountName": "aws account 3",
        "serviceName": "ec2",
        "kilowattHours": 50.74719344234976,
        "co2e": 4,
        "cost": 1.8854738557659787,
        "region": "us-west-1",
        "usesAverageCPUConstant": false
      },
      {
        "cloudProvider": "AWS",
        "accountName": "aws account 4",
        "serviceName": "rds",
        "kilowattHours": 62.70792733734538,
        "co2e": 2,
        "cost": 1.9619661070136278,
        "region": "us-west-2",
        "usesAverageCPUConstant": false
      },
      {
        "cloudProvider": "AWS",
        "accountName": "aws account 2",
        "serviceName": "lambda",
        "kilowattHours": 50.18018466997432,
        "co2e": 2,
        "cost": 1.7366812626585235,
        "region": "us-east-1",
        "usesAverageCPUConstant": false
      },
      {
        "cloudProvider": "GCP",
        "accountName": "gcp account 3",
        "serviceName": "computeEngine",
        "kilowattHours": 50.642678514609926,
        "co2e": 4,
        "cost": 2.112304415112801,
        "region": "us-east2",
        "usesAverageCPUConstant": false
      },
      {
        "cloudProvider": "AZURE",
        "accountName": "azure account 1",
        "serviceName": "virtualMachines",
        "kilowattHours": 50.39790599515025,
        "co2e": 5,
        "cost": 1.844015443986478,
        "region": "UK South",
        "usesAverageCPUConstant": false
      }
    ]
  }
]

const Wrapper = ({children}: PropsWithChildren<{}>) => (
  <FlatRoutes>
    <Route path="/*" element={<>{children}</>}/>
  </FlatRoutes>
);


export const ExampleComponent = () => {

  const filteredDataResults: FilterResultResponse =
    useFilterDataFromEstimates(mockData)

  const buildFilters = (filteredResponse: FilterResultResponse) => {
    const updatedConfig = EmissionsFilters.generateConfig(filteredResponse)
    return new EmissionsFilters(updatedConfig)
  }

  const {filteredData, filters, setFilters} = useFilters(
    mockData,
    buildFilters,
    filteredDataResults,
  )
  const filteredEstimationData = filteredData as EstimationResult[]

  return (
    <Page themeId="tool">
      <Header
        title="Welcome to cloud-carbon-footprint!"
        subtitle="Optional subtitle"
      >
        <HeaderLabel label="Owner" value="Team X"/>
        <HeaderLabel label="Lifecycle" value="Alpha"/>
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
                      <CarbonComparisonCard
                        data={filteredEstimationData}
                      />
                    </CardTab>
                    <CardTab label="Emissions Breakdown">
                      <EmissionsBreakdownCard
                        data={filteredEstimationData}
                      />
                    </CardTab>
                  </TabbedCard>
                  <CarbonIntensityMap/>
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
}
