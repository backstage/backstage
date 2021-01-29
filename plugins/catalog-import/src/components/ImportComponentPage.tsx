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
  useApi,
  configApiRef,
  ConfigApi,
} from '@backstage/core';
import { RegisterComponentForm } from './ImportComponentForm';
import ImportStepper from './ImportStepper';
import ComponentConfigDisplay from './ComponentConfigDisplay';
import { ImportFinished } from './ImportFinished';
import { PartialEntity } from '../util/types';

export type ConfigSpec = {
  type: 'tree' | 'file';
  location: string;
  config: PartialEntity[];
};

function manifestGenerationAvailable(configApi: ConfigApi): boolean {
  return configApi.has('integrations.github');
}

function repositories(configApi: ConfigApi): string[] {
  const integrations = configApi.getConfig('integrations');
  const repos = [];
  if (integrations.has('github')) {
    repos.push('GitHub');
  }
  if (integrations.has('bitbucket')) {
    repos.push('Bitbucket');
  }
  if (integrations.has('gitlab')) {
    repos.push('GitLab');
  }
  if (integrations.has('azure')) {
    repos.push('Azure');
  }
  return repos;
}

export const ImportComponentPage = ({
  catalogRouteRef,
}: {
  catalogRouteRef: RouteRef;
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [configFile, setConfigFile] = useState<ConfigSpec>({
    type: 'tree',
    location: '',
    config: [],
  });
  const [endLink, setEndLink] = useState<string>('');
  const nextStep = (options?: { reset: boolean }) => {
    setActiveStep(step => (options?.reset ? 0 : step + 1));
  };

  const configApi = useApi(configApiRef);
  const appTitle = configApi.getOptional('app.title') || 'Backstage';
  const repos = repositories(configApi);
  const repositoryString = repos.join(', ').replace(/, (\w*)$/, ' or $1');
  return (
    <Page themeId="home">
      <Header title="Register an existing component" />
      <Content>
        <ContentHeader title={`Start tracking your component in ${appTitle}`}>
          <SupportButton>
            Start tracking your component in {appTitle} by adding it to the
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
                Ways to register an existing component
              </Typography>

              {manifestGenerationAvailable(configApi) && (
                <React.Fragment>
                  <Typography variant="h6">GitHub Repo</Typography>
                  <Typography variant="body2" paragraph>
                    If you already have code in a GitHub repository without
                    Backstage metadata file set up for it, enter the full URL to
                    your repo and a new pull request with a sample Backstage
                    metadata Entity File (<code>catalog-info.yaml</code>) will
                    be opened for you.
                  </Typography>
                </React.Fragment>
              )}
              <Typography variant="h6">
                {repos.length === 1 ? `${repos[0]} ` : ''} Repository &amp;
                Entity File
              </Typography>
              <Typography variant="body2" paragraph>
                If you've already created a {appTitle} metadata file and put it
                in your {repositoryString} repository, you can enter the full
                URL to that Entity File.
              </Typography>
            </InfoCard>
          </Grid>
          <Grid item xs={6}>
            <InfoCard>
              <ImportStepper
                steps={[
                  {
                    step: manifestGenerationAvailable(configApi)
                      ? 'Insert GitHub repo URL or Entity File URL'
                      : 'Insert Entity File URL',
                    content: (
                      <RegisterComponentForm
                        nextStep={nextStep}
                        saveConfig={setConfigFile}
                        repository={repositoryString}
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
