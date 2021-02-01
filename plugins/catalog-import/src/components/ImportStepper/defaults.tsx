/*
 * Copyright 2021 Spotify AB
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

import { ConfigApi } from '@backstage/core';
import {
  Box,
  Step,
  StepContent,
  StepLabel,
  TextField,
  Typography,
} from '@material-ui/core';
import React from 'react';
import { BackButton } from '../Buttons';
import { StepFinishImportLocation } from '../StepFinishImportLocation';
import { StepInitAnalyzeUrl } from '../StepInitAnalyzeUrl';
import {
  AutocompleteTextField,
  StepPrepareCreatePullRequest,
} from '../StepPrepareCreatePullRequest';
import { StepPrepareSelectLocations } from '../StepPrepareSelectLocations';
import { StepReviewLocation } from '../StepReviewLocation';
import { ImportFlows, ImportState } from '../useImportState';

export type StepperProviderOpts = {
  pullRequest?: {
    disable?: boolean;
    preparePullRequest?: (apis: StepperApis) => { title: string; body: string };
  };
};

type StepperApis = {
  configApi: ConfigApi;
};

export type StepperProvider = {
  analyze: (
    s: Extract<ImportState, { activeState: 'analyze' }>,
    opts: { apis: StepperApis; opts?: StepperProviderOpts },
  ) => React.ReactElement;
  prepare: (
    s: Extract<ImportState, { activeState: 'prepare' }>,
    opts: { apis: StepperApis; opts?: StepperProviderOpts },
  ) => React.ReactElement;
  review: (
    s: Extract<ImportState, { activeState: 'review' }>,
    opts: { apis: StepperApis; opts?: StepperProviderOpts },
  ) => React.ReactElement;
  finish: (
    s: Extract<ImportState, { activeState: 'finish' }>,
    opts: { apis: StepperApis; opts?: StepperProviderOpts },
  ) => React.ReactElement;
};

function defaultPreparePullRequest(apis: StepperApis) {
  const appTitle = apis.configApi.getOptionalString('app.title') ?? 'Backstage';
  const appBaseUrl = apis.configApi.getString('app.baseUrl');

  return {
    title: 'Add catalog-info.yaml config file',
    body: `This pull request adds a **Backstage entity metadata file** \
to this repository so that the component can be added to the \
[${appTitle} software catalog](${appBaseUrl}).\n\nAfter this pull request is merged, \
the component will become available.\n\nFor more information, read an \
[overview of the Backstage software catalog](https://backstage.io/docs/features/software-catalog/software-catalog-overview).`,
  };
}

/**
 * The default stepper generation function.
 *
 * Override this function to customize the import flow. Each flow should at
 * least override the prepare operation.
 *
 * @param flow the name of the active flow
 * @param defaults the default steps
 */
export function defaultGenerateStepper(
  flow: ImportFlows,
  defaults: StepperProvider,
): StepperProvider {
  switch (flow) {
    // the prepare step is skipped but the label of the step is updated
    case 'single-location':
      return {
        ...defaults,
        prepare: () => (
          <Step>
            <StepLabel
              optional={
                <Typography variant="caption">
                  Discovered Locations: 1
                </Typography>
              }
            >
              Select Locations
            </StepLabel>
          </Step>
        ),
      };

    // let the user select one or more of the discovered locations in the prepare step
    case 'multiple-locations':
      return {
        ...defaults,
        prepare: (state, opts) => {
          if (state.analyzeResult.type !== 'locations') {
            return defaults.prepare(state, opts);
          }

          return (
            <Step>
              <StepLabel
                optional={
                  <Typography variant="caption">
                    Discovered Locations: {state.analyzeResult.locations.length}
                  </Typography>
                }
              >
                Select Locations
              </StepLabel>
              <StepContent>
                <StepPrepareSelectLocations
                  analyzeResult={state.analyzeResult}
                  prepareResult={state.prepareResult}
                  onPrepare={state.onPrepare}
                  onGoBack={state.onGoBack}
                />
              </StepContent>
            </Step>
          );
        },
      };

    case 'no-location':
      return {
        ...defaults,
        prepare: (state, opts) => {
          if (state.analyzeResult.type !== 'repository') {
            return defaults.prepare(state, opts);
          }

          const { title, body } = (
            opts?.opts?.pullRequest?.preparePullRequest ??
            defaultPreparePullRequest
          )(opts.apis);

          return (
            <Step>
              <StepLabel>Create Pull Request</StepLabel>

              <StepContent>
                <StepPrepareCreatePullRequest
                  analyzeResult={state.analyzeResult}
                  onPrepare={state.onPrepare}
                  onGoBack={state.onGoBack}
                  defaultTitle={title}
                  defaultBody={body}
                  renderFormFields={({
                    control,
                    errors,
                    groupsLoading,
                    groups,
                    register,
                  }) => (
                    <>
                      <Box marginTop={2}>
                        <Typography variant="h6">
                          Pull Request Details
                        </Typography>
                      </Box>

                      <TextField
                        name="title"
                        label="Pull Request Title"
                        placeholder="Add catalog files for the Backstage"
                        margin="normal"
                        variant="outlined"
                        fullWidth
                        inputRef={register({ required: true })}
                        error={Boolean(errors.title)}
                        required
                      />

                      <TextField
                        name="body"
                        label="Pull Request Body"
                        placeholder="A decsribing text with Markdown support"
                        margin="normal"
                        variant="outlined"
                        fullWidth
                        inputRef={register({ required: true })}
                        error={Boolean(errors.body)}
                        multiline
                        required
                      />

                      <Box marginTop={2}>
                        <Typography variant="h6">
                          Entity Configuration
                        </Typography>
                      </Box>

                      <TextField
                        name="componentName"
                        label="Name of the created component"
                        placeholder="my-component"
                        margin="normal"
                        variant="outlined"
                        fullWidth
                        inputRef={register({ required: true })}
                        error={Boolean(errors.componentName)}
                        required
                      />

                      <AutocompleteTextField
                        name="owner"
                        control={control}
                        errors={errors}
                        options={groups || []}
                        loading={groupsLoading}
                        loadingText="Loading groups…"
                        helperText="Select an owner from the list or enter a reference to a Group or a User"
                        errorHelperText="required value"
                        textFieldProps={{
                          label: 'Entity Owner',
                          placeholder: 'Group:default/my-group',
                        }}
                        rules={{ required: true }}
                        required
                      />
                    </>
                  )}
                />
              </StepContent>
            </Step>
          );
        },
      };

    default:
      return defaults;
  }
}

export const defaultStepper: StepperProvider = {
  analyze: (state, { opts }) => (
    <Step>
      <StepLabel>Select URL</StepLabel>
      <StepContent>
        <StepInitAnalyzeUrl
          key="analyze"
          analysisUrl={state.analysisUrl}
          onAnalysis={state.onAnalysis}
          disablePullRequest={opts?.pullRequest?.disable}
        />
      </StepContent>
    </Step>
  ),

  prepare: state => (
    <Step>
      <StepLabel optional={<Typography variant="caption">Optional</Typography>}>
        Import Actions
      </StepLabel>
      <StepContent>
        <BackButton onClick={state.onGoBack} />
      </StepContent>
    </Step>
  ),

  review: state => (
    <Step>
      <StepLabel>Review</StepLabel>
      <StepContent>
        <StepReviewLocation
          prepareResult={state.prepareResult}
          onReview={state.onReview}
          onGoBack={state.onGoBack}
        />
      </StepContent>
    </Step>
  ),

  finish: state => (
    <Step>
      <StepLabel>Finish</StepLabel>
      <StepContent>
        <StepFinishImportLocation
          reviewResult={state.reviewResult}
          onReset={state.onReset}
        />
      </StepContent>
    </Step>
  ),
};
