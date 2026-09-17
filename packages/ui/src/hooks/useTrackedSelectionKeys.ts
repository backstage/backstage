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

import { useCallback, useState } from 'react';
import type { Key, Selection } from 'react-aria-components';

type UseTrackedSelectionKeysProps = {
  selectedKeys?: Selection;
  defaultSelectedKeys?: Selection;
  onSelectionChange?: (keys: Selection) => void;
};

export function useTrackedSelectionKeys({
  selectedKeys,
  defaultSelectedKeys,
  onSelectionChange,
}: UseTrackedSelectionKeysProps) {
  const [uncontrolledSelectedKeys, setUncontrolledSelectedKeys] =
    useState<Selection>(() => defaultSelectedKeys ?? new Set<Key>());

  const handleSelectionChange = useCallback(
    (keys: Selection) => {
      setUncontrolledSelectedKeys(keys);
      onSelectionChange?.(keys);
    },
    [onSelectionChange],
  );

  return {
    selectedKeys: selectedKeys ?? uncontrolledSelectedKeys,
    onSelectionChange: handleSelectionChange,
  };
}
