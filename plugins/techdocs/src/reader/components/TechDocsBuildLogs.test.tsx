/*
 * Copyright 2021 The Backstage Authors
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

import React, { ReactNode } from 'react';
import { renderInTestApp } from '@backstage/test-utils';
import {
  TechDocsBuildLogs,
  TechDocsBuildLogsDrawerContent,
} from './TechDocsBuildLogs';

// The <AutoSizer> inside <LogViewer> needs mocking to render in jsdom
jest.mock('react-virtualized-auto-sizer', () => ({
  __esModule: true,
  default: (props: {
    children: (size: { width: number; height: number }) => ReactNode;
  }) => <>{props.children({ width: 400, height: 200 })}</>,
}));

describe('<TechDocsBuildLogs />', () => {
  it('should render with button', async () => {
    const rendered = await renderInTestApp(<TechDocsBuildLogs buildLog={[]} />);
    expect(rendered.getByText(/Show Build Logs/i)).toBeInTheDocument();
    expect(rendered.queryByText(/Build Details/i)).not.toBeInTheDocument();
  });

  it('should open drawer', async () => {
    const rendered = await renderInTestApp(<TechDocsBuildLogs buildLog={[]} />);
    rendered.getByText(/Show Build Logs/i).click();
    expect(rendered.getByText(/Build Details/i)).toBeInTheDocument();
  });
});

describe('<TechDocsBuildLogsDrawerContent />', () => {
  it('should render with empty log', async () => {
    const onClose = jest.fn();
    const rendered = await renderInTestApp(
      <TechDocsBuildLogsDrawerContent buildLog={[]} onClose={onClose} />,
    );
    expect(rendered.getByText(/Build Details/i)).toBeInTheDocument();
    expect(
      await rendered.findByText(/Waiting for logs.../i),
    ).toBeInTheDocument();

    expect(onClose).toHaveBeenCalledTimes(0);
  });

  it('should render logs', async () => {
    const onClose = jest.fn();
    const rendered = await renderInTestApp(
      <TechDocsBuildLogsDrawerContent
        buildLog={['Line 1', 'Line 2']}
        onClose={onClose}
      />,
    );
    expect(rendered.getByText(/Build Details/i)).toBeInTheDocument();
    expect(await rendered.findByText(/Line 1/i)).toBeInTheDocument();
    expect(await rendered.findByText(/Line 2/i)).toBeInTheDocument();

    expect(onClose).toHaveBeenCalledTimes(0);
  });

  it('should call onClose', async () => {
    const onClose = jest.fn();
    const rendered = await renderInTestApp(
      <TechDocsBuildLogsDrawerContent buildLog={[]} onClose={onClose} />,
    );
    rendered.getByTitle('Close the drawer').click();

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
