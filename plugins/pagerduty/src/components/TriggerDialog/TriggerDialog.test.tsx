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
import { render, fireEvent } from '@testing-library/react';
import { wrapInTestApp } from '@backstage/test-utils';
import {
  ApiRegistry,
  alertApiRef,
  createApiRef,
  ApiProvider,
  IdentityApi,
  identityApiRef,
} from '@backstage/core';
import { pagerDutyApiRef } from '../../api';
import { TriggerButton } from '../TriggerButton';
import { Entity } from '@backstage/catalog-model';
import { act } from 'react-dom/test-utils';

describe('TriggerDialog', () => {
  const mockIdentityApi: Partial<IdentityApi> = {
    getUserId: () => 'guest@example.com',
  };

  const mockTriggerAlarmFn = jest.fn();
  const mockPagerDutyApi = {
    triggerPagerDutyAlarm: mockTriggerAlarmFn,
  };

  const apis = ApiRegistry.from([
    [
      alertApiRef,
      createApiRef({
        id: 'core.alert',
        description: 'Used to report alerts and forward them to the app',
      }),
    ],
    [identityApiRef, mockIdentityApi],
    [pagerDutyApiRef, mockPagerDutyApi],
  ]);

  it('open the dialog and trigger an alarm', async () => {
    const entity: Entity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Component',
      metadata: {
        name: 'pagerduty-test',
        annotations: {
          'pagerduty.com/integration-key': 'abc123',
        },
      },
    };

    const { getByText, getByRole, queryByRole, getByTestId } = render(
      wrapInTestApp(
        <ApiProvider apis={apis}>
          <TriggerButton entity={entity} />
        </ApiProvider>,
      ),
    );
    expect(queryByRole('dialog')).toBeNull();
    const alarmButton = getByText('Trigger Alarm');
    fireEvent.click(alarmButton);
    expect(getByRole('dialog')).toBeInTheDocument();
    expect(
      getByText(
        'This action will send PagerDuty alarms and notifications to on-call people responsible for',
        {
          exact: false,
        },
      ),
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
    expect(mockTriggerAlarmFn).toHaveBeenCalledWith(
      entity!.metadata!.annotations!['pagerduty.com/integration-key'],
      window.location.toString(),
      description,
      'guest@example.com',
    );
  });
});
