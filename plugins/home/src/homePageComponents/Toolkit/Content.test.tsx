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

import { renderInTestApp } from '@backstage/test-utils';
import React from 'react';
import { Content } from './Content';
import { ContextProvider } from './Context';

describe('<ToolkitContent>', () => {
  const tools = [
    { label: 'tool', url: '/url', icon: <div>icon</div> },
    { label: 'tool 2', url: '/url-2', icon: <div>icon 2</div> },
  ];

  test('should render list of tools', async () => {
    const { getByText } = await renderInTestApp(<Content tools={tools} />);

    expect(getByText('tool')).toBeInTheDocument();
    expect(getByText('tool 2')).toBeInTheDocument();
    expect(getByText('tool').closest('a')).toHaveAttribute('href', '/url');
    expect(getByText('tool 2').closest('a')).toHaveAttribute('href', '/url-2');
  });

  test('should render list of tools using context', async () => {
    const { getByText } = await renderInTestApp(
      <ContextProvider tools={tools}>
        <Content tools={[]} />
      </ContextProvider>,
    );

    expect(getByText('tool')).toBeInTheDocument();
    expect(getByText('tool 2')).toBeInTheDocument();
    expect(getByText('tool').closest('a')).toHaveAttribute('href', '/url');
    expect(getByText('tool 2').closest('a')).toHaveAttribute('href', '/url-2');
  });
});
