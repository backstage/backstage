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

import { FixDialog } from './FixDialog';
import { Pod } from 'kubernetes-models/v1/Pod';

jest.mock('../Events', () => ({
  Events: () => {
    return <React.Fragment data-testid="events" />;
  },
}));

jest.mock('../PodLogs', () => ({
  PodLogs: () => {
    return <React.Fragment data-testid="logs" />;
  },
}));

describe('FixDialog', () => {
  it('docs link should render', () => {
    const { getByText } = render(
      <FixDialog
        open
        clusterName="some-cluster"
        pod={
          {
            metadata: {
              name: 'some-pod',
              namespace: 'some-namespace',
            },
          } as Pod
        }
        error={{
          type: 'some error type',
          severity: 10,
          message: 'some error message',
          occuranceCount: 1,
          sourceRef: {
            name: 'some-pod',
            namespace: 'some-namespace',
            kind: 'Pod',
            apiGroup: 'v1',
          },
          proposedFix: {
            type: 'docs',
            docsLink: 'http://google.com',
            errorType: 'some error type',
            rootCauseExplanation: 'some root cause',
            actions: ['fix1', 'fix2'],
          },
        }}
      />,
    );
    expect(getByText('Open docs')).toBeInTheDocument();
    expect(getByText('some error message')).toBeInTheDocument();
    expect(getByText('some-pod - some error type')).toBeInTheDocument();
    expect(getByText('some root cause')).toBeInTheDocument();
    expect(getByText('fix1')).toBeInTheDocument();
    expect(getByText('fix2')).toBeInTheDocument();
  });
  it('events button should render', () => {
    const { getByText } = render(
      <FixDialog
        open
        clusterName="some-cluster"
        pod={
          {
            metadata: {
              name: 'some-pod',
              namespace: 'some-namespace',
            },
          } as Pod
        }
        error={{
          type: 'some error type',
          severity: 10,
          message: 'some error message',
          occuranceCount: 1,
          sourceRef: {
            name: 'some-pod',
            namespace: 'some-namespace',
            kind: 'Pod',
            apiGroup: 'v1',
          },
          proposedFix: {
            type: 'events',
            podName: 'some-pod',
            errorType: 'some error type',
            rootCauseExplanation: 'some root cause',
            actions: ['fix1', 'fix2'],
          },
        }}
      />,
    );
    expect(getByText('Events:')).toBeInTheDocument();
    expect(getByText('some error message')).toBeInTheDocument();
    expect(getByText('some-pod - some error type')).toBeInTheDocument();
    expect(getByText('some root cause')).toBeInTheDocument();
    expect(getByText('fix1')).toBeInTheDocument();
    expect(getByText('fix2')).toBeInTheDocument();
  });
  it('Logs button should render', () => {
    const { getByText } = render(
      <FixDialog
        open
        clusterName="some-cluster"
        pod={
          {
            metadata: {
              name: 'some-pod',
              namespace: 'some-namespace',
            },
          } as Pod
        }
        error={{
          type: 'some error type',
          severity: 10,
          message: 'some error message',
          occuranceCount: 1,
          sourceRef: {
            name: 'some-pod',
            namespace: 'some-namespace',
            kind: 'Pod',
            apiGroup: 'v1',
          },
          proposedFix: {
            type: 'logs',
            container: 'some-container',
            errorType: 'some error type',
            rootCauseExplanation: 'some root cause',
            actions: ['fix1', 'fix2'],
          },
        }}
      />,
    );
    expect(getByText('Crash logs:')).toBeInTheDocument();
    expect(getByText('some error message')).toBeInTheDocument();
    expect(getByText('some-pod - some error type')).toBeInTheDocument();
    expect(getByText('some root cause')).toBeInTheDocument();
    expect(getByText('fix1')).toBeInTheDocument();
    expect(getByText('fix2')).toBeInTheDocument();
  });
});
