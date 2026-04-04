/*
 * Copyright 2026 Estehsan Tariq
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

import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderInTestApp, TestApiRegistry } from '@backstage/test-utils';
import { ApiProvider } from '@backstage/core-app-api';
import { identityApiRef } from '@backstage/core-plugin-api';
import { scaffolderApiRef } from '@backstage/plugin-scaffolder-react';
import { rootRouteRef } from '../../routes';
import { onboardingApiRef, OnboardingApi } from '../../api/OnboardingApi';
import { OnboardingPage } from './OnboardingPage';
import {
  OnboardingProgress,
  OnboardingTemplate,
} from '../../types';

const mockTemplate: OnboardingTemplate = {
  apiVersion: 'onboarding.backstage.io/v1',
  kind: 'OnboardingTemplate',
  metadata: {
    name: 'backend-engineer-platform',
    title: 'Backend Engineer — Platform Team',
    description: 'Standard onboarding for backend engineers',
  },
  spec: {
    role: 'backend-engineer',
    team: 'platform',
    phases: [
      {
        id: 'day1',
        tasks: [
          {
            id: 'setup-laptop',
            phase: 'day1',
            title: 'Set up laptop & dev environment',
            description: 'Run the bootstrap script.',
            type: 'automated',
            automationRef: 'setup-dev-environment',
            assignee: 'self',
            duePhase: 'day1',
          },
          {
            id: 'meet-buddy',
            phase: 'day1',
            title: 'Meet your onboarding buddy',
            description: '30-min intro call.',
            type: 'manual',
            assignee: 'buddy',
            duePhase: 'day1',
          },
        ],
      },
      {
        id: 'week1',
        tasks: [
          {
            id: 'security-training',
            phase: 'week1',
            title: 'Complete security training',
            description: 'Required before production access.',
            type: 'manual',
            assignee: 'self',
            duePhase: 'week1',
          },
          {
            id: 'oncall-shadow',
            phase: 'week1',
            title: 'Shadow an on-call shift',
            description: 'Join the current on-call engineer.',
            type: 'manual',
            assignee: 'buddy',
            dependsOn: ['security-training'],
            duePhase: 'week1',
          },
        ],
      },
    ],
  },
};

const mockProgress: OnboardingProgress = {
  userId: 'user:default/testuser',
  templateName: 'backend-engineer-platform',
  startDate: new Date().toISOString(),
  tasks: [
    { taskId: 'setup-laptop', status: 'pending' },
    { taskId: 'meet-buddy', status: 'done', completedAt: new Date().toISOString() },
    { taskId: 'security-training', status: 'pending' },
    { taskId: 'oncall-shadow', status: 'pending' },
  ],
};

const mockOnboardingApi: jest.Mocked<OnboardingApi> = {
  getProgress: jest.fn(),
  updateTaskStatus: jest.fn(),
  getTeamStats: jest.fn(),
  getTemplates: jest.fn(),
  assignTemplate: jest.fn(),
};

const mockIdentityApi = {
  getBackstageIdentity: jest.fn().mockResolvedValue({
    type: 'user',
    userEntityRef: 'user:default/testuser',
    ownershipEntityRefs: [],
  }),
  getCredentials: jest.fn().mockResolvedValue({}),
  getProfileInfo: jest.fn().mockResolvedValue({
    displayName: 'Test User',
    email: 'test@example.com',
  }),
  signOut: jest.fn(),
};

const mockScaffolderApi = {
  scaffold: jest.fn(),
  getTask: jest.fn(),
  getIntegrationsList: jest.fn(),
  getTemplateParameterSchema: jest.fn(),
  streamLogs: jest.fn(),
  listActions: jest.fn(),
  listTasks: jest.fn(),
  cancelTask: jest.fn(),
};

const apis = TestApiRegistry.from(
  [onboardingApiRef, mockOnboardingApi],
  [identityApiRef, mockIdentityApi],
  [scaffolderApiRef, mockScaffolderApi],
);

describe('OnboardingPage', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mockIdentityApi.getBackstageIdentity.mockResolvedValue({
      type: 'user',
      userEntityRef: 'user:default/testuser',
      ownershipEntityRefs: [],
    });
    mockOnboardingApi.getProgress.mockResolvedValue(mockProgress);
    mockOnboardingApi.getTemplates.mockResolvedValue([mockTemplate]);
  });

  it('renders the page with tabs and task list', async () => {
    await renderInTestApp(
      <ApiProvider apis={apis}>
        <OnboardingPage />
      </ApiProvider>,
      {
        mountedRoutes: {
          '/onboarding': rootRouteRef,
        },
      },
    );

    expect(await screen.findByText('Developer Onboarding')).toBeInTheDocument();
    expect(screen.getByText('My Tasks')).toBeInTheDocument();
    expect(screen.getByText('Team View')).toBeInTheDocument();
    expect(screen.getByText('Templates')).toBeInTheDocument();

    expect(await screen.findByText('1 of 4 tasks complete')).toBeInTheDocument();

    expect(screen.getAllByText('Day 1').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Week 1').length).toBeGreaterThan(0);
    expect(screen.getByText('Set up laptop & dev environment')).toBeInTheDocument();
    expect(screen.getByText('Meet your onboarding buddy')).toBeInTheDocument();
    expect(screen.getByText('Complete security training')).toBeInTheDocument();
    expect(screen.getByText('Shadow an on-call shift')).toBeInTheDocument();
  });

  it('shows progress bar with correct percentage', async () => {
    await renderInTestApp(
      <ApiProvider apis={apis}>
        <OnboardingPage />
      </ApiProvider>,
      {
        mountedRoutes: {
          '/onboarding': rootRouteRef,
        },
      },
    );

    expect(await screen.findByText('25%')).toBeInTheDocument();
    expect(screen.getByText('1 of 4 tasks complete')).toBeInTheDocument();
  });

  it('calls updateTaskStatus when a task checkbox is toggled', async () => {
    const updatedProgress = {
      ...mockProgress,
      tasks: mockProgress.tasks.map(t =>
        t.taskId === 'security-training'
          ? { ...t, status: 'done' as const, completedAt: new Date().toISOString() }
          : t,
      ),
    };
    mockOnboardingApi.updateTaskStatus.mockResolvedValue(updatedProgress);

    await renderInTestApp(
      <ApiProvider apis={apis}>
        <OnboardingPage />
      </ApiProvider>,
      {
        mountedRoutes: {
          '/onboarding': rootRouteRef,
        },
      },
    );

    await screen.findByText('Complete security training');

    const checkboxes = screen.getAllByRole('checkbox');
    const securityCheckbox = checkboxes.find(
      cb => cb.getAttribute('aria-label') === 'Mark "Complete security training" as complete',
    );
    expect(securityCheckbox).toBeDefined();

    await userEvent.click(securityCheckbox!);

    expect(mockOnboardingApi.updateTaskStatus).toHaveBeenCalledWith(
      'user:default/testuser',
      'security-training',
      'done',
    );
  });

  it('shows locked state for tasks with unmet dependencies', async () => {
    await renderInTestApp(
      <ApiProvider apis={apis}>
        <OnboardingPage />
      </ApiProvider>,
      {
        mountedRoutes: {
          '/onboarding': rootRouteRef,
        },
      },
    );

    await screen.findByText('Shadow an on-call shift');

    const lockIcons = document.querySelectorAll('[class*="lockIcon"]');
    expect(lockIcons.length).toBeGreaterThan(0);

    const oncallCheckbox = screen.getAllByRole('checkbox').find(
      cb => cb.getAttribute('aria-label') === 'Mark "Shadow an on-call shift" as complete',
    );
    expect(oncallCheckbox).toBeDisabled();
  });

  it('shows empty state when no progress exists', async () => {
    mockOnboardingApi.getProgress.mockRejectedValue(
      new Error('Not found'),
    );
    mockOnboardingApi.getTemplates.mockResolvedValue([]);

    await renderInTestApp(
      <ApiProvider apis={apis}>
        <OnboardingPage />
      </ApiProvider>,
      {
        mountedRoutes: {
          '/onboarding': rootRouteRef,
        },
      },
    );

    expect(
      await screen.findByText(/No onboarding checklist assigned/),
    ).toBeInTheDocument();
  });
});
