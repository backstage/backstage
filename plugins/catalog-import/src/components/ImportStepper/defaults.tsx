/*
 * Copyright 2021 The Backstage Authors
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

import { TranslationFunction } from '@backstage/core-plugin-api/alpha';
import { catalogImportTranslationRef } from '@backstage/plugin-catalog-import/alpha';
import Box from '@material-ui/core/Box';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import StepLabel from '@material-ui/core/StepLabel';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { ReactElement } from 'react';
import { BackButton } from '../Buttons';
import { asInputRef } from '../helpers';
import { StepFinishImportLocation } from '../StepFinishImportLocation';
import { StepInitAnalyzeUrl } from '../StepInitAnalyzeUrl';
import {
  AutocompleteTextField,
  StepPrepareCreatePullRequest,
} from '../StepPrepareCreatePullRequest';
import { StepPrepareSelectLocations } from '../StepPrepareSelectLocations';
import { StepReviewLocation } from '../StepReviewLocation';
import { StepperApis } from '../types';
import { ImportFlows, ImportState } from '../useImportState';

export type StepConfiguration = {
  stepLabel: ReactElement;
  content: ReactElement;
};

/**
 * Defines the details of the stepper.
 *
 * @public
 */
export interface StepperProvider {
  analyze: (
    s: Extract<ImportState, { activeState: 'analyze' }>,
    opts: {
      apis: StepperApis;
      t: TranslationFunction<typeof catalogImportTranslationRef.T>;
    },
  ) => StepConfiguration;
  prepare: (
    s: Extract<ImportState, { activeState: 'prepare' }>,
    opts: {
      apis: StepperApis;
      t: TranslationFunction<typeof catalogImportTranslationRef.T>;
    },
  ) => StepConfiguration;
  review: (
    s: Extract<ImportState, { activeState: 'review' }>,
    opts: {
      apis: StepperApis;
      t: TranslationFunction<typeof catalogImportTranslationRef.T>;
    },
  ) => StepConfiguration;
  finish: (
    s: Extract<ImportState, { activeState: 'finish' }>,
    opts: {
      apis: StepperApis;
      t: TranslationFunction<typeof catalogImportTranslationRef.T>;
    },
  ) => StepConfiguration;
}

/**
 * The default stepper generation function.
 *
 * Override this function to customize the import flow. Each flow should at
 * least override the prepare operation.
 *
 * @param flow - the name of the active flow
 * @param defaults - the default steps
 * @param t - the translation function
 * @public
 */
export function defaultGenerateStepper(
  flow: ImportFlows,
  defaults: StepperProvider,
  t: TranslationFunction<typeof catalogImportTranslationRef.T>,
): StepperProvider {
  switch (flow) {
    // the prepare step is skipped but the label of the step is updated
    case 'single-location':
      return {
        ...defaults,
        prepare: () => ({
          stepLabel: (
            <StepLabel
              optional={
                <Typography variant="caption">
                  {t('importStepper.singleLocation.description')}
                </Typography>
              }
            >
              {t('importStepper.singleLocation.title')}
            </StepLabel>
          ),
          content: <></>,
        }),
      };

    // let the user select one or more of the discovered locations in the prepare step
    case 'multiple-locations':
      return {
        ...defaults,
        prepare: (state, opts) => {
          if (state.analyzeResult.type !== 'locations') {
            return defaults.prepare(state, opts);
          }

          return {
            stepLabel: (
              <StepLabel
                optional={
                  <Typography variant="caption">
                    {t('importStepper.multipleLocations.description', {
                      length: state.analyzeResult.locations.length,
                    })}
                  </Typography>
                }
              >
                {t('importStepper.multipleLocations.title')}
              </StepLabel>
            ),
            content: (
              <StepPrepareSelectLocations
                analyzeResult={state.analyzeResult}
                prepareResult={state.prepareResult}
                onPrepare={state.onPrepare}
                onGoBack={state.onGoBack}
              />
            ),
          };
        },
      };

    case 'no-location':
      return {
        ...defaults,
        prepare: (state, opts) => {
          if (state.analyzeResult.type !== 'repository') {
            return defaults.prepare(state, opts);
          }

          return {
            stepLabel: (
              <StepLabel>{t('importStepper.noLocation.title')}</StepLabel>
            ),
            content: (
              <StepPrepareCreatePullRequest
                analyzeResult={state.analyzeResult}
                onPrepare={state.onPrepare}
                onGoBack={state.onGoBack}
                renderFormFields={({
                  values,
                  setValue,
                  formState,
                  groupsLoading,
                  groups,
                  register,
                }) => (
                  <>
                    <Box marginTop={2}>
                      <Typography variant="h6">
                        {t('importStepper.noLocation.createPr.detailsTitle')}
                      </Typography>
                    </Box>

                    <TextField
                      {...asInputRef(
                        register('title', {
                          required: true,
                        }),
                      )}
                      label={t('importStepper.noLocation.createPr.titleLabel')}
                      placeholder={t(
                        'importStepper.noLocation.createPr.titlePlaceholder',
                      )}
                      margin="normal"
                      variant="outlined"
                      fullWidth
                      error={Boolean(formState.errors.title)}
                      required
                    />

                    <TextField
                      {...asInputRef(
                        register('body', {
                          required: true,
                        }),
                      )}
                      label={t('importStepper.noLocation.createPr.bodyLabel')}
                      placeholder={t(
                        'importStepper.noLocation.createPr.bodyPlaceholder',
                      )}
                      margin="normal"
                      variant="outlined"
                      fullWidth
                      error={Boolean(formState.errors.body)}
                      multiline
                      required
                    />

                    <Box marginTop={2}>
                      <Typography variant="h6">
                        {t(
                          'importStepper.noLocation.createPr.configurationTitle',
                        )}
                      </Typography>
                    </Box>

                    <TextField
                      {...asInputRef(
                        register('componentName', { required: true }),
                      )}
                      label={t(
                        'importStepper.noLocation.createPr.componentNameLabel',
                      )}
                      placeholder={t(
                        'importStepper.noLocation.createPr.componentNamePlaceholder',
                      )}
                      margin="normal"
                      variant="outlined"
                      fullWidth
                      error={Boolean(formState.errors.componentName)}
                      required
                    />

                    {!values.useCodeowners && (
                      <AutocompleteTextField
                        name="owner"
                        errors={formState.errors}
                        options={groups || []}
                        loading={groupsLoading}
                        loadingText={t(
                          'importStepper.noLocation.createPr.ownerLoadingText',
                        )}
                        helperText={t(
                          'importStepper.noLocation.createPr.ownerHelperText',
                        )}
                        errorHelperText={t(
                          'importStepper.noLocation.createPr.ownerErrorHelperText',
                        )}
                        textFieldProps={{
                          label: t(
                            'importStepper.noLocation.createPr.ownerLabel',
                          ),
                          placeholder: t(
                            'importStepper.noLocation.createPr.ownerPlaceholder',
                          ),
                        }}
                        rules={{ required: true }}
                        required
                      />
                    )}

                    <FormControlLabel
                      control={
                        <Checkbox
                          {...asInputRef(register('useCodeowners'))}
                          onChange={(_, value) => {
                            if (value) {
                              setValue('owner', '');
                            }
                          }}
                        />
                      }
                      label={
                        <>
                          Use <em>CODEOWNERS</em> file as Entity Owner
                        </>
                      }
                    />
                    <FormHelperText>
                      {t(
                        'importStepper.noLocation.createPr.codeownersHelperText',
                      )}
                    </FormHelperText>
                  </>
                )}
              />
            ),
          };
        },
      };

    default:
      return defaults;
  }
}

export const defaultStepper: StepperProvider = {
  analyze: (state, { apis, t }) => ({
    stepLabel: <StepLabel>{t('importStepper.analyze.title')}</StepLabel>,
    content: (
      <StepInitAnalyzeUrl
        key="analyze"
        analysisUrl={state.analysisUrl}
        onAnalysis={state.onAnalysis}
        disablePullRequest={!apis.catalogImportApi.preparePullRequest}
      />
    ),
  }),

  prepare: (state, { t }) => ({
    stepLabel: (
      <StepLabel
        optional={
          <Typography variant="caption">
            {t('importStepper.prepare.description')}
          </Typography>
        }
      >
        {t('importStepper.prepare.title')}
      </StepLabel>
    ),
    content: <BackButton onClick={state.onGoBack} />,
  }),

  review: (state, { t }) => ({
    stepLabel: <StepLabel>{t('importStepper.review.title')}</StepLabel>,
    content: (
      <StepReviewLocation
        prepareResult={state.prepareResult}
        onReview={state.onReview}
        onGoBack={state.onGoBack}
      />
    ),
  }),

  finish: (state, { t }) => ({
    stepLabel: <StepLabel>{t('importStepper.finish.title')}</StepLabel>,
    content: (
      <StepFinishImportLocation
        prepareResult={state.prepareResult}
        onReset={state.onReset}
      />
    ),
  }),
};
