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
import { TaskBorder } from './TaskBorder';
import { render } from '@testing-library/react';

describe('TaskBorder', () => {
  it('should render a pending linear progress if the task is not complete', () => {
    const { getByRole } = render(
      <TaskBorder isComplete={false} isError={false} />,
    );

    const progressBar = getByRole('progressbar');

    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveClass('MuiLinearProgress-indeterminate');
  });

  it('should render a determinate progress bar if the task is complete', () => {
    const { getByRole } = render(<TaskBorder isComplete isError />);

    const progressBar = getByRole('progressbar');

    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveClass('MuiLinearProgress-determinate');
  });
});
