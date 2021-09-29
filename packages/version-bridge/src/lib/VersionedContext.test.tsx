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

import React, { useContext } from 'react';
import { renderHook } from '@testing-library/react-hooks';
import {
  createVersionedContext,
  createVersionedContextForTesting,
  useVersionedContext,
} from './VersionedContext';
import { createVersionedValueMap } from './VersionedValue';

type ContextType = { 1: string; 2: string };

describe('VersionedContext', () => {
  it('should provide a versioned value', () => {
    const Context = createVersionedContext<ContextType>('test-context-1');

    const rendered = renderHook(() => useContext(Context), {
      wrapper: ({ children }) => (
        <Context.Provider
          value={createVersionedValueMap({ 1: '1v1', 2: '1v2' })}
        >
          {children}
        </Context.Provider>
      ),
    });

    expect(rendered.result.current?.atVersion(1)).toBe('1v1');
    expect(rendered.result.current?.atVersion(2)).toBe('1v2');
  });

  it('should provide a versioned value to hook', () => {
    const Context = createVersionedContext<ContextType>('test-context-2');

    const rendered = renderHook(() => useVersionedContext('test-context-2'), {
      wrapper: ({ children }) => (
        <Context.Provider
          value={createVersionedValueMap({ 1: '2v1', 2: '2v2' })}
        >
          {children}
        </Context.Provider>
      ),
    });

    expect(rendered.result.current?.atVersion(1)).toBe('2v1');
    expect(rendered.result.current?.atVersion(2)).toBe('2v2');
  });

  it('should be provide a test utility', () => {
    const context = createVersionedContextForTesting('test-context-3');

    const rendered = renderHook(() => useVersionedContext('test-context-3'));

    expect(rendered.result.current).toBeUndefined();
    context.set({ 1: '3v1' });
    expect(rendered.result.current).toBeUndefined();
    // should need a rerender before update
    rendered.rerender();

    expect(rendered.result.current?.atVersion(1)).toBe('3v1');
    expect(rendered.result.current?.atVersion(2)).toBeUndefined();

    context.set({ 2: '3v2' });
    rendered.rerender();

    expect(rendered.result.current?.atVersion(1)).toBeUndefined();
    expect(rendered.result.current?.atVersion(2)).toBe('3v2');

    context.reset();
    rendered.rerender();
    expect(rendered.result.current).toBeUndefined();

    context.set({ 1: '3v1', 2: '3v2' });

    rendered.rerender();

    expect(rendered.result.current?.atVersion(1)).toBe('3v1');
    expect(rendered.result.current?.atVersion(2)).toBe('3v2');
  });
});
