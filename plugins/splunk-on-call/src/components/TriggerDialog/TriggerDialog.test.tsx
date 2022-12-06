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
import { ApiProvider } from '@backstage/core-app-api';
import { alertApiRef } from '@backstage/core-plugin-api';
import { TestApiRegistry, wrapInTestApp } from '@backstage/test-utils';
import { render } from '@testing-library/react';
import React from 'react';
import { splunkOnCallApiRef } from '../../api';
import { TriggerDialog } from './TriggerDialog';
import { expectTriggeredIncident } from './testUtils';

describe('TriggerDialog', () => {
  const mockTriggerAlarmFn = jest.fn();
  const mockSplunkOnCallApi = {
    incidentAction: mockTriggerAlarmFn,
  };

  const apis = TestApiRegistry.from(
    [alertApiRef, {}],
    [splunkOnCallApiRef, mockSplunkOnCallApi],
  );

  it('open the dialog and trigger an alarm', async () => {
    const { getByText, getByRole, getByTestId } = render(
      wrapInTestApp(
        <ApiProvider apis={apis}>
          <TriggerDialog
            routingKey="Example"
            showDialog
            handleDialog={() => {}}
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
    await expectTriggeredIncident('Example', getByTestId, mockTriggerAlarmFn);
  });
});
