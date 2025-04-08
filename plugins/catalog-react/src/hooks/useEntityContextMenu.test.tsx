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
import React from 'react';
import {
  EntityContextMenuProvider,
  useEntityContextMenu,
} from './useEntityContextMenu';
import { renderHook } from '@testing-library/react';

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
        <EntityContextMenuProvider onMenuClose={mockOnMenuClose}>
          {children}
        </EntityContextMenuProvider>
      ),
    });

    expect(result.current.onMenuClose).toBe(mockOnMenuClose);
  });
});
