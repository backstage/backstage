/*
 * Copyright 2021 The Backstage Authors
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

import { renderHook } from '@testing-library/react';
import { useAnalytics } from './useAnalytics';
import { analyticsApiRef } from '@backstage/core-plugin-api';
import { TestApiProvider } from '@backstage/test-utils';
import React from 'react';

describe('useAnalytics', () => {
  it('returns tracker with no implementation defined', () => {
    // useApi throws an error because the Analytics API is not implemented
    // But the result should still have a captureEvent method.
    const { result } = renderHook(() => useAnalytics(), {});
    expect(result.current.captureEvent).toBeDefined();
  });

  it('returns tracker from defined analytics api', () => {
    const captureEvent = jest.fn();

    // Calling the captureEvent method of the underlying implementation should
    // pass along the given event as well as the default context.
    const { result } = renderHook(() => useAnalytics(), {
      wrapper: ({ children }) => (
        // Simulate useApi returning a valid tracker.
        <TestApiProvider apis={[[analyticsApiRef, { captureEvent }]]}>
          {children}
        </TestApiProvider>
      ),
    });
    result.current.captureEvent('an action', 'a subject', {
      value: 42,
      attributes: { some: 'value' },
    });
    expect(captureEvent).toHaveBeenCalledWith({
      action: 'an action',
      subject: 'a subject',
      value: 42,
      attributes: {
        some: 'value',
      },
      context: {
        extensionId: 'app',
        pluginId: 'app',
      },
    });
  });
});
