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
  it('should only show timer for in progress, failed, and completed steps', async () => {
    const steps = [
      {
        id: '1',
        name: 'Fail',
        status: 'failed' as ScaffolderTaskStatus,

        startedAt: Date.now().toLocaleString(),
        endedAt: Date.now().toLocaleString(),
        action: 'action1',
      },
      {
        id: '2',
        name: 'Process',
        status: 'processing' as ScaffolderTaskStatus,
        startedAt: Date.now().toLocaleString(),
        action: 'action2',
      },
      {
        id: '3',
        name: 'Complete',
        status: 'completed' as ScaffolderTaskStatus,
        startedAt: Date.now().toLocaleString(),
        endedAt: Date.now().toLocaleString(),
        action: 'action3',
      },
      {
        id: '4',
        name: 'Skip',
        status: 'skipped' as ScaffolderTaskStatus,
        startedAt: Date.now().toLocaleString(),
        action: 'action4',
      },
      {
        id: '5',
        name: 'Not Started',
        status: 'open' as ScaffolderTaskStatus,
        action: 'action5',
      },
    ];

    const screen = await renderInTestApp(<TaskSteps steps={steps} />);
    const stepLabels = await screen.findAllByTestId('step-label');
    expect(stepLabels.length).toBe(steps.length);
    for (let i = 0; i < steps.length; i++) {
      expect(stepLabels[i].textContent?.startsWith(steps[i].name)).toBe(true);
      expect(stepLabels[i].textContent?.endsWith('seconds')).toBe(
        steps[i].status !== 'skipped' && !!steps[i].startedAt,
      );
    }
  });
});
