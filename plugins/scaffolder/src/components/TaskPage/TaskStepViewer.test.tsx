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
import { TaskStepViewer } from './TaskStepViewer';
import React from 'react';
import { renderInTestApp } from '@backstage/test-utils';
import { TaskStream } from '../hooks/useEventStream';
import { waitFor } from '@testing-library/react';

describe('TaskStepViewer', () => {
  beforeEach(() => {});

  afterEach(() => {
    jest.resetAllMocks();
  });

  const originalOffsetHeight = Object.getOwnPropertyDescriptor(
    HTMLElement.prototype,
    'offsetHeight',
  ) as PropertyDescriptor & ThisType<any>;

  const originalOffsetWidth = Object.getOwnPropertyDescriptor(
    HTMLElement.prototype,
    'offsetWidth',
  ) as PropertyDescriptor & ThisType<any>;

  beforeAll(() => {
    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
      configurable: true,
      value: 50,
    });
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
      configurable: true,
      value: 50,
    });
  });

  afterAll(() => {
    Object.defineProperty(
      HTMLElement.prototype,
      'offsetHeight',
      originalOffsetHeight,
    );
    Object.defineProperty(
      HTMLElement.prototype,
      'offsetWidth',
      originalOffsetWidth,
    );
  });

  it('should display logs and no errors', async () => {
    const taskStream = {
      stepLogs: {
        1: ['executing command X'],
      },
      loading: false,
      completed: false,
      steps: {},
    } as TaskStream;
    const { getByText } = await renderInTestApp(
      <TaskStepViewer
        currentStepId="1"
        taskStream={taskStream}
        loadingText="loading..."
      />,
    );

    await waitFor(() => {
      expect(getByText(/executing command X/)).toBeInTheDocument();
    });
  });

  it('should display errors', async () => {
    const taskStream = {
      error: Error('You do not have enough permissions to run this command'),
      stepLogs: {
        1: ['executing'],
      },
      loading: false,
      completed: false,
      steps: {},
    } as TaskStream;
    const { getByText } = await renderInTestApp(
      <TaskStepViewer
        currentStepId="1"
        taskStream={taskStream}
        loadingText="loading..."
      />,
    );

    await waitFor(() => {
      expect(
        getByText(/You do not have enough permissions to run this command/),
      ).toBeInTheDocument();
      expect(getByText(/executing/)).toBeInTheDocument();
    });
  });
});
