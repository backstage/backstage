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
import { ErrorPanel, ErrorPanelProps } from './ErrorPanel';

export default {
  title: 'Feedback/ErrorPanel',
  component: ErrorPanel,
};

export const Expanded = (args: ErrorPanelProps) => <ErrorPanel {...args} />;

Expanded.args = {
  error: new Error('Error Message'),
  title: 'Title of error',
  defaultExpanded: true,
};

export const Collapsed = (args: ErrorPanelProps) => <ErrorPanel {...args} />;

Collapsed.args = {
  error: new Error('Error Message'),
  title: 'Title of error',
  defaultExpanded: false,
};

export const WithChildren = (args: ErrorPanelProps) => (
  <ErrorPanel {...args}>
    <div>Child 1</div>
    <div>Child 2</div>
  </ErrorPanel>
);

WithChildren.args = {
  error: new Error('Error Message'),
  title: 'Title of error',
  defaultExpanded: true,
};
