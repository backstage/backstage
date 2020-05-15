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
import { render } from '@testing-library/react';
import SentryIssuesTable from './SentryIssuesTable';
import { SentryIssue } from '../../data/sentry-issue';
import mockIssue from '../../data/sentry-issue-mock.json';
import { ThemeProvider } from '@material-ui/styles';
import { lightTheme } from '@backstage/theme';

describe('SentryIssuesTable', () => {
  it('should render headers in a table', async () => {
    const issues: SentryIssue[] = [
      {
        ...mockIssue,
        metadata: {
          type: 'Exception',
          value: 'exception was thrown',
        },
        count: '1',
        userCount: 2,
      },
    ];
    const table = await render(
      <ThemeProvider theme={lightTheme}>
        <SentryIssuesTable sentryIssues={issues} />
      </ThemeProvider>,
    );
    expect(await table.findByText('Error')).toBeInTheDOM();
    expect(await table.findByText('Graph')).toBeInTheDOM();
    expect(await table.findByText('First seen')).toBeInTheDOM();
    expect(await table.findByText('Last seen')).toBeInTheDOM();
    expect(await table.findByText('Events')).toBeInTheDOM();
    expect(await table.findByText('Users')).toBeInTheDOM();
  });
  it('should render values in a table', async () => {
    const issues: SentryIssue[] = [
      {
        ...mockIssue,
        metadata: {
          type: 'Exception',
          value: 'exception was thrown',
        },
        count: '101',
        userCount: 202,
      },
    ];
    const table = await render(
      <ThemeProvider theme={lightTheme}>
        <SentryIssuesTable sentryIssues={issues} />
      </ThemeProvider>,
    );
    expect(await table.findByText('Exception')).toBeInTheDOM();
    expect(await table.findByText('exception was thrown')).toBeInTheDOM();
    expect(await table.findByText('101')).toBeInTheDOM();
    expect(await table.findByText('202')).toBeInTheDOM();
  });
});
