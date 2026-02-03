/*
 * Copyright 2023 The Backstage Authors
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
import { useApi } from '@backstage/core-plugin-api';
import { renderHook, waitFor } from '@testing-library/react';
import { useEvents } from './useEvents';
import { DateTime } from 'luxon';

jest.mock('@backstage/core-plugin-api');

jest.mock('@backstage/plugin-kubernetes', () => ({
  kubernetesProxyApiRef: () => jest.fn(),
}));

const oneHourAgo = DateTime.now().minus({ hours: 1 }).toISO();

const response = [
  {
    type: 'Info',
    message: 'hello there',
    reason: 'something happened',
    count: 52,
    metadata: {
      creationTimestamp: oneHourAgo,
    },
  },
] as any;

describe('Events', () => {
  const mockGetEventsByInvolvedObjectName = jest.fn();
  afterEach(() => {
    jest.resetAllMocks();
  });
  it('should fetch and show events', async () => {
    (useApi as any).mockReturnValue({
      getEventsByInvolvedObjectName:
        mockGetEventsByInvolvedObjectName.mockResolvedValue(response),
    });

    const { result } = renderHook(() =>
      useEvents({
        involvedObjectName: 'some-objecgt',
        namespace: 'some-namespace',
        clusterName: 'some-cluster',
      }),
    );

    expect(result.current.loading).toEqual(true);

    await waitFor(() => {
      expect(result.current.loading).toEqual(false);
    });

    expect(result.current.error).toBeUndefined();
    expect(result.current.loading).toEqual(false);
    expect(result.current.value).toStrictEqual(response);
  });
});
