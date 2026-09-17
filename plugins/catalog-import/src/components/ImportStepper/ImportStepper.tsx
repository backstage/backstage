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

import { InfoCard, InfoCardVariants } from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';
import { TranslationFunction } from '@backstage/core-plugin-api/alpha';
import { useTranslationRef } from '@backstage/frontend-plugin-api';
import { catalogImportTranslationRef } from '@backstage/plugin-catalog-import/alpha';
import Step from '@material-ui/core/Step';
import StepContent from '@material-ui/core/StepContent';
import Stepper from '@material-ui/core/Stepper';
import { makeStyles } from '@material-ui/core/styles';
import { useMemo } from 'react';

import { catalogImportApiRef } from '../../api';
import { ImportFlows, ImportState, useImportState } from '../useImportState';
import {
  defaultGenerateStepper,
  defaultStepper,
  StepConfiguration,
  StepperProvider,
} from './defaults';

const useStyles = makeStyles(() => ({
  stepperRoot: {
    padding: 0,
  },
}));

/**
 * Props for {@link ImportStepper}.
 *
 * @public
 */
export interface ImportStepperProps {
  initialUrl?: string;
  generateStepper?: (
    flow: ImportFlows,
    defaults: StepperProvider,
    t: TranslationFunction<typeof catalogImportTranslationRef.T>,
  ) => StepperProvider;
  variant?: InfoCardVariants;
}

/**
 * The stepper that holds the different import stages.
 *
 * @public
 */
export const ImportStepper = (props: ImportStepperProps) => {
  const { t } = useTranslationRef(catalogImportTranslationRef);
  const {
    initialUrl,
    generateStepper = defaultGenerateStepper,
    variant,
  } = props;

  const catalogImportApi = useApi(catalogImportApiRef);
  const classes = useStyles();
  const state = useImportState({ initialUrl });

  const states = useMemo<StepperProvider>(
    () => generateStepper(state.activeFlow, defaultStepper, t),
    [generateStepper, state.activeFlow, t],
  );

  const render = (step: StepConfiguration) => {
    return (
      <Step>
        {step.stepLabel}
        <StepContent>{step.content}</StepContent>
      </Step>
    );
  };

  return (
    <InfoCard variant={variant}>
      <Stepper
        classes={{ root: classes.stepperRoot }}
        activeStep={state.activeStepNumber}
        orientation="vertical"
      >
        {render(
          states.analyze(
            state as Extract<ImportState, { activeState: 'analyze' }>,
            { apis: { catalogImportApi }, t },
          ),
        )}
        {render(
          states.prepare(
            state as Extract<ImportState, { activeState: 'prepare' }>,
            { apis: { catalogImportApi }, t },
          ),
        )}
        {render(
          states.review(
            state as Extract<ImportState, { activeState: 'review' }>,
            { apis: { catalogImportApi }, t },
          ),
        )}
        {render(
          states.finish(
            state as Extract<ImportState, { activeState: 'finish' }>,
            { apis: { catalogImportApi }, t },
          ),
        )}
      </Stepper>
    </InfoCard>
  );
};
