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

import { screen, render } from '@testing-library/react';
import { TaskItem, TaskItemProps } from './TaskItem';
import { OnboardingTask } from '../../types';

const baseTask: OnboardingTask = {
  id: 'test-task',
  phase: 'day1',
  title: 'Test Task Title',
  description: 'Test task description text',
  type: 'manual',
  assignee: 'self',
  duePhase: 'day1',
};

const automatedTask: OnboardingTask = {
  ...baseTask,
  id: 'auto-task',
  title: 'Automated Task',
  description: 'This task runs automatically',
  type: 'automated',
  automationRef: 'run-setup',
};

const taskWithLink: OnboardingTask = {
  ...baseTask,
  id: 'link-task',
  title: 'Task With Link',
  link: { label: 'Open guide', url: 'https://docs.internal/guide' },
};

const taskWithDeps: OnboardingTask = {
  ...baseTask,
  id: 'dep-task',
  title: 'Dependent Task',
  dependsOn: ['prerequisite-task'],
};

function renderTaskItem(overrides: Partial<TaskItemProps> = {}) {
  const defaultProps: TaskItemProps = {
    task: baseTask,
    status: 'pending',
    locked: false,
    onToggle: jest.fn(),
    ...overrides,
  };
  return render(<TaskItem {...defaultProps} />);
}

describe('TaskItem', () => {
  it('renders task title, description, and badges in pending state', () => {
    renderTaskItem();

    expect(screen.getByText('Test Task Title')).toBeInTheDocument();
    expect(screen.getByText('Test task description text')).toBeInTheDocument();
    expect(screen.getByText('Day 1')).toBeInTheDocument();
    expect(screen.getByText('Manual')).toBeInTheDocument();

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
    expect(checkbox).not.toBeDisabled();
  });

  it('renders done state with strikethrough and checked checkbox', () => {
    renderTaskItem({ status: 'done' });

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();

    const title = screen.getByText('Test Task Title');
    expect(title).toHaveStyle('text-decoration: line-through');
  });

  it('renders blocked state with blocked badge and red border', () => {
    const { container } = renderTaskItem({ status: 'blocked' });

    expect(screen.getByText('Blocked')).toBeInTheDocument();

    const root = container.querySelector('[class*="blocked"]');
    expect(root).toBeTruthy();
  });

  it('renders locked state with disabled checkbox and lock icon', () => {
    renderTaskItem({
      task: taskWithDeps,
      locked: true,
      lockedByNames: ['Prerequisite Task'],
    });

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeDisabled();
  });

  it('renders automated task with type badge and status chip', () => {
    renderTaskItem({ task: automatedTask, status: 'in-progress' });

    expect(screen.getByText('Automated')).toBeInTheDocument();
    expect(screen.getByText('Running')).toBeInTheDocument();
  });

  it('renders link button when task has a link', () => {
    renderTaskItem({ task: taskWithLink });

    const linkBtn = screen.getByLabelText('Open guide');
    expect(linkBtn).toBeInTheDocument();
    expect(linkBtn.closest('a')).toHaveAttribute(
      'href',
      'https://docs.internal/guide',
    );
  });

  it('renders assignee avatar with correct initials', () => {
    renderTaskItem({ task: { ...baseTask, assignee: 'buddy' } });
    expect(screen.getByText('BD')).toBeInTheDocument();

    renderTaskItem({ task: { ...baseTask, assignee: 'manager' } });
    expect(screen.getByText('MG')).toBeInTheDocument();
  });

  it('calls onToggle when checkbox is clicked', async () => {
    const onToggle = jest.fn();
    renderTaskItem({ onToggle });

    const checkbox = screen.getByRole('checkbox');
    checkbox.click();

    expect(onToggle).toHaveBeenCalledWith('test-task');
  });

  it('does not call onToggle when locked', () => {
    const onToggle = jest.fn();
    renderTaskItem({ locked: true, onToggle });

    const checkbox = screen.getByRole('checkbox');
    checkbox.click();

    expect(onToggle).not.toHaveBeenCalled();
  });
});
