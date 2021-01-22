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
import { MockScrollProvider } from '../..';

const mockAlert: Alert = {
  element: <div />,
  subtitle:
    'Wherefore was I to this keen mockery born? When at your hands did I deserve this scorn?',
  title: 'Mock alert',
  url: '/cost-insights/test',
};

describe('<AlertInsightsSection/>', () => {
  it('Renders alert without exploding', () => {
    const { getByText } = render(
      <MockScrollProvider>
        <AlertInsightsSection alert={mockAlert} number={1} />
      </MockScrollProvider>,
    );
    expect(getByText(mockAlert.title)).toBeInTheDocument();
    expect(getByText(mockAlert.subtitle)).toBeInTheDocument();
    expect(getByText('View Instructions')).toBeInTheDocument();
  });

  it('Hides instructions button if url is not provided', () => {
    const alert = {
      ...mockAlert,
      url: undefined,
    };
    const { queryByText } = render(
      <MockScrollProvider>
        <AlertInsightsSection alert={alert} number={1} />
      </MockScrollProvider>,
    );
    expect(queryByText('View Instructions')).not.toBeInTheDocument();
  });
});
