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
import { screen, waitFor } from '@testing-library/react';
import { EscalationPolicy } from './EscalationPolicy';
import { TestApiRegistry, renderInTestApp } from '@backstage/test-utils';
import { PagerDutyUser } from '../types';
import { pagerDutyApiRef } from '../../api';
import { ApiProvider } from '@backstage/core-app-api';

const mockPagerDutyApi = {
  getOnCallByPolicyId: jest.fn(),
};
const apis = TestApiRegistry.from([pagerDutyApiRef, mockPagerDutyApi]);

describe('Escalation', () => {
  it('Handles an empty response', async () => {
    mockPagerDutyApi.getOnCallByPolicyId = jest
      .fn()
      .mockImplementationOnce(async () => ({ oncalls: [] }));

    await renderInTestApp(
      <ApiProvider apis={apis}>
        <EscalationPolicy policyId="456" />
      </ApiProvider>,
    );
    await waitFor(() => !screen.queryByTestId('progress'));

    expect(screen.getByText('Empty escalation policy')).toBeInTheDocument();
    expect(mockPagerDutyApi.getOnCallByPolicyId).toHaveBeenCalledWith('456');
  });

  it('Render a list of users', async () => {
    mockPagerDutyApi.getOnCallByPolicyId = jest
      .fn()
      .mockImplementationOnce(async () => ({
        oncalls: [
          {
            user: {
              name: 'person1',
              id: 'p1',
              summary: 'person1',
              email: 'person1@example.com',
              html_url: 'http://a.com/id1',
            } as PagerDutyUser,
          },
        ],
      }));

    await renderInTestApp(
      <ApiProvider apis={apis}>
        <EscalationPolicy policyId="abc" />
      </ApiProvider>,
    );
    await waitFor(() => !screen.queryByTestId('progress'));

    expect(screen.getByText('person1')).toBeInTheDocument();
    expect(screen.getByText('person1@example.com')).toBeInTheDocument();
    expect(mockPagerDutyApi.getOnCallByPolicyId).toHaveBeenCalledWith('abc');
  });

  it('Handles errors', async () => {
    mockPagerDutyApi.getOnCallByPolicyId = jest
      .fn()
      .mockRejectedValueOnce(new Error('Error message'));

    await renderInTestApp(
      <ApiProvider apis={apis}>
        <EscalationPolicy policyId="abc" />
      </ApiProvider>,
    );
    await waitFor(() => !screen.queryByTestId('progress'));

    expect(
      screen.getByText(
        'Error encountered while fetching information. Error message',
      ),
    ).toBeInTheDocument();
  });
});
