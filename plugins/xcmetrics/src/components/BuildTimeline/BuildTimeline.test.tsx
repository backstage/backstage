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
import React from 'react';
import { renderInTestApp } from '@backstage/test-utils';
import { BuildTimeline } from './BuildTimeline';

jest.mock('../../api/XcmetricsClient');
const client = require('../../api/XcmetricsClient');

jest.mock('recharts', () => {
  const OriginalModule = jest.requireActual('recharts');

  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }: any) => (
      <OriginalModule.ResponsiveContainer width={100} aspect={1}>
        {children}
      </OriginalModule.ResponsiveContainer>
    ),
  };
});

describe('BuildTimeline', () => {
  const { ResizeObserver } = window;

  beforeEach(() => {
    // @ts-expect-error
    delete window.ResizeObserver;
    window.ResizeObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }));
  });

  afterEach(() => {
    window.ResizeObserver = ResizeObserver;
    jest.restoreAllMocks();
  });

  it('should render', async () => {
    const rendered = await renderInTestApp(
      <BuildTimeline targets={[client.mockTarget]} height={100} width={100} />,
    );

    const [element] = await rendered.findAllByText(client.mockTarget.name);

    expect(element).toBeInTheDocument();
  });

  it('should render a message if no targets are provided', async () => {
    const rendered = await renderInTestApp(<BuildTimeline targets={[]} />);
    expect(rendered.getByText('No Targets')).toBeInTheDocument();
  });
});
