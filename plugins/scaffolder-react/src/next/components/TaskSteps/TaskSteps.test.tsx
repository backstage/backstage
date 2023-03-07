/*
 * Copyright 2023 The Backstage Authors
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
import { TaskSteps } from './TaskSteps';
import { renderInTestApp } from '@backstage/test-utils';
import { ScaffolderTaskStatus } from '../../../api';

describe('TaskSteps', () => {
  it('should render each of the steps', async () => {
    const steps = [
      {
        id: '1',
        name: 'Step 1',
        status: 'processing' as ScaffolderTaskStatus,
        startedAt: Date.now().toLocaleString(),
        action: 'create',
      },
      {
        id: '2',
        name: 'Step 2',
        status: 'failed' as ScaffolderTaskStatus,

        startedAt: Date.now().toLocaleString(),
        endedAt: Date.now().toLocaleString(),
        action: 'create',
      },
      {
        id: '3',
        name: 'Step 3',
        status: 'completed' as ScaffolderTaskStatus,
        startedAt: Date.now().toLocaleString(),
        endedAt: Date.now().toLocaleString(),
        action: 'create',
      },
      {
        id: '4',
        name: 'Step 4',
        status: 'skipped' as ScaffolderTaskStatus,
        startedAt: Date.now().toLocaleString(),
        endedAt: Date.now().toLocaleString(),
        action: 'create',
      },
    ];

    const { getByText } = await renderInTestApp(<TaskSteps steps={steps} />);

    for (const step of steps) {
      expect(getByText(step.name)).toBeInTheDocument();
    }
  });
});
