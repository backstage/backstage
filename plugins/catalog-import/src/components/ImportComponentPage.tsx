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
import { Grid } from '@material-ui/core';
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
        <ContentHeader title="Start tracking your component on backstage">
          <SupportButton>
            Start tracking your component in Backstage. TODO: Add more
            information about what this is.
          </SupportButton>
        </ContentHeader>
        <Grid container spacing={3} direction="column">
          <Grid item>
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
