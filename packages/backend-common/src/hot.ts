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

// Find all active hot module APIs of all ancestors of a module, including the module itself
function findAllAncestors(_module: NodeModule): NodeModule[] {
  const ancestors = new Array<NodeModule>();
  const parentIds = new Set<string | number>();

  function add(id: string | number, m: NodeModule) {
    if (parentIds.has(id)) {
      return;
    }
    parentIds.add(id);
    ancestors.push(m);

    for (const parentId of (m as any).parents) {
      const parent = require.cache[parentId];
      if (parent) {
        add(parentId, parent);
      }
    }
  }

  add(_module.id, _module);

  return ancestors;
}

/**
 * useHotCleanup allows cleanup of ongoing effects when a module is
 * hot-reloaded during development. The cleanup function will be called
 * whenever the module itself or any of its parent modules is hot-reloaded.
 *
 * Useful for cleaning intervals, timers, requests etc
 *
 * @example
 * ```ts
 * const intervalId = setInterval(doStuff, 1000);
 * useHotCleanup(module, () => clearInterval(intervalId));
 * ```
 * @param _module Reference to the current module where you invoke the fn
 * @param cancelEffect Fn that cleans up the ongoing effects
 */
export function useHotCleanup(_module: NodeModule, cancelEffect: () => void) {
  if (_module.hot) {
    const ancestors = findAllAncestors(_module);
    let cancelled = false;

    const handler = () => {
      if (!cancelled) {
        cancelled = true;
        cancelEffect();
      }
    };

    for (const m of ancestors) {
      m.hot?.addDisposeHandler(handler);
    }
  }
}

/**
 * This function allows devs to preserve
 * some value between hot-reloads.
 * Useful for stateful parts of the backend
 * @example
 * ```ts
 * const db = useHotMemoize(module, () => createDB(dbParams));
 * ```
 * @param _module Reference to the current module where you invoke the fn
 * @param valueFactory Fn that returns the value you want to memoize
 * @warning Don't use inside conditionals or loops,
 * same rules as for hooks apply (https://reactjs.org/docs/hooks-rules.html)
 */
export function useHotMemoize<T>(
  _module: NodeModule,
  valueFactory: () => T,
): T {
  const CURRENT_HOT_MEMOIZE_INDEX_KEY = 'backstage.io/hmr-memoize-key';

  if (!_module.hot) {
    // Just return value straight away
    return valueFactory();
  }

  if (_module.hot && typeof _module.hot.data === 'undefined') {
    // First run, init the module data
    _module.hot.data = {
      [CURRENT_HOT_MEMOIZE_INDEX_KEY]: 0,
    };
  }

  // Let's store data per module based on the order of the code invocation
  const index = _module.hot.data[CURRENT_HOT_MEMOIZE_INDEX_KEY];
  // Increasing the counter after each call
  _module.hot.data[CURRENT_HOT_MEMOIZE_INDEX_KEY] += 1;

  const prevValue = _module.hot.data[index];
  const createDisposeHandler = (value: any) => (data: {
    [key: number]: any;
    [indexKey: string]: number;
  }) => {
    // Preserving the value through the HMR process
    data[index] = value;
    // Decreasing the counter after each handler
    data[CURRENT_HOT_MEMOIZE_INDEX_KEY] =
      // First hot update is still different, need to populate the data
      typeof data[CURRENT_HOT_MEMOIZE_INDEX_KEY] === 'undefined'
        ? _module.hot!.data[CURRENT_HOT_MEMOIZE_INDEX_KEY] - 1
        : data[CURRENT_HOT_MEMOIZE_INDEX_KEY] - 1;
  };

  if (prevValue) {
    _module.hot!.addDisposeHandler(createDisposeHandler(prevValue));
    return prevValue;
  }

  const newValue = valueFactory();
  _module.hot.addDisposeHandler(createDisposeHandler(newValue));
  return newValue;
}
