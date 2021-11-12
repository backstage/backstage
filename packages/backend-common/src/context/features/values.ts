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

/**
 * An immutable key-value list. The only operations possible are to add a new
 * node at the start forming a new list, and to find by key from the start and
 * backwards through the list.
 */
export type ContextValues = ContextValueNode | undefined;

type ContextValueNode = {
  key: string | symbol;
  value: unknown;
  next: ContextValueNode | undefined;
};

/**
 * Creates a new list with the given key-value pair as its first element.
 *
 * @param list - The original list
 * @param key - The key of the pair
 * @param value - The value of the pair, or a function that accepts the
 *                previously stored value (or undefined if not found) and
 *                computes the new value
 * @returns A new list with this pair as its first element
 */
export function unshiftContextValues(
  list: ContextValues,
  key: string | symbol,
  value: unknown | ((previous: unknown | undefined) => unknown),
): ContextValues {
  return {
    key,
    value:
      typeof value === 'function'
        ? value(findInContextValues(list, key))
        : value,
    next: list,
  };
}

/**
 * Attempts to find the value associated with a given key, starting from the
 * most recently added element.
 *
 * @param list - The list
 * @param key - The key to search for
 * @returns The first such value, or undefined if no match was found
 */
export function findInContextValues<T = unknown>(
  list: ContextValues,
  key: string | symbol,
): T | undefined {
  for (let current = list; current; current = current.next) {
    if (key === current.key) {
      return current.value as T;
    }
  }
  return undefined;
}
