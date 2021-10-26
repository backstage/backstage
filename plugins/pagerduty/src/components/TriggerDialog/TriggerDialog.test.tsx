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
import { renderInTestApp } from '@backstage/test-utils';
import { pagerDutyApiRef } from '../../api';
import { Entity } from '@backstage/catalog-model';
import { EntityProvider } from '@backstage/plugin-catalog-react';
import { TriggerDialog } from './TriggerDialog';

import { ApiRegistry, ApiProvider } from '@backstage/core-app-api';
import {
  alertApiRef,
  createApiRef,
  IdentityApi,
  identityApiRef,
} from '@backstage/core-plugin-api';

describe('TriggerDialog', () => {
  const mockIdentityApi: Partial<IdentityApi> = {
    getUserId: () => 'guest@example.com',
  };

  const mockTriggerAlarmFn = jest.fn();
  const mockPagerDutyApi = {
    triggerAlarm: mockTriggerAlarmFn,
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
          'pagerduty.com/service-id': 'abc123',
        },
      },
    };

    const { getByText, getByRole, getByTestId } = await renderInTestApp(
      <ApiProvider apis={apis}>
        <EntityProvider entity={entity}>
          <TriggerDialog
            showDialog
            handleDialog={() => {}}
            onIncidentCreated={() => {}}
          />
        </EntityProvider>
      </ApiProvider>,
    );

    expect(getByRole('dialog')).toBeInTheDocument();
    expect(
      getByText('This action will trigger an incident for ', {
        exact: false,
      }),
    ).toBeInTheDocument();
    const descriptionInput = getByTestId('trigger-description-input');
    const fromInput = getByTestId('trigger-from-input');
    const titleInput = getByTestId('trigger-title-input');
    const description = 'Test Trigger Alarm';
    const title = 'Test Trigger Alarm';
    const from = 'guest@example.com';
    await act(async () => {
      fireEvent.change(descriptionInput, { target: { value: description } });
    });
    await act(async () => {
      fireEvent.change(titleInput, { target: { value: title } });
    });
    await act(async () => {
      fireEvent.change(fromInput, { target: { value: from } });
    });
    const triggerButton = getByTestId('trigger-button');
    await act(async () => {
      fireEvent.click(triggerButton);
    });
    expect(mockTriggerAlarmFn).toHaveBeenCalled();
    expect(mockTriggerAlarmFn).toHaveBeenCalledWith({
      serviceId: entity!.metadata!.annotations!['pagerduty.com/service-id'],
      title,
      description,
      from,
    });
  });
});
