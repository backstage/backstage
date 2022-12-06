/*
 * Copyright 2022 The Backstage Authors
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
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  act,
  fireEvent,
  Matcher,
  MatcherOptions,
} from '@testing-library/react';

export async function expectTriggeredIncident(
  routingKey: string,
  getByTestId: (
    id: Matcher,
    options?: MatcherOptions | undefined,
  ) => HTMLElement,
  mockTriggerAlarmFn: any,
): Promise<void> {
  const incidentType = getByTestId('trigger-incident-type');
  const incidentId = getByTestId('trigger-incident-id');
  const incidentDisplayName = getByTestId('trigger-incident-displayName');
  const incidentMessage = getByTestId('trigger-incident-message');

  await act(async () => {
    fireEvent.change(incidentType, { target: { value: 'CRITICAL' } });
    fireEvent.change(incidentId, { target: { value: 'incident-id' } });
    fireEvent.change(incidentDisplayName, {
      target: { value: 'incident-display-name' },
    });
    fireEvent.change(incidentMessage, {
      target: { value: 'incident-message' },
    });
  });

  // Trigger incident creation button
  const triggerButton = getByTestId('trigger-button');
  await act(async () => {
    fireEvent.click(triggerButton);
  });

  expect(mockTriggerAlarmFn).toHaveBeenCalled();
  expect(mockTriggerAlarmFn).toHaveBeenCalledWith({
    incidentType: 'CRITICAL',
    incidentId: 'incident-id',
    routingKey: routingKey,
    incidentDisplayName: 'incident-display-name',
    incidentMessage: 'incident-message',
  });
}
