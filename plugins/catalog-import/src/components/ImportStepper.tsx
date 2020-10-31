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
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import { StepContent } from '@material-ui/core';

type Props = {
  steps: { step: string; content: React.ReactNode }[];
  activeStep: number;
  nextStep: (options?: { reset: boolean }) => void;
};

export default function ImportStepper({ steps, activeStep }: Props) {
  return (
    <Stepper activeStep={activeStep} orientation="vertical">
      {steps.map(({ step }) => {
        const stepProps: { completed?: boolean } = {};
        return (
          <Step key={step} {...stepProps}>
            <StepLabel>{step}</StepLabel>
            <StepContent>{steps[activeStep].content}</StepContent>
          </Step>
        );
      })}
    </Stepper>
  );
}
