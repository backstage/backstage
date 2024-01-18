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
import { splunkOnCallApiRef } from '../../api';
import { MOCKED_ON_CALL, MOCKED_USER } from '../../api/mocks';
import { ApiProvider } from '@backstage/core-app-api';

const mockSplunkOnCallApi = {
  getOnCallUsers: jest.fn(),
};
const apis = TestApiRegistry.from([splunkOnCallApiRef, mockSplunkOnCallApi]);

describe('Escalation', () => {
  it('Handles an empty response', async () => {
    mockSplunkOnCallApi.getOnCallUsers = jest
      .fn()
      .mockImplementationOnce(async () => []);

    await renderInTestApp(
      <ApiProvider apis={apis}>
        <EscalationPolicy
          users={{
            [MOCKED_USER.username!]: MOCKED_USER,
          }}
          team="team_example"
        />
      </ApiProvider>,
    );
    await waitFor(() => !screen.queryByTestId('progress'));

    expect(screen.getByText('Empty escalation policy')).toBeInTheDocument();
    expect(mockSplunkOnCallApi.getOnCallUsers).toHaveBeenCalled();
  });

  it('Render a list of users', async () => {
    mockSplunkOnCallApi.getOnCallUsers = jest
      .fn()
      .mockImplementationOnce(async () => MOCKED_ON_CALL);

    await renderInTestApp(
      <ApiProvider apis={apis}>
        <EscalationPolicy
          users={{
            [MOCKED_USER.username!]: MOCKED_USER,
          }}
          team="team_example"
        />
      </ApiProvider>,
    );
    await waitFor(() => !screen.queryByTestId('progress'));

    expect(screen.getByText('FirstNameTest LastNameTest')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(mockSplunkOnCallApi.getOnCallUsers).toHaveBeenCalled();
  });

  it('Handles errors', async () => {
    mockSplunkOnCallApi.getOnCallUsers = jest
      .fn()
      .mockRejectedValueOnce(new Error('Error message'));

    await renderInTestApp(
      <ApiProvider apis={apis}>
        <EscalationPolicy
          users={{
            [MOCKED_USER.username!]: MOCKED_USER,
          }}
          team="team_example"
        />
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
