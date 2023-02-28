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
import { renderInTestApp } from '@backstage/test-utils';
import React, { ReactNode } from 'react';
import { TaskLogStream } from './TaskLogStream';

// The <AutoSizer> inside <LogViewer> needs mocking to render in jsdom
jest.mock('react-virtualized-auto-sizer', () => ({
  __esModule: true,
  default: (props: {
    children: (size: { width: number; height: number }) => ReactNode;
  }) => <>{props.children({ width: 400, height: 200 })}</>,
}));

describe('TaskLogStream', () => {
  it('should render a log stream with the correct log lines', async () => {
    const logs = { step: ['line 1', 'line 2'], step2: ['line 3'] };

    const { findByText } = await renderInTestApp(<TaskLogStream logs={logs} />);

    const logLines = Object.values(logs).flat();

    for (const line of logLines) {
      await expect(findByText(line)).resolves.toBeInTheDocument();
    }
  });

  it('should filter out empty log lines', async () => {
    const logs = { step: ['line 1', 'line 2'], step2: [] };

    const { findAllByRole } = await renderInTestApp(
      <TaskLogStream logs={logs} />,
    );

    await expect(findAllByRole('row')).resolves.toHaveLength(2);
  });
});
