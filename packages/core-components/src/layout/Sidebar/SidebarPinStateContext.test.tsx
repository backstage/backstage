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
import React, { ReactNode, useContext } from 'react';
import { renderWithEffects } from '@backstage/test-utils';
import { waitFor } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react-hooks';
import {
  LegacySidebarPinStateContext,
  SidebarPinStateProvider,
  useSidebarPinState,
} from './SidebarPinStateContext';

describe('SidebarPinStateContext', () => {
  describe('SidebarPinStateProvider', () => {
    it('should render children', async () => {
      const { findByText } = await renderWithEffects(
        <SidebarPinStateProvider
          value={{
            isPinned: true,
            isMobile: false,
            toggleSidebarPinState: () => {},
          }}
        >
          Child
        </SidebarPinStateProvider>,
      );
      expect(await findByText('Child')).toBeInTheDocument();
    });

    it('should provide the legacy context as well, for now', async () => {
      const LegacyContextSpy = () => {
        const { isMobile } = useContext(LegacySidebarPinStateContext);
        return <>{String(isMobile)}</>;
      };

      const { findByText } = await renderWithEffects(
        <SidebarPinStateProvider
          value={{
            isPinned: true,
            isMobile: true,
            toggleSidebarPinState: () => {},
          }}
        >
          <LegacyContextSpy />
        </SidebarPinStateProvider>,
      );

      expect(await findByText('true')).toBeInTheDocument();
    });
  });

  describe('useSidebarPinState', () => {
    it('can be invoked within legacy context', () => {
      const wrapper = ({ children }: { children: ReactNode }) => (
        <LegacySidebarPinStateContext.Provider
          value={{
            isPinned: true,
            isMobile: true,
            toggleSidebarPinState: () => {},
          }}
        >
          {children}
        </LegacySidebarPinStateContext.Provider>
      );

      const { result } = renderHook(() => useSidebarPinState(), {
        wrapper,
      });

      expect(result.current.isPinned).toBe(true);
      expect(result.current.isMobile).toBe(true);
      expect(typeof result.current.toggleSidebarPinState).toBe('function');
    });

    it('does not need to be invoked within provider', () => {
      const { result } = renderHook(() => useSidebarPinState());
      expect(result.current.isPinned).toBe(true);
      expect(result.current.isMobile).toBe(false);
      expect(typeof result.current.toggleSidebarPinState).toBe('function');
    });

    it('should read and update state', async () => {
      let actualValue = true;
      const wrapper = ({ children }: { children: ReactNode }) => (
        <SidebarPinStateProvider
          value={{
            isPinned: actualValue,
            isMobile: false,
            toggleSidebarPinState: () => {
              actualValue = !actualValue;
            },
          }}
        >
          {children}
        </SidebarPinStateProvider>
      );
      const { result, rerender } = renderHook(() => useSidebarPinState(), {
        wrapper,
      });

      expect(result.current.isPinned).toBe(true);

      act(() => {
        result.current.toggleSidebarPinState();
        rerender();
      });

      await waitFor(() => {
        expect(result.current.isPinned).toBe(false);
      });
    });
  });
});
