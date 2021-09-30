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

import { renderHook } from '@testing-library/react-hooks';
import { useAnalytics } from './useAnalytics';
import { useApi } from '../apis';

jest.mock('../apis');

const mocked = (f: Function) => f as jest.Mock;

describe('useAnalytics', () => {
  it('returns tracker with no implementation defined', () => {
    // Simulate useApi() throwing an error.
    mocked(useApi).mockImplementation(() => {
      throw new Error();
    });

    // Result should still have a captureEvent method.
    const { result } = renderHook(() => useAnalytics());
    expect(result.current.captureEvent).toBeDefined();
  });

  it('returns tracker from defined analytics api', () => {
    const expectedFunction = 'capture function';
    const getDecoratedTracker = jest.fn().mockReturnValue({
      captureEvent: expectedFunction,
    });

    // Simulate useApi returning a valid tracker.
    mocked(useApi).mockReturnValue({ getDecoratedTracker });

    // The getDecoratedTracker method of the underlying implementation should
    // have been called with the domain provided.
    const { result } = renderHook(() => useAnalytics());
    expect(getDecoratedTracker).toHaveBeenCalledWith({
      domain: {
        componentName: 'App',
        pluginId: 'root',
        routeRef: 'unknown',
      },
    });

    // And the returned tracker's captureEvent should have come from the API
    // implementation.
    expect(result.current.captureEvent).toBe(expectedFunction);
  });
});
