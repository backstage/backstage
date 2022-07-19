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
import userEvent from '@testing-library/user-event';
import { renderInTestApp } from '@backstage/test-utils';
import { RealLogViewer } from './RealLogViewer';
// eslint-disable-next-line import/no-extraneous-dependencies
import copyToClipboard from 'copy-to-clipboard';

// Used by useCopyToClipboard
jest.mock('copy-to-clipboard', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// The <AutoSizer> inside <LogViewer> needs mocking to render in jsdom
jest.mock('react-virtualized-auto-sizer', () => ({
  __esModule: true,
  default: (props: {
    children: (size: { width: number; height: number }) => ReactNode;
  }) => <>{props.children({ width: 400, height: 200 })}</>,
}));

const testText = `Some Log Line
Derp
Foo

Foo Foo
Wat`;

describe('RealLogViewer', () => {
  it('should render text with search and filtering and copying', async () => {
    const rendered = await renderInTestApp(<RealLogViewer text={testText} />);
    expect(rendered.getByText('Derp')).toBeInTheDocument();
    expect(rendered.getByText('Foo Foo')).toBeInTheDocument();

    await userEvent.tab();
    await userEvent.keyboard('Foo');
    expect(rendered.getByText('1/3')).toBeInTheDocument();
    await userEvent.keyboard('{enter}');
    expect(rendered.getByText('2/3')).toBeInTheDocument();
    await userEvent.keyboard('{enter}');
    expect(rendered.getByText('3/3')).toBeInTheDocument();
    await userEvent.keyboard('{enter}');
    expect(rendered.getByText('1/3')).toBeInTheDocument();
    await userEvent.keyboard('{shift>}{enter}{/shift}');
    expect(rendered.getByText('3/3')).toBeInTheDocument();

    expect(rendered.queryByText('Some Log Line')).toBeInTheDocument();
    await userEvent.keyboard('{meta>}{enter}{/meta}');
    expect(rendered.queryByText('Some Log Line')).not.toBeInTheDocument();
    await userEvent.keyboard('{meta>}{enter}{/meta}');
    expect(rendered.queryByText('Some Log Line')).toBeInTheDocument();

    // Tab down to line #2 and click
    await userEvent.tab();
    await userEvent.tab();
    await userEvent.tab();
    await userEvent.click(document.activeElement!);
    await userEvent.click(rendered.getByTestId('copy-button'));

    expect(copyToClipboard).toHaveBeenCalledWith('Derp');
  });
});
