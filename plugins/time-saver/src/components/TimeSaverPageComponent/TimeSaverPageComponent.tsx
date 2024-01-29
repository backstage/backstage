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
import React, { useState } from 'react';
import { Typography, Grid, Tabs, Tab, Divider, Paper } from '@material-ui/core';
import {
  InfoCard,
  Header,
  Page,
  Content,
  ContentHeader,
  HeaderLabel,
  SupportButton,
} from '@backstage/core-components';
import { AllStatsBarChart } from '../AllStatsBarChartComponent/AllStatsBarChartComponent';
import { ByTeamBarChart } from '../ByTeamBarCharComponent/ByTeamBarChartComponent';
import { GroupDivisionPieChart } from '../GroupDivisionPieChartComponent/GroupDivisionPieChartComponent';
import { DailyTimeSummaryLineChartTeamWise } from '../TeamWiseDailyTimeLinearComponent/TeamWiseDailyTimeLinearComponent';
import { TeamWiseTimeSummaryLinearChart } from '../TeamWiseTimeSummaryLinearComponent/TeamWiseTimeSummaryLinearComponent';
import TeamSelector from '../TeamSelectorComponent/TeamSelectorComponent';
import { DailyTimeSummaryLineChartTemplateWise } from '../TemplateWiseDailyTimeLinearComponent/TemplateWiseWiseDailyTimeLinearComponent';
import { TemplateWiseTimeSummaryLinearChart } from '../TemplateWiseTimeSummaryLinearComponent/TemplateWiseTimeSummaryLinearComponent';
import TemplateAutocomplete from '../TemplateAutocompleteComponent/TemplateAutocompleteComponent';
import { ByTemplateBarChart } from '../ByTemplateBarCharComponent/ByTemplateBarChartComponent';
import StatsTable from '../Table/StatsTable';
import { TemplateCountGauge } from '../Gauge/TemplatesTaskCountGauge';
import { TimeSavedGauge } from '../Gauge/TimeSavedGauge';
import { TeamsGauge } from '../Gauge/TeamsGauge';
import { TemplatesGauge } from '../Gauge/TemplatesGauge';

export const TimeSaverPageComponent = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [template, setTemplate] = useState('');

  const handleChange = (
    _event: any,
    _newValue: React.SetStateAction<number>,
  ) => {
    setSelectedTab(_newValue);
  };

  const handleTeamChange = (team: string) => {
    setSelectedTeam(team);
  };

  const handleTemplateChange = (templateUsed: string) => {
    setTemplate(templateUsed);
  };

  const handleClearTeam = () => {
    setSelectedTeam('');
  };

  const GaugesContainer = (
    <Grid
      container
      spacing={4}
      direction="row"
      justifyContent="space-between"
      alignItems="center"
    >
      <Grid item xs={2}>
        <Paper elevation={0}>
          <TemplateCountGauge />
        </Paper>
      </Grid>
      <Grid item xs={2}>
        <Paper elevation={0}>
          <TimeSavedGauge heading="Time Saved [hours]" />
        </Paper>
      </Grid>
      <Grid item xs={2}>
        <Paper elevation={0}>
          <TimeSavedGauge number={8} heading="Time Saved [days]" />
        </Paper>
      </Grid>
      <Grid item xs={2}>
        <Paper elevation={0}>
          <TeamsGauge />
        </Paper>
      </Grid>
      <Grid item xs={2}>
        <Paper elevation={0}>
          <TemplatesGauge />
        </Paper>
      </Grid>
    </Grid>
  );

  return (
    <Page themeId="tool">
      <Header
        title="Backstage TS plugin!"
        subtitle="Check saved time with TS plugin!"
      >
        <HeaderLabel label="Owner" value="Rackspace" />
        <HeaderLabel label="Lifecycle" value="experimental" />
      </Header>
      <Content>
        <ContentHeader title="Time Saver">
          <Tabs value={selectedTab} onChange={handleChange} centered={false}>
            <Tab label="All Stats" />
            <Tab label="By Team" />
            <Tab label="By Template" />
          </Tabs>
          <SupportButton>
            Time Saver plugin retrieves its config from template.metadata and
            groups it in a dedicated table, then it has a bunch of APIs for data
            queries
          </SupportButton>
        </ContentHeader>
        <Grid container spacing={3} direction="column">
          <Grid item>
            <InfoCard title="Time statistics that you have saved using Backstage Templates">
              <Typography variant="body1">
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    {selectedTab === 0 && (
                      <Grid container spacing={2}>
                        {GaugesContainer}
                        <Divider variant="fullWidth" />
                        <Grid xs={6}>
                          <AllStatsBarChart />
                        </Grid>
                        <Grid xs={6}>
                          <StatsTable />
                        </Grid>
                        <Grid xs={6}>
                          <DailyTimeSummaryLineChartTeamWise />
                        </Grid>
                        <Grid xs={6}>
                          <TeamWiseTimeSummaryLinearChart />
                        </Grid>
                        <Grid xs={6}>
                          <GroupDivisionPieChart />
                        </Grid>
                      </Grid>
                    )}
                    {selectedTab === 1 && (
                      <Grid container spacing={3}>
                        <Grid xs={12}>
                          <Grid xs={6}>
                            <TeamSelector
                              onTeamChange={handleTeamChange}
                              onClearButtonClick={handleClearTeam}
                            />
                            <Divider orientation="vertical" />
                          </Grid>
                        </Grid>
                        <Grid xs={6}>
                          <ByTeamBarChart team={selectedTeam} />
                        </Grid>{' '}
                        <Grid xs={6}>
                          <StatsTable team={selectedTeam} />
                        </Grid>
                        <Grid xs={6}>
                          <DailyTimeSummaryLineChartTeamWise
                            team={selectedTeam}
                          />
                        </Grid>
                        <Grid xs={6}>
                          <TeamWiseTimeSummaryLinearChart team={selectedTeam} />
                        </Grid>
                      </Grid>
                    )}
                    {selectedTab === 2 && (
                      <Grid container spacing={3}>
                        <Grid xs={12}>
                          <Grid xs={6}>
                            <TemplateAutocomplete
                              onTemplateChange={handleTemplateChange}
                            />
                          </Grid>
                        </Grid>
                        <Grid xs={6}>
                          <ByTemplateBarChart template_name={template} />
                        </Grid>
                        <Grid xs={6}>
                          <StatsTable template_name={template} />
                        </Grid>
                        <Grid xs={6}>
                          <DailyTimeSummaryLineChartTemplateWise
                            template_name={template}
                          />
                        </Grid>
                        <Grid xs={6}>
                          <TemplateWiseTimeSummaryLinearChart
                            template_name={template}
                          />
                        </Grid>
                      </Grid>
                    )}
                  </Grid>
                </Grid>
              </Typography>
            </InfoCard>
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};
