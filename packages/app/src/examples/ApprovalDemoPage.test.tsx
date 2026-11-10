/*
 * Copyright 2026 The Backstage Authors
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

import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  discoveryApiRef,
  fetchApiRef,
  identityApiRef,
} from '@backstage/core-plugin-api';
import { scaffolderApiRef } from '@backstage/plugin-scaffolder-react';
import { ScaffolderTask } from '@backstage/plugin-scaffolder-common';
import { ApprovalDemoPage } from './ApprovalDemoPage';

const guest = 'user:development/guest';

describe('ApprovalDemoPage', () => {
  let currentTask: ScaffolderTask;
  const scaffold = jest.fn();
  const getTask = jest.fn();
  const fetch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    currentTask = {
      id: 'task-1',
      status: 'waiting',
      createdAt: '2026-11-10T00:00:00Z',
      spec: {
        apiVersion: 'scaffolder.backstage.io/v1beta3',
        parameters: { message: 'Try the approval gate', approver: guest },
        steps: [],
        output: {},
      },
    };
    scaffold.mockResolvedValue({ taskId: currentTask.id });
    getTask.mockImplementation(async () => currentTask);
    fetch.mockImplementation(async () => {
      currentTask = { ...currentTask, status: 'completed' };
      return new Response(null, { status: 200 });
    });
  });

  async function renderPage(path: string, userRef = guest) {
    await renderInTestApp(
      <TestApiProvider
        apis={[
          [scaffolderApiRef, { scaffold, getTask }],
          [fetchApiRef, { fetch }],
          [
            discoveryApiRef,
            { getBaseUrl: async () => 'http://localhost:7008/api/scaffolder' },
          ],
          [
            identityApiRef,
            {
              getBackstageIdentity: async () => ({
                type: 'user' as const,
                userEntityRef: userRef,
                ownershipEntityRefs: [userRef],
              }),
            },
          ],
        ]}
      >
        <ApprovalDemoPage />
      </TestApiProvider>,
      { routeEntries: [path] },
    );
  }

  it('starts a session and continues after guest approval', async () => {
    const user = userEvent.setup();
    await renderPage('/approval-demo');
    await user.click(
      screen.getByRole('button', { name: 'Start approval session' }),
    );
    expect(scaffold).toHaveBeenCalledWith({
      templateRef: 'template:default/approval-gate-demo',
      values: { message: 'Try the approval gate', approver: guest },
    });
    expect(await screen.findByText('Waiting for approval')).toBeInTheDocument();
    expect(
      screen.getByText('Request: Try the approval gate'),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Open notifications' }),
    ).toHaveAttribute('href', '/notifications');
    await user.click(
      screen.getByRole('button', { name: 'Approve and continue' }),
    );
    expect(
      await screen.findByText('Workflow continued after approval'),
    ).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:7008/api/scaffolder/v2/tasks/task-1/resume',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: 'approval',
          triggerId: 'decision',
          payload: { decision: 'approved' },
        }),
      },
    );
    expect(
      screen.getByRole('button', { name: 'Approve and continue' }),
    ).toBeDisabled();
  });

  it('opens notification links and keeps another account from approving', async () => {
    await renderPage('/approval-demo?taskId=task-1', 'user:development/other');
    expect(
      await screen.findByText('Another account must approve'),
    ).toBeInTheDocument();
    expect(getTask).toHaveBeenCalledWith('task-1');
    expect(
      screen.getByRole('button', { name: 'Approve and continue' }),
    ).toBeDisabled();
    expect(fetch).not.toHaveBeenCalled();
  });

  it('shows a permission denial without reporting that the workflow continued', async () => {
    fetch.mockResolvedValue(
      new Response(
        JSON.stringify({
          error: { name: 'NotAllowedError', message: 'Approval denied' },
        }),
        { status: 403 },
      ),
    );
    const user = userEvent.setup();
    await renderPage('/approval-demo?taskId=task-1');
    await screen.findByText('Waiting for approval');
    await user.click(
      screen.getByRole('button', { name: 'Approve and continue' }),
    );
    expect(await screen.findByText('The request failed')).toBeInTheDocument();
    expect(screen.getByText('Waiting for approval')).toBeInTheDocument();
    expect(
      screen.queryByText('Workflow continued after approval'),
    ).not.toBeInTheDocument();
    expect(currentTask.status).toBe('waiting');
  });
});
