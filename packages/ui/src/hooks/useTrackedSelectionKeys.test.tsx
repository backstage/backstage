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

import { act, renderHook } from '@testing-library/react';
import type { Key, Selection } from 'react-aria-components';
import { useTrackedSelectionKeys } from './useTrackedSelectionKeys';

function expectKeys(selection: Selection, expectedKeys: Key[]) {
  if (selection === 'all') {
    throw new Error('Expected an explicit set of selected keys');
  }

  expect(selection).toBeInstanceOf(Set);
  expect([...selection]).toEqual(expectedKeys);
}

describe('useTrackedSelectionKeys', () => {
  it('prefers controlled keys over locally tracked updates', () => {
    const onSelectionChange = jest.fn();
    const controlledKeys = new Set<Key>(['ada']);
    const { result } = renderHook(() =>
      useTrackedSelectionKeys({
        selectedKeys: controlledKeys,
        onSelectionChange,
      }),
    );

    act(() => result.current.onSelectionChange(new Set(['grace'])));

    expect(result.current.selectedKeys).toBe(controlledKeys);
    expect(onSelectionChange).toHaveBeenCalledWith(new Set(['grace']));
  });

  it('initializes uncontrolled state from default keys', () => {
    const defaultSelectedKeys = new Set<Key>(['ada']);
    const { result } = renderHook(() =>
      useTrackedSelectionKeys({ defaultSelectedKeys }),
    );

    expect(result.current.selectedKeys).toBe(defaultSelectedKeys);
  });

  it('updates uncontrolled state before calling the consumer callback', () => {
    let wrappedOnSelectionChange: ((keys: Selection) => void) | undefined;
    let queueNestedUpdate = true;
    const onSelectionChange = jest.fn(() => {
      if (queueNestedUpdate) {
        queueNestedUpdate = false;
        wrappedOnSelectionChange?.(new Set(['grace']));
      }
    });
    const { result } = renderHook(() =>
      useTrackedSelectionKeys({ onSelectionChange }),
    );
    wrappedOnSelectionChange = result.current.onSelectionChange;

    act(() => result.current.onSelectionChange(new Set(['ada'])));

    expectKeys(result.current.selectedKeys, ['grace']);
    expect(onSelectionChange).toHaveBeenCalledTimes(2);
  });

  it('replaces controlled keys on rerender', () => {
    const { result, rerender } = renderHook(
      ({ selectedKeys }: { selectedKeys: Selection }) =>
        useTrackedSelectionKeys({ selectedKeys }),
      { initialProps: { selectedKeys: new Set<Key>(['ada']) } },
    );

    rerender({ selectedKeys: new Set(['grace']) });

    expectKeys(result.current.selectedKeys, ['grace']);
  });

  it('clears uncontrolled selection with an empty set', () => {
    const { result } = renderHook(() =>
      useTrackedSelectionKeys({
        defaultSelectedKeys: new Set(['ada']),
      }),
    );

    act(() => result.current.onSelectionChange(new Set()));

    expectKeys(result.current.selectedKeys, []);
  });

  it('keeps multiple selected keys as a set', () => {
    const { result } = renderHook(() => useTrackedSelectionKeys({}));

    act(() =>
      result.current.onSelectionChange(new Set(['ada', 'grace', 'linus'])),
    );

    expectKeys(result.current.selectedKeys, ['ada', 'grace', 'linus']);
  });

  it('preserves the React Aria all-selection value', () => {
    const { result } = renderHook(() =>
      useTrackedSelectionKeys({ defaultSelectedKeys: 'all' }),
    );

    expect(result.current.selectedKeys).toBe('all');

    act(() => result.current.onSelectionChange(new Set(['ada'])));
    expectKeys(result.current.selectedKeys, ['ada']);

    act(() => result.current.onSelectionChange('all'));
    expect(result.current.selectedKeys).toBe('all');
  });
});
