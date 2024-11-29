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

import { ErrorList } from './ErrorList';
import { Pod } from 'kubernetes-models/v1';

describe('ErrorList', () => {
  it('error highlight should render', () => {
    const { getByText } = render(
      <ErrorList
        podAndErrors={[
          {
            cluster: { name: 'some-cluster' },
            pod: {
              metadata: {
                name: 'some-pod',
                namespace: 'some-namespace',
              },
            } as Pod,
            errors: [
              {
                type: 'some-error',
                severity: 10,
                message: 'some error message',
                occurrenceCount: 1,
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
              },
            ],
          },
        ]}
      />,
    );
    expect(getByText('some-pod')).toBeInTheDocument();
    expect(getByText('some error message')).toBeInTheDocument();
  });
});
