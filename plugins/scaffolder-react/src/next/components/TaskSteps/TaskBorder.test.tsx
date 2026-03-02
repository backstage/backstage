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
import { TaskBorder } from './TaskBorder';
import { render } from '@testing-library/react';

describe('TaskBorder', () => {
  it('should render an indeterminate progress bar if the task is not complete', () => {
    const { getByRole, getByTestId } = render(
      <TaskBorder isComplete={false} isError={false} />,
    );

    const progressBar = getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveClass(
      'relative',
      'h-1',
      'w-full',
      'overflow-hidden',
    );

    // Indeterminate state: identified by data-testid and has animation
    expect(getByTestId('task-border-indeterminate')).toBeInTheDocument();

    // Indeterminate bar has an animated child with inline animation style
    const animatedBar = progressBar.querySelector('[style]');
    expect(animatedBar).toBeInTheDocument();
    expect(animatedBar?.getAttribute('style')).toContain(
      'backstage-indeterminate',
    );

    // Indeterminate progress bar should NOT have aria-valuenow
    expect(progressBar).not.toHaveAttribute('aria-valuenow');
  });

  it('should render a determinate progress bar with error color when complete with error', () => {
    const { getByRole, getByTestId } = render(
      <TaskBorder isComplete isError />,
    );

    const progressBar = getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveClass(
      'relative',
      'h-1',
      'w-full',
      'overflow-hidden',
    );

    // Determinate state: identified by data-testid
    expect(getByTestId('task-border-determinate')).toBeInTheDocument();

    // Determinate progress bar reports full completion
    expect(progressBar).toHaveAttribute('aria-valuenow', '100');
    expect(progressBar).toHaveAttribute('aria-valuemin', '0');
    expect(progressBar).toHaveAttribute('aria-valuemax', '100');

    // Error state: fill uses --destructive token color
    const fillBar = progressBar.querySelector('.h-full');
    expect(fillBar).toBeInTheDocument();
    expect(fillBar).toHaveStyle({
      backgroundColor: 'var(--destructive)',
    });
  });

  it('should render a determinate progress bar with success color when complete without error', () => {
    const { getByRole, getByTestId } = render(
      <TaskBorder isComplete isError={false} />,
    );

    const progressBar = getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();

    // Determinate state
    expect(getByTestId('task-border-determinate')).toBeInTheDocument();
    expect(progressBar).toHaveAttribute('aria-valuenow', '100');

    // Success state: fill uses --status-ok token color
    const fillBar = progressBar.querySelector('.h-full');
    expect(fillBar).toBeInTheDocument();
    expect(fillBar).toHaveStyle({
      backgroundColor: 'var(--status-ok)',
    });
  });
});
