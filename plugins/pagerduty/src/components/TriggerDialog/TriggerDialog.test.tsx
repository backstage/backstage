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
import { fireEvent, act } from '@testing-library/react';
import { renderInTestApp, TestApiRegistry } from '@backstage/test-utils';
import { pagerDutyApiRef } from '../../api';
import { TriggerDialog } from './TriggerDialog';

import { ApiProvider } from '@backstage/core-app-api';
import {
  alertApiRef,
  IdentityApi,
  identityApiRef,
} from '@backstage/core-plugin-api';

describe('TriggerDialog', () => {
  const mockIdentityApi: Partial<IdentityApi> = {
    getBackstageIdentity: async () => ({
      type: 'user',
      userEntityRef: 'user:default/guest',
      ownershipEntityRefs: [],
    }),
  };

  const mockTriggerAlarmFn = jest.fn();
  const mockPagerDutyApi = {
    triggerAlarm: mockTriggerAlarmFn,
  };

  const apis = TestApiRegistry.from(
    [alertApiRef, {}],
    [identityApiRef, mockIdentityApi],
    [pagerDutyApiRef, mockPagerDutyApi],
  );

  it('open the dialog and trigger an alarm', async () => {
    const { getByText, getByRole, getByTestId } = await renderInTestApp(
      <ApiProvider apis={apis}>
        <TriggerDialog
          integrationKey="abc123"
          name="pagerduty-test"
          showDialog
          handleDialog={() => {}}
          onIncidentCreated={() => {}}
        />
      </ApiProvider>,
    );

    expect(getByRole('dialog')).toBeInTheDocument();
    expect(
      getByText('This action will trigger an incident for ', {
        exact: false,
      }),
    ).toBeInTheDocument();
    const input = getByTestId('trigger-input');
    const description = 'Test Trigger Alarm';
    await act(async () => {
      fireEvent.change(input, { target: { value: description } });
    });
    const triggerButton = getByTestId('trigger-button');
    await act(async () => {
      fireEvent.click(triggerButton);
    });
    expect(mockTriggerAlarmFn).toHaveBeenCalled();
    expect(mockTriggerAlarmFn).toHaveBeenCalledWith({
      integrationKey: 'abc123',
      source: window.location.toString(),
      description,
      userName: 'guest',
    });
  });
});
