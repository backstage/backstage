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
import { ResponseErrorPanel } from '../ResponseErrorPanel';
import { ErrorPanelProps } from '../ErrorPanel';

export default {
  title: 'Data Display/ResponseErrorPanel',
  component: ResponseErrorPanel,
};

export const Default = (args: ErrorPanelProps) => (
  <ResponseErrorPanel {...args} />
);
Default.args = {
  error: new Error('Error message from error object'),
  defaultExpanded: false,
};

export const WithTitle = (args: ErrorPanelProps) => (
  <ResponseErrorPanel {...args} />
);
WithTitle.args = {
  error: new Error('test'),
  defaultExpanded: false,
  title: 'Title prop is passed',
};
