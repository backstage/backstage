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
import { act, fireEvent, waitFor } from '@testing-library/react';
import { renderInTestApp } from '@backstage/test-utils';
import {
  ApiRegistry,
  alertApiRef,
  createApiRef,
  ApiProvider,
  IdentityApi,
  identityApiRef,
} from '@backstage/core';
import { pagerDutyApiRef } from '../../api';
import { Entity } from '@backstage/catalog-model';
import { EntityProvider } from '@backstage/plugin-catalog-react';
import { TriggerButton } from './';

describe('TriggerButton', () => {
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

  it('renders the trigger button, opens and closes dialog', async () => {
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

    const { queryByRole, getByRole, getByTestId } = await renderInTestApp(
      <ApiProvider apis={apis}>
        <EntityProvider entity={entity}>
          <TriggerButton />
        </EntityProvider>
      </ApiProvider>,
    );

    expect(getByTestId('trigger-button')).toBeInTheDocument();
    expect(queryByRole('dialog')).not.toBeInTheDocument();

    const triggerButton = getByTestId('trigger-button');
    expect(triggerButton.textContent).toBe('Create Incident');

    await act(async () => {
      fireEvent.click(triggerButton);
    });
    await waitFor(() => {
      expect(getByRole('dialog')).toBeInTheDocument();
    });

    const closeButton = getByTestId('close-button');
    await act(async () => {
      fireEvent.click(closeButton);
    });
    await waitFor(() => {
      expect(queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('renders the trigger button with children', async () => {
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

    const { getByTestId } = await renderInTestApp(
      <ApiProvider apis={apis}>
        <EntityProvider entity={entity}>
          <TriggerButton>Send an alert</TriggerButton>
        </EntityProvider>
      </ApiProvider>,
    );

    const triggerButton = getByTestId('trigger-button');
    expect(triggerButton.textContent).toBe('Send an alert');
  });

  it('renders a disabled trigger button if entity does not include key', async () => {
    const entity: Entity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Component',
      metadata: {
        name: 'pagerduty-test',
      },
    };

    const { queryByRole, getByTestId } = await renderInTestApp(
      <ApiProvider apis={apis}>
        <EntityProvider entity={entity}>
          <TriggerButton />
        </EntityProvider>
      </ApiProvider>,
    );

    expect(getByTestId('trigger-button')).toBeInTheDocument();

    const triggerButton = getByTestId('trigger-button');
    expect(triggerButton.textContent).toBe('Missing integration key');

    await act(async () => {
      fireEvent.click(triggerButton);
    });
    await waitFor(() => {
      expect(queryByRole('dialog')).not.toBeInTheDocument();
    });
  });
});
