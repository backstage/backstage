/*
 * Copyright 2020 Spotify AB
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
import { fireEvent } from '@testing-library/react';
import { renderInTestApp } from '@backstage/test-utils';
import { Typography } from '@material-ui/core';

import { WarningPanel } from './WarningPanel';

const propsTitle = { title: 'Mock title' };
const propsTitleMessage = { title: 'Mock title', message: 'Some more info' };
const propsMessage = { message: 'Some more info' };

describe('<WarningPanel />', () => {
  it('renders without exploding', async () => {
    const { getByText } = await renderInTestApp(
      <WarningPanel {...propsTitleMessage} />,
    );
    expect(getByText('Warning: Mock title')).toBeInTheDocument();
  });

  it('renders title', async () => {
    const { getByText } = await renderInTestApp(
      <WarningPanel {...propsTitleMessage} />,
    );
    const expandIcon = await getByText('Warning: Mock title');
    fireEvent.click(expandIcon);
    expect(getByText('Warning: Mock title')).toBeInTheDocument();
    expect(getByText('Some more info')).toBeInTheDocument();
  });

  it('renders title and children', async () => {
    const { getByText } = await renderInTestApp(
      <WarningPanel {...propsTitle}>
        <Typography>Java stacktrace</Typography>
      </WarningPanel>,
    );
    expect(getByText('Java stacktrace')).toBeInTheDocument();
  });

  it('renders message', async () => {
    const { getByText } = await renderInTestApp(
      <WarningPanel {...propsMessage} />,
    );
    expect(getByText('Warning')).toBeInTheDocument();
    expect(getByText('Some more info')).toBeInTheDocument();
  });

  it('renders title, message, and children', async () => {
    const { getByText } = await renderInTestApp(
      <WarningPanel {...propsTitleMessage}>
        <Typography>Java stacktrace</Typography>
      </WarningPanel>,
    );
    expect(getByText('Warning: Mock title')).toBeInTheDocument();
    expect(getByText('Some more info')).toBeInTheDocument();
    expect(getByText('Java stacktrace')).toBeInTheDocument();
    // expect(getByText(/Some more info/)).toBeTruthy();
    // expect(getByText(/Java stacktrace/)).toBeTruthy();
  });
});
