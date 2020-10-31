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
} from '@backstage/core';
import { RegisterComponentForm } from './ImportComponentForm';
import ImportStepper from './ImportStepper';
import ComponentConfigDisplay from './ComponentConfigDisplay';
import { ImportFinished } from './ImportFinished';
import { PartialEntity } from '../util/types';

export type ConfigSpec = {
  repo: string;
  config: PartialEntity[];
};

export const ImportComponentPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [configFile, setConfigFile] = useState<ConfigSpec>({
    repo: '',
    config: [],
  });
  const [PRLink, setPRLink] = useState<string>('');
  const nextStep = (options?: { reset: boolean }) => {
    setActiveStep(step => (options?.reset ? 0 : step + 1));
  };

  return (
    <Page themeId="home">
      <Header title="Import repo" />
      <Content>
        <ContentHeader title="Import your repository to Backstage">
          <SupportButton>
            Generate a component definition file and automatically submit it as
            a pull request. TODO: Add more information about what this is.
          </SupportButton>
        </ContentHeader>
        <Grid container spacing={3} direction="column">
          <Grid item>
            <InfoCard>
              <ImportStepper
                steps={[
                  {
                    step: 'Select GitHub repo and generate config files for it',
                    content: (
                      <RegisterComponentForm
                        nextStep={nextStep}
                        saveConfig={setConfigFile}
                      />
                    ),
                  },
                  {
                    step: 'Review generated component config files',
                    content: (
                      <ComponentConfigDisplay
                        nextStep={nextStep}
                        configFile={configFile}
                        savePRLink={setPRLink}
                      />
                    ),
                  },
                  {
                    step: 'Finish',
                    content: (
                      <ImportFinished nextStep={nextStep} PRLink={PRLink} />
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
