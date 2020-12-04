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

import React, { useState } from 'react';
import { Grid, Typography } from '@material-ui/core';
import {
  InfoCard,
  Page,
  Content,
  Header,
  SupportButton,
  ContentHeader,
  RouteRef,
} from '@backstage/core';
import { RegisterComponentForm } from './ImportComponentForm';
import ImportStepper from './ImportStepper';
import ComponentConfigDisplay from './ComponentConfigDisplay';
import { ImportFinished } from './ImportFinished';
import { PartialEntity } from '../util/types';

export type ConfigSpec = {
  type: 'repo' | 'file';
  location: string;
  config: PartialEntity[];
};

export const ImportComponentPage = ({
  catalogRouteRef,
}: {
  catalogRouteRef: RouteRef;
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [configFile, setConfigFile] = useState<ConfigSpec>({
    type: 'repo',
    location: '',
    config: [],
  });
  const [endLink, setEndLink] = useState<string>('');
  const nextStep = (options?: { reset: boolean }) => {
    setActiveStep(step => (options?.reset ? 0 : step + 1));
  };

  return (
    <Page themeId="home">
      <Header title="Register an existing component" />
      <Content>
        <ContentHeader title="Start tracking your component in Backstage">
          <SupportButton>
            Start tracking your component in Backstage by adding it to the
            software catalog.
          </SupportButton>
        </ContentHeader>
        <Grid container spacing={3} direction="row-reverse">
          <Grid item xs={6}>
            <InfoCard
              deepLink={{
                title: 'Learn more about the Software Catalog',
                link:
                  'https://backstage.io/docs/features/software-catalog/software-catalog-overview',
              }}
            >
              <Typography variant="body2" paragraph>
                There are two ways to register an existing component.
              </Typography>
              <Typography variant="h6">GitHub Repo</Typography>
              <Typography variant="body2" paragraph>
                If you already have code in a GitHub repository, enter the full
                URL to your repo and a new pull request with a sample Backstage
                metadata Entity File (<code>catalog-info.yaml</code>) will be
                opened for you.
              </Typography>
              <Typography variant="h6">
                GitHub Repo &amp; Entity File
              </Typography>
              <Typography variant="body2" paragraph>
                If you've already created a Backstage metadata file and put it
                in your repo, you can enter the full URL to that Entity File.
              </Typography>
            </InfoCard>
          </Grid>
          <Grid item xs={6}>
            <InfoCard>
              <ImportStepper
                steps={[
                  {
                    step: 'Insert GitHub repo URL or Entity File URL',
                    content: (
                      <RegisterComponentForm
                        nextStep={nextStep}
                        saveConfig={setConfigFile}
                      />
                    ),
                  },
                  {
                    step: 'Review',
                    content: (
                      <ComponentConfigDisplay
                        nextStep={nextStep}
                        configFile={configFile}
                        savePRLink={setEndLink}
                        catalogRouteRef={catalogRouteRef}
                      />
                    ),
                  },
                  {
                    step: 'Finish',
                    content: (
                      <ImportFinished
                        nextStep={nextStep}
                        PRLink={endLink}
                        type={configFile.type}
                      />
                    ),
                  },
                ]}
                activeStep={activeStep}
                nextStep={nextStep}
              />
            </InfoCard>
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};
