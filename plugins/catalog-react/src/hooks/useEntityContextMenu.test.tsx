/*
 * Copyright 2025 The Backstage Authors
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
import { ReactNode } from 'react';
import { useEntityContextMenu } from './useEntityContextMenu';
import { renderHook } from '@testing-library/react';
import {
  createVersionedContext,
  createVersionedValueMap,
} from '@backstage/version-bridge';

const Context = createVersionedContext<{
  1: { onMenuClose: () => void };
}>('entity-context-menu-context');

const Provider = ({
  children,
  onMenuClose,
}: {
  children: ReactNode;
  onMenuClose: () => void;
}) => (
  <Context.Provider value={createVersionedValueMap({ 1: { onMenuClose } })}>
    {children}
  </Context.Provider>
);

describe('useEntityContextMenu', () => {
  it('should throw error when used outside of provider', () => {
    expect(() => {
      renderHook(() => useEntityContextMenu());
    }).toThrow(
      'useEntityContextMenu must be used within an EntityContextMenuProvider',
    );
  });

  it('should return the context value', () => {
    const mockOnMenuClose = jest.fn();
    const { result } = renderHook(() => useEntityContextMenu(), {
      wrapper: ({ children }) => (
        <Provider onMenuClose={mockOnMenuClose}>{children}</Provider>
      ),
    });

    expect(result.current.onMenuClose).toBe(mockOnMenuClose);
  });
});
