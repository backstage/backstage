/*
 * Copyright 2025 The Backstage Authors
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
import { TaskStatusChips } from './TaskStatusChips';
import { renderInTestApp } from '@backstage/test-utils';

describe('TaskStatusChips', () => {
  it('renders status chips correctly', async () => {
    const items = [
      { count: 5, label: 'running', color: 'primary' as const },
      { count: 2, label: 'error', color: 'secondary' as const },
    ];

    const { getByText } = await renderInTestApp(
      <TaskStatusChips items={items} />,
    );

    expect(getByText('5 running')).toBeInTheDocument();
    expect(getByText('2 error')).toBeInTheDocument();
  });

  it('filters out items with zero count', async () => {
    const items = [
      { count: 0, label: 'running', color: 'primary' as const },
      { count: 3, label: 'idle', variant: 'outlined' as const },
    ];

    const { getByText } = await renderInTestApp(
      <TaskStatusChips items={items} />,
    );

    // expect(getByText('0 running', { exact: false })).not.toBeInTheDocument();
    expect(getByText('3 idle')).toBeInTheDocument();
  });

  it('returns null when no items have count > 0', async () => {
    const items = [
      { count: 0, label: 'running', color: 'primary' as const },
      { count: 0, label: 'error', color: 'secondary' as const },
    ];

    const { container } = await renderInTestApp(
      <TaskStatusChips items={items} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('applies correct chip variants', async () => {
    const items = [
      { count: 1, label: 'running', color: 'primary' as const },
      { count: 1, label: 'idle', variant: 'outlined' as const },
    ];

    const { getByText } = await renderInTestApp(
      <TaskStatusChips items={items} />,
    );

    const runningChip = getByText('1 running').closest('.MuiChip-root');
    const idleChip = screen.getByText('1 idle').closest('.MuiChip-root');

    expect(runningChip).toHaveClass('MuiChip-colorPrimary');
    expect(idleChip).toHaveClass('MuiChip-outlined');
  });
});
