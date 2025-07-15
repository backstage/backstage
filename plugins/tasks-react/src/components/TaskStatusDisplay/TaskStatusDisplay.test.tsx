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
import { TaskStatusDisplay } from './TaskStatusDisplay';
import { renderInTestApp } from '@backstage/test-utils';

describe('TaskStatusDisplay', () => {
  it('renders status items correctly', async () => {
    const items = [
      { count: 5, label: 'running', icon: '🔄', color: 'primary' as const },
      { count: 2, label: 'with errors', icon: '❌', color: 'error' as const },
    ];

    const { getByText } = await renderInTestApp(
      <TaskStatusDisplay items={items} />,
    );

    expect(getByText('5 running')).toBeInTheDocument();
    expect(getByText('2 with errors')).toBeInTheDocument();
  });

  it('filters out items with zero count', async () => {
    const items = [
      { count: 0, label: 'running', icon: '🔄', color: 'primary' as const },
      { count: 3, label: 'idle', icon: '😴', color: 'info' as const },
    ];

    const { getByText } = await renderInTestApp(
      <TaskStatusDisplay items={items} />,
    );

    expect(getByText('3 idle')).toBeInTheDocument();
  });

  it('returns null when no items have count > 0', async () => {
    const items = [
      { count: 0, label: 'running', icon: '🔄', color: 'primary' as const },
      { count: 0, label: 'error', icon: '❌', color: 'error' as const },
    ];

    const { container } = await renderInTestApp(
      <TaskStatusDisplay items={items} />,
    );
    expect(container.firstChild).toBeNull();
  });
});
