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
import Sequence, { StepType } from '.';

export default {
  title: 'Sequence',
  component: Sequence,
};

const steps = [
  {
    title: 'Step 1!',
    content: <div>Slide 1 content</div>,
  },
  {
    title: 'Step 2!',
    content: <div>Slide 2 content</div>,
  },
  {
    title: 'Step 3!',
    content: <div>Slide 3 content</div>,
  },
];

export const Horizontal = () => (
  <Sequence steps={steps} orientation="horizontal" />
);

export const Vertical = () => <Sequence steps={steps} orientation="vertical" />;

export const ConditionalButtons = () => {
  const [required, setRequired] = useState(false);
  const customSteps: StepType[] = [...steps];

  customSteps[0] = {
    title: 'Step 1 with required field',
    actions: {
      canNext: () => required,
    },
    content: (
      <div>
        <TextField
          variant="outlined"
          placeholder="Required*"
          onChange={e => setRequired(!!e.target.value)}
        />
      </div>
    ),
  };
  return <Sequence steps={customSteps} orientation="vertical" />;
};

export const CompletionStep = () => {
  const completed = {
    title: 'Succcess!',
    content: <div>You've completed the sequence</div>,
  };
  return (
    <Sequence
      steps={steps.slice(0, 1)}
      completed={completed}
      orientation="vertical"
    />
  );
};
