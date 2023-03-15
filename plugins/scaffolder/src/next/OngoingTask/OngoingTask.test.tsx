/*
 * Copyright 2022 The Backstage Authors
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

import { OngoingTask } from './OngoingTask';
import React from 'react';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import { scaffolderApiRef } from '@backstage/plugin-scaffolder-react';
import { act, fireEvent, waitFor } from '@testing-library/react';
import { nextRouteRef } from '../routes';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ taskId: 'my-task' }),
}));

jest.mock('@backstage/plugin-scaffolder-react', () => ({
  ...jest.requireActual('@backstage/plugin-scaffolder-react'),
  useTaskEventStream: () => ({
    cancelled: false,
    loading: true,
    stepLogs: {},
    completed: false,
    steps: {},
    task: {
      spec: {
        steps: [],
        templateInfo: { entity: { metadata: { name: 'my-template' } } },
      },
    },
  }),
}));

describe('OngoingTask', () => {
  const mockScaffolderApi = {
    cancelTask: jest.fn(),
    getTask: jest.fn().mockImplementation(async () => {}),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should trigger cancel api on "Cancel" click in context menu', async () => {
    const cancelOptionLabel = 'Cancel';
    const rendered = await renderInTestApp(
      <TestApiProvider apis={[[scaffolderApiRef, mockScaffolderApi]]}>
        <OngoingTask />
      </TestApiProvider>,
      { mountedRoutes: { '/': nextRouteRef } },
    );
    const { getByText, getByTestId } = rendered;

    await act(async () => {
      fireEvent.click(getByTestId('menu-button'));
    });
    expect(getByTestId('cancel-task')).not.toHaveClass('Mui-disabled');

    await act(async () => {
      fireEvent.click(getByText(cancelOptionLabel));
    });

    expect(mockScaffolderApi.cancelTask).toHaveBeenCalled();
    await act(async () => {
      fireEvent.click(getByTestId('menu-button'));
    });

    await waitFor(() => {
      expect(getByTestId('cancel-task')).toHaveClass('Mui-disabled');
    });
  });
});
