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
import { AlertInsightsSection } from './AlertInsightsSection';
import { render } from '@testing-library/react';
import { Alert } from '../../types';
import { AlertState } from '../../hooks';
import { MockScrollProvider, MockAlertsProvider } from '../../utils/tests';

const mockAlert: Alert = {
  subtitle:
    'Wherefore was I to this keen mockery born? When at your hands did I deserve this scorn?',
  title: 'Mock alert',
  url: '/cost-insights/test',
};

describe('<AlertInsightsSection/>', () => {
  it('Renders alert without exploding', () => {
    const { getByText, queryByText } = render(
      <MockAlertsProvider>
        <MockScrollProvider>
          <AlertInsightsSection alert={mockAlert} number={1} />
        </MockScrollProvider>
      </MockAlertsProvider>,
    );
    expect(getByText(mockAlert.title)).toBeInTheDocument();
    expect(getByText(mockAlert.subtitle)).toBeInTheDocument();
    expect(getByText('View Instructions')).toBeInTheDocument();
    expect(queryByText('Snooze')).not.toBeInTheDocument();
    expect(queryByText('Accept')).not.toBeInTheDocument();
    expect(queryByText('Dismiss')).not.toBeInTheDocument();
  });

  it('Hides instructions button if url is not provided', () => {
    const alert: Alert = {
      ...mockAlert,
      url: undefined,
    };
    const { queryByText } = render(
      <MockAlertsProvider>
        <MockScrollProvider>
          <AlertInsightsSection alert={alert} number={1} />
        </MockScrollProvider>
      </MockAlertsProvider>,
    );
    expect(queryByText('View Instructions')).not.toBeInTheDocument();
  });

  it('Displays a snooze button if a hook is provided', () => {
    const alert: Alert = {
      ...mockAlert,
      onSnoozed: jest.fn(),
    };

    const context: AlertState = {
      alerts: [],
      snoozed: alert,
      dismissed: null,
      accepted: null,
    };

    const { queryByText, getByText } = render(
      <MockAlertsProvider alerts={context}>
        <MockScrollProvider>
          <AlertInsightsSection alert={alert} number={1} />
        </MockScrollProvider>
      </MockAlertsProvider>,
    );

    expect(getByText('Snooze')).toBeInTheDocument();
    expect(queryByText('Accept')).not.toBeInTheDocument();
    expect(queryByText('Dismiss')).not.toBeInTheDocument();
  });

  it('Displays a dismiss button if a hook is provided', () => {
    const alert: Alert = {
      ...mockAlert,
      onDismissed: jest.fn(),
    };
    const context: AlertState = {
      alerts: [],
      snoozed: null,
      dismissed: alert,
      accepted: null,
    };

    const { queryByText, getByText } = render(
      <MockAlertsProvider alerts={context}>
        <MockScrollProvider>
          <AlertInsightsSection alert={alert} number={1} />
        </MockScrollProvider>
      </MockAlertsProvider>,
    );

    expect(getByText('Dismiss')).toBeInTheDocument();
    expect(queryByText('Accept')).not.toBeInTheDocument();
    expect(queryByText('Snooze')).not.toBeInTheDocument();
  });

  it('Displays an accept button if a hook is provided', () => {
    const alert: Alert = {
      ...mockAlert,
      onAccepted: jest.fn(),
    };

    const context: AlertState = {
      alerts: [],
      snoozed: null,
      dismissed: null,
      accepted: alert,
    };

    const { queryByText, getByText } = render(
      <MockAlertsProvider alerts={context}>
        <MockScrollProvider>
          <AlertInsightsSection alert={alert} number={1} />
        </MockScrollProvider>
      </MockAlertsProvider>,
    );

    expect(getByText('Accept')).toBeInTheDocument();
    expect(queryByText('Snooze')).not.toBeInTheDocument();
    expect(queryByText('Dismiss')).not.toBeInTheDocument();
  });
});
