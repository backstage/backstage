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
import { render, fireEvent, act } from '@testing-library/react';
import { wrapInTestApp } from '@backstage/test-utils';
import {
  ApiRegistry,
  alertApiRef,
  createApiRef,
  ApiProvider,
} from '@backstage/core';
import { splunkOnCallApiRef } from '../../api';
import { TriggerDialog } from './TriggerDialog';
import { ESCALATION_POLICIES, MOCKED_USER } from '../../api/mocks';

describe('TriggerDialog', () => {
  const mockTriggerAlarmFn = jest.fn();
  const mockSplunkOnCallApi = {
    triggerAlarm: mockTriggerAlarmFn,
    getEscalationPolicies: async () => ESCALATION_POLICIES,
  };

  const apis = ApiRegistry.from([
    [
      alertApiRef,
      createApiRef({
        id: 'core.alert',
        description: 'Used to report alerts and forward them to the app',
      }),
    ],
    [splunkOnCallApiRef, mockSplunkOnCallApi],
  ]);

  it('open the dialog and trigger an alarm', async () => {
    const { getByText, getByRole, getAllByRole, getByTestId } = render(
      wrapInTestApp(
        <ApiProvider apis={apis}>
          <TriggerDialog
            showDialog
            incidentCreator={MOCKED_USER}
            handleDialog={() => {}}
            users={[MOCKED_USER]}
            onIncidentCreated={() => {}}
          />
        </ApiProvider>,
      ),
    );

    expect(getByRole('dialog')).toBeInTheDocument();
    expect(
      getByText('This action will trigger an incident', {
        exact: false,
      }),
    ).toBeInTheDocument();
    const summary = getByTestId('trigger-summary-input');
    const body = getByTestId('trigger-body-input');
    const behavior = getByTestId('trigger-select-behavior');
    const description = 'Test Trigger Alarm';
    await act(async () => {
      fireEvent.change(summary, { target: { value: description } });
      fireEvent.change(body, { target: { value: description } });
      fireEvent.change(behavior, { target: { value: '0' } });
      fireEvent.mouseDown(getAllByRole('button')[0]);
    });

    // Trigger user targets select
    const options = getAllByRole('option');
    await act(async () => {
      fireEvent.click(options[0]);
      fireEvent.keyDown(options[0], {
        key: 'Escape',
        code: 'Escape',
        keyCode: 27,
        charCode: 27,
      });
    });

    // Trigger policy targets select
    await act(async () => {
      fireEvent.mouseDown(getAllByRole('button')[1]);
    });
    const policiesOptions = getAllByRole('option');
    await act(async () => {
      fireEvent.click(policiesOptions[0]);
    });

    // Trigger incident creation button
    const triggerButton = getByTestId('trigger-button');
    await act(async () => {
      fireEvent.click(triggerButton);
    });
    expect(mockTriggerAlarmFn).toHaveBeenCalled();
    expect(mockTriggerAlarmFn).toHaveBeenCalledWith({
      summary: description,
      details: description,
      userName: 'test_user',
      targets: [
        { slug: 'test_user', type: 'User' },
        { slug: 'team-zEalMCgwYSA0Lt40', type: 'EscalationPolicy' },
      ],
      isMultiResponder: false,
    });
  });
});
