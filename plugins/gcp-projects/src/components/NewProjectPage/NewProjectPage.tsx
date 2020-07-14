/*
 * Copyright 2020 Spotify AB
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

import React, { FC, useState } from 'react';
import { Grid, Button, TextField } from '@material-ui/core';

import {
  InfoCard,
  Header,
  Page,
  pageTheme,
  Content,
  ContentHeader,
  HeaderLabel,
  SupportButton,
  SimpleStepper,
  SimpleStepperStep,
  StructuredMetadataTable,
} from '@backstage/core';

export const NewProjectPage: FC<{}> = () => {
  const [projectName, setProjectName] = useState('');
  const [projectId, setProjectId] = useState('');
  const [done, setDone] = useState(false);

  const metadata = {
    ProjectName: projectName,
    ProjectId: projectId,
  };

  return (
    <Page theme={pageTheme.tool}>
      <Header title="GCP - Projects" subtitle="Create new GCP Project">
        <HeaderLabel label="Owner" value="Infrastructure Operations" />
        <HeaderLabel label="Lifecycle" value="Alpha" />
      </Header>
      <Content>
        <ContentHeader title="Create new GCP Project at trivago">
          <SupportButton>
            This plugin will help you create a project in gcp.
          </SupportButton>
        </ContentHeader>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <InfoCard>
              <SimpleStepper>
                <SimpleStepperStep title="Project Name">
                  <TextField
                    variant="outlined"
                    name="projectName"
                    label="Project Name"
                    helperText="The name of the new project."
                    inputProps={{ 'aria-label': 'Project Name' }}
                    onChange={e => setProjectName(e.target.value)}
                    value={projectName}
                    fullWidth
                  />
                </SimpleStepperStep>
                <SimpleStepperStep title="Project ID">
                  <TextField
                    variant="outlined"
                    name="projectId"
                    label="projectId"
                    onChange={e => setProjectId(e.target.value)}
                    value={projectId}
                    fullWidth
                  />
                </SimpleStepperStep>
                <SimpleStepperStep title="" end>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setDone(true)}
                  >
                    Finish
                  </Button>
                </SimpleStepperStep>
              </SimpleStepper>
            </InfoCard>
          </Grid>
          {done === true ? (
            <Grid item xs={12} md={8}>
              <InfoCard title="Project Info:">
                <StructuredMetadataTable metadata={metadata} />
                <br />
                <br />
                <br />
                <Button
                  variant="contained"
                  color="primary"
                  href={`newProject?projectName=${encodeURIComponent(
                    projectName,
                  )},projectId=${encodeURIComponent(projectId)}`}
                >
                  Confirm
                </Button>
              </InfoCard>
            </Grid>
          ) : (
            <br />
          )}
        </Grid>
      </Content>
    </Page>
  );
};
