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

// The BUI Select component supports selectionMode="multiple" at runtime,
// but the TypeScript types don't expose the controlled multi-select props
// (selectedKeys, onSelectionChange with Set) because react-aria's Select
// type is inherently single-select. This helper provides the props in a
// type-safe way until the BUI types are fixed.
export function multiSelectProps(
  selected: string[],
  setSelected: (values: string[]) => void,
  allOptions?: string[],
): Record<string, unknown> {
  return {
    selectedKeys: new Set(selected),
    onSelectionChange: (keys: Set<string> | 'all') => {
      if (keys === 'all') {
        setSelected(allOptions ?? []);
      } else {
        setSelected([...keys].map(String));
      }
    },
  };
}
