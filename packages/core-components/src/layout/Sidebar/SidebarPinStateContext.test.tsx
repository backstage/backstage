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
import React, { ReactNode } from 'react';
import { renderInTestApp } from '@backstage/test-utils';
import { screen, waitFor } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react-hooks';
import {
  SidebarPinStateContextProvider,
  useSidebarPinState,
} from './SidebarPinStateContext';

describe('SidebarContext', () => {
  describe('SidebarContextProvider', () => {
    it('should render children', async () => {
      await renderInTestApp(
        <SidebarPinStateContextProvider
          value={{
            isPinned: true,
            isMobile: false,
            toggleSidebarPinState: () => {},
          }}
        >
          Child
        </SidebarPinStateContextProvider>,
      );
      expect(await screen.findByText('Child')).toBeInTheDocument();
    });
  });

  describe('useSidebar', () => {
    it('does not need to be invoked within provider', () => {
      const { result } = renderHook(() => useSidebarPinState());
      expect(result.current.isPinned).toBe(true);
      expect(result.current.isMobile).toBe(false);
      expect(typeof result.current.toggleSidebarPinState).toBe('function');
    });

    it('should read and update state', async () => {
      let actualValue = true;
      const wrapper = ({ children }: { children: ReactNode }) => (
        <SidebarPinStateContextProvider
          value={{
            isPinned: actualValue,
            isMobile: false,
            toggleSidebarPinState: () => {
              actualValue = !actualValue;
            },
          }}
        >
          {children}
        </SidebarPinStateContextProvider>
      );
      const { result } = renderHook(() => useSidebarPinState(), { wrapper });

      expect(result.current.isPinned).toBe(true);

      act(() => {
        result.current.toggleSidebarPinState();
      });

      waitFor(() => {
        expect(result.current.isPinned).toBe(false);
      });
    });
  });
});
