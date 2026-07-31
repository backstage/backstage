/*
 * Copyright 2026 The Backstage Authors
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

import { PropsWithChildren } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { renderHook, act } from '@testing-library/react';
import { appHistoryApiRef } from '@backstage/frontend-plugin-api';
import { createMockAppHistory } from '@backstage/frontend-test-utils';
import { TestApiProvider } from '@backstage/test-utils';
import { useChromeGoBack } from './useChromeGoBack';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('useChromeGoBack', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('calls window.history.back() without React Router (NFS)', () => {
    const historyBack = jest.spyOn(window.history, 'back').mockReturnValue();
    const appHistory = createMockAppHistory();

    const { result } = renderHook(() => useChromeGoBack(), {
      wrapper: ({ children }: PropsWithChildren<{}>) => (
        <TestApiProvider apis={[[appHistoryApiRef, appHistory]]}>
          {children}
        </TestApiProvider>
      ),
    });

    act(() => {
      result.current();
    });

    expect(historyBack).toHaveBeenCalledTimes(1);
    expect(mockNavigate).not.toHaveBeenCalled();

    historyBack.mockRestore();
  });

  it('calls react-router navigate(-1) when there is no app history (OFS)', () => {
    const { result } = renderHook(() => useChromeGoBack(), {
      wrapper: ({ children }: PropsWithChildren<{}>) => (
        <MemoryRouter>{children}</MemoryRouter>
      ),
    });

    act(() => {
      result.current();
    });

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});
