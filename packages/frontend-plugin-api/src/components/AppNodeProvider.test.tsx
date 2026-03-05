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

import {
  createVersionedContext,
  createVersionedValueMap,
} from '@backstage/version-bridge';
import { AppNode } from '../apis';
import { renderHook } from '@testing-library/react';
import { AppNodeProvider, useAppNode } from './AppNodeProvider';
import { withLogCollector } from '@backstage/test-utils';

describe('AppNodeProvider', () => {
  it('should provide app node context to children', () => {
    const node = { id: 'test' } as unknown as AppNode;
    const { result } = renderHook(() => useAppNode(), {
      wrapper: ({ children }) => (
        <AppNodeProvider node={node}>{children}</AppNodeProvider>
      ),
    });

    expect(result.current).toBe(node);
  });

  it('should return undefined when used outside provider', () => {
    const { result } = renderHook(() => useAppNode());
    expect(result.current).toBeUndefined();
  });

  it('should return the closest app node', () => {
    const node1 = { id: 'test1' } as unknown as AppNode;
    const node2 = { id: 'test2' } as unknown as AppNode;

    const { result } = renderHook(() => useAppNode(), {
      wrapper: ({ children }) => (
        <AppNodeProvider node={node1}>
          <AppNodeProvider node={node2}>{children}</AppNodeProvider>
        </AppNodeProvider>
      ),
    });

    expect(result.current).toBe(node2);
  });

  it('should throw error for invalid context version', () => {
    const node = { id: 'test' } as unknown as AppNode;
    const Context = createVersionedContext('app-node-context');
    const value = createVersionedValueMap({ 2: { node } });

    const { error } = withLogCollector(() => {
      expect(() =>
        renderHook(() => useAppNode(), {
          wrapper: ({ children }) => (
            <Context.Provider value={value}>{children}</Context.Provider>
          ),
        }),
      ).toThrow('AppNodeContext v1 not available');
    });
    expect(error).toEqual([
      expect.stringContaining('Error: AppNodeContext v1 not available'),
      expect.objectContaining({ type: 'unhandled-exception' }),
      expect.stringContaining('Error: AppNodeContext v1 not available'),
      expect.objectContaining({ type: 'unhandled-exception' }),
      expect.stringContaining(
        'The above error occurred in the <TestComponent> component:',
      ),
    ]);
  });
});
