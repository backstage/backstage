import React from 'react';
import { render, fireEvent, getByTestId } from '@testing-library/react';
import { wrapInTestApp } from '@backstage/test-utils';
import { TriggerDialog } from './TriggerDialog';
import {
  ApiRegistry,
  alertApiRef,
  createApiRef,
  ApiProvider,
  IdentityApi,
  identityApiRef,
} from '@backstage/core';
import { pagerDutyApiRef } from '../api/pagerDutyClient';
import { TriggerButton } from './TriggerButton';
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
    const onClick = jest.fn(async () => {});

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

    const {
      getByText,
      getByRole,
      queryByText,
      queryByRole,
      getByTestId,
    } = render(
      wrapInTestApp(
        <ApiProvider apis={apis}>
          <TriggerButton entity={entity} />
          {/* <TriggerDialog
            name="pagerduty-plugin"
            onClose={onClick}
            integrationKey=""
          /> */}
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
