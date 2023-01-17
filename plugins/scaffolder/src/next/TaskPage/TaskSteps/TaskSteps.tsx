/*
 * Copyright 2022 The Backstage Authors
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
import {
  Stepper as MuiStepper,
  Step as MuiStep,
  StepButton as MuiStepButton,
  StepLabel as MuiStepLabel,
  StepIconProps,
} from '@material-ui/core';
import { TaskStep } from '@backstage/plugin-scaffolder-common';
import { Step } from '../../../components/hooks/useEventStream';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';

interface StepperProps {
  steps: (TaskStep & Step)[];
  activeStep?: number;
  setActiveStep?: (step: number) => void;
}

export const TaskSteps = (props: StepperProps) => {
  return (
    <MuiStepper
      activeStep={props.activeStep}
      alternativeLabel
      variant="elevation"
    >
      {props.steps.map((step, index) => {
        const isCompleted = step.status === 'completed';
        const isFailed = step.status === 'failed';
        const isActive = step.status === 'processing';
        const isSkipped = step.status === 'skipped';
        const stepIconProps: Partial<StepIconProps> = {
          completed: isCompleted,
          error: isFailed,
          active: isActive,
        };

        if (isSkipped) {
          stepIconProps.icon = <RemoveCircleOutlineIcon />;
        }

        return (
          <MuiStep key={index}>
            <MuiStepButton>
              <MuiStepLabel StepIconProps={stepIconProps}>
                {step.name}
              </MuiStepLabel>
            </MuiStepButton>
          </MuiStep>
        );
      })}
    </MuiStepper>
  );
};
