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

import React from 'react';
import {Step, StepLabel, Stepper} from "@material-ui/core";
import {ArgoRolloutCanaryStep, SetWeightStep, PauseStep, AnalysisStep} from "./types";

interface StepsProgressProps {
  currentStepIndex: number;
  aborted: boolean;
  steps: ArgoRolloutCanaryStep[];
  children?: React.ReactNode;
}

const isSetWeightStep = (step: ArgoRolloutCanaryStep): step is SetWeightStep => step.hasOwnProperty('setWeight')

const isPauseStep = (step: ArgoRolloutCanaryStep): step is PauseStep => step.hasOwnProperty('pause')

const isAnalysisStep = (step: ArgoRolloutCanaryStep): step is AnalysisStep => step.hasOwnProperty('analysis')

const createLabelForStep = (step: ArgoRolloutCanaryStep):string => {
  if (isSetWeightStep(step)) {
    return `setWeight ${step.setWeight}%`;
  } else if (isPauseStep(step)) {
    return step.pause.duration === undefined ? "infinite pause" : `pause for ${step.pause.duration}`;
  } else if (isAnalysisStep(step)) {

    return `analysis templates: \n${step.analysis.templates
      .map((t) => `${t.templateName}${t.clusterScope ? " (cluster scoped)" : ''}`)
      .join(',\n')}`;
  } else {
    return 'unknown step'
  }
}

export const StepsProgress = ({
                                currentStepIndex,
  aborted,
                                steps
                              }: StepsProgressProps) => {

  /*
    *  When the Rollout is aborted set the active step to -1
    *  otherwise it appears to always be on the first step
  */
  return (
  <Stepper
    activeStep={aborted ? -1 : currentStepIndex}
    alternativeLabel
  >
    {steps
      .map((step, i) =>
        <Step key={i}>
          <StepLabel>{createLabelForStep(step)}</StepLabel>
        </Step>)
      .concat(
        <Step key={'-1'}>
          <StepLabel>Canary promoted</StepLabel>
        </Step>,
      )}
  </Stepper>
);
};
