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
import { TextField } from '@material-ui/core';
import { BasicVerticalStepper, BasicVerticalStep } from '.';

export default {
  title: 'BasicVerticalStepper',
  component: BasicVerticalStepper,
};

export const Basic = () => (
  <BasicVerticalStepper>
    <BasicVerticalStep title="Step 1">
      <div>This is the content for step 1</div>
    </BasicVerticalStep>
    <BasicVerticalStep title="Step 2">
      <div>This is the content for step 2</div>
    </BasicVerticalStep>
    <BasicVerticalStep title="Step 3">
      <div>This is the content for step 3</div>
    </BasicVerticalStep>
  </BasicVerticalStepper>
);

export const ConditionalButtons = () => {
  const [required, setRequired] = useState(false);

  return (
    <BasicVerticalStepper>
      <BasicVerticalStep
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
      </BasicVerticalStep>
      <BasicVerticalStep title="Step 2">
        <div>This is the content for step 2</div>
      </BasicVerticalStep>
      <BasicVerticalStep title="Step 3">
        <div>This is the content for step 3</div>
      </BasicVerticalStep>
    </BasicVerticalStepper>
  );
};

export const CompletionStep = () => {
  return (
    <BasicVerticalStepper>
      <BasicVerticalStep title="Step 1">
        <div>This is the content for step 1</div>
      </BasicVerticalStep>
      <BasicVerticalStep title="Step 2">
        <div>This is the content for step 2</div>
      </BasicVerticalStep>
      <BasicVerticalStep title="Success!" end>
        <div>You've completed the Stepper</div>
      </BasicVerticalStep>
    </BasicVerticalStepper>
  );
};
