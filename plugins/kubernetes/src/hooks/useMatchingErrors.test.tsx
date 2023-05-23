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
import { renderHook } from '@testing-library/react-hooks';
import { DetectedErrorsContext, useMatchingErrors } from './useMatchingErrors';
import { DetectedError } from '../error-detection';
import { ResourceRef } from '../error-detection/types';

const genericErrorWithRef = (resourceRef: ResourceRef): DetectedError => {
  return {
    type: 'some-error',
    severity: 10,
    message: 'some error message',
    occuranceCount: 1,
    sourceRef: resourceRef,
    proposedFix: [
      {
        type: 'logs',
        container: 'some-container',
        errorType: 'some error type',
        rootCauseExplanation: 'some root cause',
        possibleFixes: ['fix1', 'fix2'],
      },
    ],
  };
};

describe('useMatchingErrors', () => {
  it('should filter non-matching resources', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <DetectedErrorsContext.Provider
        value={[
          genericErrorWithRef({
            name: 'some-other-pod',
            namespace: 'some-namespace',
            kind: 'some-kind',
            apiGroup: 'some-apiGroup',
          }),
          genericErrorWithRef({
            name: 'some-name',
            namespace: 'some-namespace',
            kind: 'some-kind',
            apiGroup: 'some-apiGroup',
          }),
        ]}
      >
        {children}
      </DetectedErrorsContext.Provider>
    );

    const { result } = renderHook(
      () =>
        useMatchingErrors({
          metadata: {
            name: 'some-name',
            namespace: 'some-namespace',
          },
          kind: 'some-kind',
          apiVersion: 'some-apiGroup',
        }),
      { wrapper },
    );
    expect(result.current).toStrictEqual([
      genericErrorWithRef({
        name: 'some-name',
        namespace: 'some-namespace',
        kind: 'some-kind',
        apiGroup: 'some-apiGroup',
      }),
    ]);
  });
});
