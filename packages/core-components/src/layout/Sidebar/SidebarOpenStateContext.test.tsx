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
  LegacySidebarContext,
  SidebarOpenStateProvider,
  useSidebarOpenState,
} from './SidebarOpenStateContext';

describe('SidebarOpenStateContext', () => {
  describe('SidebarOpenStateProvider', () => {
    it('should render children', async () => {
      const { findByText } = await renderWithEffects(
        <SidebarOpenStateProvider value={{ isOpen: false, setOpen: () => {} }}>
          Child
        </SidebarOpenStateProvider>,
      );
      expect(await findByText('Child')).toBeInTheDocument();
    });

    it('should provide the legacy context as well, for now', async () => {
      const LegacyContextSpy = () => {
        const { isOpen } = useContext(LegacySidebarContext);
        return <>{String(isOpen)}</>;
      };

      const { findByText } = await renderWithEffects(
        <SidebarOpenStateProvider
          value={{
            isOpen: true,
            setOpen: () => {},
          }}
        >
          <LegacyContextSpy />
        </SidebarOpenStateProvider>,
      );

      expect(await findByText('true')).toBeInTheDocument();
    });
  });

  describe('useSidebarOpenState', () => {
    it('can be invoked within legacy context', () => {
      const wrapper = ({ children }: { children: ReactNode }) => (
        <SidebarOpenStateProvider
          value={{
            isOpen: true,
            setOpen: () => {},
          }}
        >
          {children}
        </SidebarOpenStateProvider>
      );

      const { result } = renderHook(() => useSidebarOpenState(), {
        wrapper,
      });

      expect(result.current.isOpen).toBe(true);
      expect(typeof result.current.setOpen).toBe('function');
    });

    it('does not need to be invoked within provider', () => {
      const { result } = renderHook(() => useSidebarOpenState());
      expect(result.current.isOpen).toBe(false);
      expect(typeof result.current.setOpen).toBe('function');
    });

    it('should read and update state', async () => {
      let actualValue = true;
      const wrapper = ({ children }: { children: ReactNode }) => (
        <SidebarOpenStateProvider
          value={{
            isOpen: actualValue,
            setOpen: value => {
              actualValue = value;
            },
          }}
        >
          {children}
        </SidebarOpenStateProvider>
      );
      const { result, rerender } = renderHook(() => useSidebarOpenState(), {
        wrapper,
      });

      expect(result.current.isOpen).toBe(true);

      act(() => {
        result.current.setOpen(false);
        rerender();
      });

      await waitFor(() => {
        expect(result.current.isOpen).toBe(false);
      });
    });
  });
});
