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
  Box,
  Paper,
} from '@material-ui/core';
import { TaskStep } from '@backstage/plugin-scaffolder-common';
import { StepIcon } from './StepIcon';
import { StepTime } from './StepTime';
import { TaskBorder } from './TaskBorder';
import { ScaffolderStep } from '@backstage/plugin-scaffolder-react';

/**
 * Props for the TaskSteps component
 *
 * @alpha
 */
export interface TaskStepsProps {
  steps: (TaskStep & ScaffolderStep)[];
  activeStep?: number;
  isComplete?: boolean;
  isError?: boolean;
}

/**
 * The visual stepper of the task event stream
 *
 * @alpha
 */
export const TaskSteps = (props: TaskStepsProps) => {
  return (
    <Paper style={{ position: 'relative', overflow: 'hidden' }}>
      <TaskBorder
        isComplete={props.isComplete ?? false}
        isError={props.isError ?? false}
      />
      <Box padding={2}>
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
            const stepIconProps: Partial<StepIconProps & { skipped: boolean }> =
              {
                completed: isCompleted,
                error: isFailed,
                active: isActive,
                skipped: isSkipped,
              };

            return (
              <MuiStep key={index}>
                <MuiStepButton>
                  <MuiStepLabel
                    StepIconProps={stepIconProps}
                    StepIconComponent={StepIcon}
                  >
                    <Box>{step.name}</Box>
                    <StepTime step={step} />
                  </MuiStepLabel>
                </MuiStepButton>
              </MuiStep>
            );
          })}
        </MuiStepper>
      </Box>
    </Paper>
  );
};
