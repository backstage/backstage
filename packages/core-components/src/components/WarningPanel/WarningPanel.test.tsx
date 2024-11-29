/*
 * Copyright 2020 The Backstage Authors
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
import { fireEvent, screen } from '@testing-library/react';
import { renderInTestApp } from '@backstage/test-utils';
import Typography from '@material-ui/core/Typography';
import { WarningPanel, WarningProps } from './WarningPanel';

const propsTitle: WarningProps = { title: 'Mock title' };
const propsTitleMessage: WarningProps = {
  title: 'Mock title',
  message: 'Some more info',
};
const propsMessage: WarningProps = { message: 'Some more info' };
const propsErrorMessage: WarningProps = {
  severity: 'error',
  title: 'Mock title',
  message: 'Some more info',
};

describe('<WarningPanel />', () => {
  it('renders without exploding', async () => {
    await renderInTestApp(<WarningPanel {...propsTitleMessage} />);
    expect(screen.getByText('Warning: Mock title')).toBeInTheDocument();
  });

  it('renders title', async () => {
    await renderInTestApp(<WarningPanel {...propsTitleMessage} />);
    const expandIcon = screen.getByText('Warning: Mock title');
    fireEvent.click(expandIcon);
    expect(screen.getByText('Warning: Mock title')).toBeInTheDocument();
    expect(screen.getByText('Some more info')).toBeInTheDocument();
  });

  it('renders title and children', async () => {
    await renderInTestApp(
      <WarningPanel {...propsTitle}>
        <Typography>Java stacktrace</Typography>
      </WarningPanel>,
    );
    expect(screen.getByText('Java stacktrace')).toBeInTheDocument();
  });

  it('renders message', async () => {
    await renderInTestApp(<WarningPanel {...propsMessage} />);
    expect(screen.getByText('Warning')).toBeInTheDocument();
    expect(screen.getByText('Some more info')).toBeInTheDocument();
  });

  it('renders title, message, and children', async () => {
    await renderInTestApp(
      <WarningPanel {...propsTitleMessage}>
        <Typography>Java stacktrace</Typography>
      </WarningPanel>,
    );
    expect(screen.getByText('Warning: Mock title')).toBeInTheDocument();
    expect(screen.getByText('Some more info')).toBeInTheDocument();
    expect(screen.getByText('Java stacktrace')).toBeInTheDocument();
  });
  it('renders message using severity', async () => {
    await renderInTestApp(<WarningPanel {...propsErrorMessage} />);
    expect(screen.getByText('Error: Mock title')).toBeInTheDocument();
  });
  it('renders a title formatted by markdown', async () => {
    await renderInTestApp(
      <WarningPanel
        {...propsErrorMessage}
        titleFormat="markdown"
        title="Step has failed. [Help](https://commonmark.org/help)"
      />,
    );
    expect(screen.getByText('Error: Step has failed.')).toBeInTheDocument();

    expect(screen.getByText('Help')).toHaveAttribute(
      'href',
      'https://commonmark.org/help',
    );
  });
});
