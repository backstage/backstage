/*
 * Copyright 2024 The Backstage Authors
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
import { StillTherePrompt, StillTherePromptProps } from './StillTherePrompt';

export default {
  title: 'Data Display/StillTherePrompt',
  component: StillTherePrompt,
};

export const Open = (args: StillTherePromptProps) => (
  <StillTherePrompt {...args} />
);
Open.args = {
  idleTimer: {
    getRemainingTime: () => 1000,
    activate: () => {},
  },
  promptTimeoutMillis: 1000,
  remainingTime: 1000,
  setRemainingTime: () => {},
  open: true,
  setOpen: () => {},
};

export const NotOpen = (args: StillTherePromptProps) => (
  <StillTherePrompt {...args} />
);
NotOpen.args = {
  idleTimer: {
    getRemainingTime: () => 1000,
    activate: () => {},
  },
  promptTimeoutMillis: 1000,
  remainingTime: 1000,
  setRemainingTime: () => {},
  open: false,
  setOpen: () => {},
};
