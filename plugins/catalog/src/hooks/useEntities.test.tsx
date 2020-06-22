/*
 * Copyright 2020 Spotify AB
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
import { renderHook, act } from '@testing-library/react-hooks';
import { useEntityFilterGroup } from './useEntities';

describe('useEntitiesHooks', () => {
  const testEntities = [
    { name: 'test1', type: 'type1' },
    { name: 'test2', type: 'type2' },
    { name: 'test3', type: 'type3' },
    { name: 'test4', type: 'type2' },
    { name: 'test5', type: 'type2' },
  ];

  type TestEntitiy = {
    name: string;
    type: string;
  };

  const testFilterFunctions = {
    type1: {
      filterFunction: (entity: TestEntitiy) => entity.type === 'type1',
      isSelected: false,
    },
    type2: {
      filterFunction: (entity: TestEntitiy) => entity.type === 'type2',
      isSelected: false,
    },
    type3: {
      filterFunction: (entity: TestEntitiy) => entity.type === 'type3',
      isSelected: false,
    },
  };

  it('should calculate count', async () => {
    const { result } = renderHook(() =>
      useEntityFilterGroup<TestEntitiy>(testEntities, testFilterFunctions),
    );

    expect(result.current.states.type1.count).toBe(1);
    expect(result.current.states.type2.count).toBe(3);
    expect(result.current.states.type3.count).toBe(1);
  });

  it('should set the isSelected flag properly', () => {
    const { result } = renderHook(() =>
      useEntityFilterGroup<TestEntitiy>(testEntities, testFilterFunctions),
    );

    expect(result.current.states.type1.isSelected).toBeFalsy();
    expect(result.current.states.type2.isSelected).toBeFalsy();
    expect(result.current.states.type3.isSelected).toBeFalsy();

    act(() => {
      result.current.selectItems(['type1']);
    });

    expect(result.current.states.type1.isSelected).toBeTruthy();
    expect(result.current.states.type2.isSelected).toBeFalsy();
    expect(result.current.states.type3.isSelected).toBeFalsy();
  });

  it('should filter entities', () => {
    const { result } = renderHook(() =>
      useEntityFilterGroup<TestEntitiy>(testEntities, testFilterFunctions),
    );

    act(() => {
      result.current.selectItems(['type1']);
    });
    expect(result.current.filteredItems).toEqual([
      { name: 'test1', type: 'type1' },
    ]);

    act(() => {
      result.current.selectItems(['type2']);
    });
    expect(result.current.filteredItems).toEqual([
      { name: 'test2', type: 'type2' },
      { name: 'test4', type: 'type2' },
      { name: 'test5', type: 'type2' },
    ]);

    act(() => {
      result.current.selectItems(['type3', 'type1']);
    });
    expect(result.current.filteredItems).toEqual([
      { name: 'test1', type: 'type1' },
      { name: 'test3', type: 'type3' },
    ]);
  });
});
