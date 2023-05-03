/*
 * Copyright 2020 The Backstage Authors
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

import TextField from '@material-ui/core/TextField';
import React, { useState } from 'react';
import { SimpleStepper, StepperProps } from './SimpleStepper';
import { SimpleStepperStep } from './SimpleStepperStep';

export default {
  title: 'Navigation/SimpleStepper',
  component: SimpleStepper,
};

const defaultArgs = {
  elevated: false,
  activeStep: 0,
};

export const Default = (args: StepperProps) => (
  <SimpleStepper {...args}>
    <SimpleStepperStep title="Step 1">
      <div>This is the content for step 1</div>
    </SimpleStepperStep>
    <SimpleStepperStep title="Step 2">
      <div>This is the content for step 2</div>
    </SimpleStepperStep>
    <SimpleStepperStep title="Step 3">
      <div>This is the content for step 3</div>
    </SimpleStepperStep>
  </SimpleStepper>
);

Default.args = defaultArgs;

export const ConditionalButtons = (args: StepperProps) => {
  const [required, setRequired] = useState(false);

  return (
    <SimpleStepper {...args}>
      <SimpleStepperStep
        title="Step 1 with required field"
        actions={{
          canNext: () => required,
        }}
      >
        <TextField
          variant="outlined"
          placeholder="Required*"
          onChange={e => setRequired(!!e.target.value)}
        />
      </SimpleStepperStep>
      <SimpleStepperStep title="Step 2">
        <div>This is the content for step 2</div>
      </SimpleStepperStep>
      <SimpleStepperStep title="Step 3">
        <div>This is the content for step 3</div>
      </SimpleStepperStep>
    </SimpleStepper>
  );
};

ConditionalButtons.args = defaultArgs;

export const CompletionStep = (args: StepperProps) => {
  return (
    <SimpleStepper {...args}>
      <SimpleStepperStep title="Step 1">
        <div>This is the content for step 1</div>
      </SimpleStepperStep>
      <SimpleStepperStep title="Step 2">
        <div>This is the content for step 2</div>
      </SimpleStepperStep>
      <SimpleStepperStep title="Success!" end>
        <div>You've completed the Stepper</div>
      </SimpleStepperStep>
    </SimpleStepper>
  );
};

CompletionStep.args = defaultArgs;

export const OptionalStep = (args: StepperProps) => {
  return (
    <SimpleStepper {...args}>
      <SimpleStepperStep
        title="Step 1 (Optional)"
        actions={{
          showSkip: true,
        }}
      >
        <div>This is the content for step 1</div>
      </SimpleStepperStep>
      <SimpleStepperStep title="Step 2">
        <div>This is the content for step 2</div>
      </SimpleStepperStep>
    </SimpleStepper>
  );
};

ConditionalButtons.args = defaultArgs;
