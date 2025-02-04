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
import {
  mockApis,
  renderInTestApp,
  TestApiProvider,
} from '@backstage/test-utils';
import { scaffolderApiRef } from '@backstage/plugin-scaffolder-react';
import { act, fireEvent, waitFor, within } from '@testing-library/react';
import {
  PermissionApi,
  permissionApiRef,
} from '@backstage/plugin-permission-react';
import { rootRouteRef } from '../../routes';
import { AuthorizeResult } from '@backstage/plugin-permission-common';
import { SWRConfig } from 'swr';
import { entityPresentationApiRef } from '@backstage/plugin-catalog-react';

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
        templateInfo: {
          entityRef: 'template:default/my-template',
          entity: { metadata: { name: 'my-template' } },
        },
      },
    },
  }),
}));

describe('OngoingTask', () => {
  const mockScaffolderApi = {
    cancelTask: jest.fn(),
    getTask: jest.fn().mockImplementation(async () => {}),
  };

  const mockEntityPresentationApi = {
    forEntity: jest.fn().mockReturnValue({
      promise: new Promise(resolve => resolve({ primaryTitle: 'My template' })),
    }),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
  });

  const render = (permissionApi?: PermissionApi) => {
    // SWR used by the usePermission hook needs cache to be reset for each test
    return renderInTestApp(
      <SWRConfig value={{ provider: () => new Map() }}>
        <TestApiProvider
          apis={[
            [scaffolderApiRef, mockScaffolderApi],
            [permissionApiRef, permissionApi || mockApis.permission()],
            [entityPresentationApiRef, mockEntityPresentationApi],
          ]}
        >
          <OngoingTask />
        </TestApiProvider>
      </SWRConfig>,
      { mountedRoutes: { '/': rootRouteRef } },
    );
  };

  it('should render title', async () => {
    const rendered = await render();
    expect(rendered.getByText('My template')).toBeInTheDocument();
  });

  it('should trigger cancel api on "Cancel" click in context menu', async () => {
    const rendered = await render();
    const cancelOptionLabel = 'Cancel';
    const { getByTestId } = rendered;

    await act(async () => {
      fireEvent.click(getByTestId('menu-button'));
    });
    expect(getByTestId('cancel-task')).not.toHaveClass('Mui-disabled');

    await act(async () => {
      const element = getByTestId('cancel-task');
      fireEvent.click(within(element).getByText(cancelOptionLabel));
    });

    expect(mockScaffolderApi.cancelTask).toHaveBeenCalled();
    await act(async () => {
      fireEvent.click(getByTestId('menu-button'));
    });

    await waitFor(() => {
      expect(getByTestId('cancel-task')).toHaveClass('Mui-disabled');
    });
  });

  it('should trigger cancel api on "Cancel" button click', async () => {
    const rendered = await render();
    const cancelOptionLabel = 'Cancel';

    const { getByTestId } = rendered;

    await act(async () => {
      fireEvent.click(getByTestId('menu-button'));
    });
    expect(getByTestId('cancel-button')).not.toHaveClass('Mui-disabled');

    await act(async () => {
      const element = getByTestId('cancel-button');
      fireEvent.click(within(element).getByText(cancelOptionLabel));
    });

    expect(mockScaffolderApi.cancelTask).toHaveBeenCalled();
    await act(async () => {
      fireEvent.click(getByTestId('menu-button'));
    });

    await waitFor(() => {
      expect(getByTestId('cancel-button')).toHaveClass('Mui-disabled');
    });
  });

  it('should initially do not display logs', async () => {
    const rendered = await render();
    await expect(rendered.findByText('Show Logs')).resolves.toBeInTheDocument();
  });

  it('should toggle logs visibility', async () => {
    const rendered = await render();
    await act(async () => {
      const element = await rendered.findByText('Show Logs');
      fireEvent.click(element);
    });

    await expect(rendered.findByText('Hide Logs')).resolves.toBeInTheDocument();
  });

  it('should have cancel and start over buttons be disabled without the proper permissions', async () => {
    const permissionApi = mockApis.permission({
      authorize: AuthorizeResult.DENY,
    });
    const rendered = await render(permissionApi);

    const { getByTestId } = rendered;
    expect(getByTestId('cancel-button')).toHaveClass('Mui-disabled');
    expect(getByTestId('start-over-button')).toHaveClass('Mui-disabled');

    await act(async () => {
      fireEvent.click(getByTestId('menu-button'));
    });
    expect(getByTestId('cancel-task')).toHaveClass('Mui-disabled');
    expect(getByTestId('start-over-task')).toHaveClass('Mui-disabled');
  });
});
