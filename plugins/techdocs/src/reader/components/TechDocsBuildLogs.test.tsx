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

import { render } from '@testing-library/react';
import React from 'react';
import {
  TechDocsBuildLogs,
  TechDocsBuildLogsDrawerContent,
} from './TechDocsBuildLogs';

// react-lazylog is based on a react-virtualized component which doesn't
// write the content to the dom, so we mock it.
jest.mock('react-lazylog', () => {
  return {
    LazyLog: ({ text }: { text: string }) => {
      return <p>{text}</p>;
    },
  };
});

describe('<TechDocsBuildLogs />', () => {
  it('should render with button', () => {
    const rendered = render(<TechDocsBuildLogs buildLog={[]} />);
    expect(rendered.getByText(/Show Build Logs/i)).toBeInTheDocument();
    expect(rendered.queryByText(/Build Details/i)).not.toBeInTheDocument();
  });

  it('should open drawer', () => {
    const rendered = render(<TechDocsBuildLogs buildLog={[]} />);
    rendered.getByText(/Show Build Logs/i).click();
    expect(rendered.getByText(/Build Details/i)).toBeInTheDocument();
  });
});

describe('<TechDocsBuildLogsDrawerContent />', () => {
  it('should render with empty log', () => {
    const onClose = jest.fn();
    const rendered = render(
      <TechDocsBuildLogsDrawerContent buildLog={[]} onClose={onClose} />,
    );
    expect(rendered.getByText(/Build Details/i)).toBeInTheDocument();
    expect(rendered.getByText(/Waiting for logs.../i)).toBeInTheDocument();

    expect(onClose).toBeCalledTimes(0);
  });

  it('should render with empty logs', () => {
    const onClose = jest.fn();
    const rendered = render(
      <TechDocsBuildLogsDrawerContent
        buildLog={['Line 1', 'Line 2']}
        onClose={onClose}
      />,
    );
    expect(rendered.getByText(/Build Details/i)).toBeInTheDocument();
    expect(
      rendered.queryByText(/Waiting for logs.../i),
    ).not.toBeInTheDocument();
    expect(rendered.getByText(/Line 1/i)).toBeInTheDocument();
    expect(rendered.getByText(/Line 2/i)).toBeInTheDocument();

    expect(onClose).toBeCalledTimes(0);
  });

  it('should call onClose', () => {
    const onClose = jest.fn();
    const rendered = render(
      <TechDocsBuildLogsDrawerContent buildLog={[]} onClose={onClose} />,
    );
    rendered.getByRole('button').click();

    expect(onClose).toBeCalledTimes(1);
  });
});
