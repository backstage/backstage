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
import React from 'react';

import { render } from '@testing-library/react';

import '@testing-library/jest-dom';
import { wrapInTestApp } from '@backstage/test-utils';
import { PendingPodContent } from './PendingPodContent';
import { IPodCondition } from 'kubernetes-models/v1';
import { DateTime } from 'luxon';

const podWithConditions = (conditions: IPodCondition[]): any => {
  return {
    metadata: {
      name: 'ok-pod',
    },
    spec: {
      containers: [
        {
          name: 'some-container',
        },
      ],
    },
    status: {
      podIP: '127.0.0.1',
      conditions: conditions,
    },
  };
};

describe('PendingPodContent', () => {
  it('show startup conditions - all healthy', async () => {
    const oneDayAgo = DateTime.now().minus({ days: 1 }).toISO();
    const { getByText, queryByLabelText, queryAllByLabelText } = render(
      wrapInTestApp(
        <PendingPodContent
          {...{
            pod: podWithConditions([
              {
                type: 'Initialized',
                status: 'True',
                lastTransitionTime: oneDayAgo,
              },
              {
                type: 'PodScheduled',
                status: 'True',
                lastTransitionTime: oneDayAgo,
              },
              {
                type: 'ContainersReady',
                status: 'True',
                lastTransitionTime: oneDayAgo,
              },
              {
                type: 'Ready',
                status: 'True',
                lastTransitionTime: oneDayAgo,
              },
            ]),
          }}
        />,
      ),
    );
    expect(getByText('Pod is Pending. Conditions:')).toBeInTheDocument();

    expect(getByText('Initialized - (1 day ago)')).toBeInTheDocument();
    expect(getByText('PodScheduled - (1 day ago)')).toBeInTheDocument();
    expect(getByText('ContainersReady - (1 day ago)')).toBeInTheDocument();
    expect(getByText('Ready - (1 day ago)')).toBeInTheDocument();

    expect(queryAllByLabelText('Status ok')).toHaveLength(4);
    expect(queryByLabelText('Status warning')).not.toBeInTheDocument();
    expect(queryByLabelText('Status error')).not.toBeInTheDocument();
  });
  it('show startup conditions - all fail', async () => {
    const oneHourAgo = DateTime.now().minus({ hours: 1 }).toISO();
    const { getByText, queryByLabelText, queryAllByLabelText } = render(
      wrapInTestApp(
        <PendingPodContent
          {...{
            pod: podWithConditions([
              {
                type: 'Initialized',
                status: 'False',
                reason: 'InitializedFailureReason',
                message: 'reason why Initialized failed',
                lastTransitionTime: oneHourAgo,
              },
              {
                type: 'PodScheduled',
                status: 'False',
                reason: 'PodScheduledFailureReason',
                message: 'reason why PodScheduled failed',
                lastTransitionTime: oneHourAgo,
              },
              {
                type: 'ContainersReady',
                status: 'False',
                reason: 'ContainersReadyFailureReason',
                message: 'reason why ContainersReady failed',
                lastTransitionTime: oneHourAgo,
              },
              {
                type: 'Ready',
                status: 'False',
                reason: 'ReadyFailureReason',
                message: 'reason why Ready failed',
                lastTransitionTime: oneHourAgo,
              },
            ]),
          }}
        />,
      ),
    );
    expect(getByText('Pod is Pending. Conditions:')).toBeInTheDocument();

    expect(
      getByText(
        'Initialized - (InitializedFailureReason 1 hour ago) - reason why Initialized failed',
      ),
    ).toBeInTheDocument();
    expect(
      getByText(
        'PodScheduled - (PodScheduledFailureReason 1 hour ago) - reason why PodScheduled failed',
      ),
    ).toBeInTheDocument();
    expect(
      getByText(
        'ContainersReady - (ContainersReadyFailureReason 1 hour ago) - reason why ContainersReady failed',
      ),
    ).toBeInTheDocument();
    expect(
      getByText(
        'Ready - (ReadyFailureReason 1 hour ago) - reason why Ready failed',
      ),
    ).toBeInTheDocument();

    expect(queryByLabelText('Status ok')).not.toBeInTheDocument();
    expect(queryByLabelText('Status warning')).not.toBeInTheDocument();
    expect(queryAllByLabelText('Status error')).toHaveLength(4);
  });
  it('show startup conditions - show unknown', async () => {
    const oneHourAgo = DateTime.now().minus({ hours: 1 }).toISO();
    const { getByText, queryByLabelText, getByLabelText } = render(
      wrapInTestApp(
        <PendingPodContent
          {...{
            pod: podWithConditions([
              {
                type: 'Initialized',
                status: 'Unknown',
                reason: 'InitializedUnknownReason',
                message: 'dont know what is happening',
                lastTransitionTime: oneHourAgo,
              },
            ]),
          }}
        />,
      ),
    );
    expect(getByText('Pod is Pending. Conditions:')).toBeInTheDocument();

    expect(
      getByText('Initialized - (1 hour ago) dont know what is happening'),
    ).toBeInTheDocument();

    expect(queryByLabelText('Status ok')).not.toBeInTheDocument();
    expect(getByLabelText('Status warning')).toBeInTheDocument();
    expect(queryByLabelText('Status error')).not.toBeInTheDocument();
  });
});
