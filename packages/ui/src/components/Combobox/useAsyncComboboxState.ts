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

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Key } from 'react-aria-components';
import type {
  AsyncListSource,
  CollectionItem,
} from '../../types/selectableCollection';

type AsyncComboboxItem = CollectionItem &
  ({ textValue: string } | { label: string });

function getItemTextValue(item: AsyncComboboxItem) {
  return 'textValue' in item ? item.textValue : item.label;
}

function resolveNextSelectedItem<T extends CollectionItem>({
  key,
  currentItem,
  sourceItems,
  isControlled,
}: {
  key: Key | null;
  currentItem: T | null;
  sourceItems: T[];
  isControlled: boolean;
}) {
  if (key === null) {
    return null;
  }

  if (isControlled && currentItem?.id === key) {
    return currentItem;
  }

  return sourceItems.find(item => item.id === key) ?? currentItem;
}

type UseAsyncComboboxStateProps<T extends CollectionItem> = {
  source: AsyncListSource<T>;
  value?: T | null;
  defaultValue?: T | null;
  onChange?: (value: T | null) => void;
  allowsCustomValue?: boolean;
};

/** @internal */
export function useAsyncComboboxState<T extends CollectionItem>(
  props?: UseAsyncComboboxStateProps<T>,
) {
  const isEnabled = props !== undefined;
  const { source, value, defaultValue, onChange, allowsCustomValue } =
    props ?? {};
  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState<T | null>(
    defaultValue ?? null,
  );
  const selectedItem = isControlled ? value ?? null : uncontrolledValue;
  const selectedItemRef = useRef(selectedItem);
  const sourceItemsRef = useRef<T[]>([]);
  const inputValueRef = useRef('');
  const sourceFilterText = source?.filterText ?? '';
  const setSourceFilterText = source?.setFilterText;
  const sourceFilterTextRef = useRef(sourceFilterText);
  const preserveInputOnClearRef = useRef(false);
  const [inputValue, setInputValue] = useState(() =>
    selectedItem
      ? getAsyncComboboxItemTextValue(selectedItem)
      : sourceFilterText,
  );

  selectedItemRef.current = selectedItem;
  sourceItemsRef.current = source ? [...source.items] : [];
  inputValueRef.current = inputValue;
  sourceFilterTextRef.current = sourceFilterText;

  const updateInputValue = useCallback(
    (nextInputValue: string) => {
      setInputValue(nextInputValue);
      if (
        isEnabled &&
        setSourceFilterText &&
        sourceFilterTextRef.current !== nextInputValue
      ) {
        sourceFilterTextRef.current = nextInputValue;
        setSourceFilterText(nextInputValue);
      }
    },
    [isEnabled, setSourceFilterText],
  );

  useEffect(() => {
    if (isEnabled) {
      setInputValue(sourceFilterText);
    }
  }, [isEnabled, sourceFilterText]);

  const selectedId = selectedItem?.id ?? null;
  const selectedTextValue = selectedItem
    ? getAsyncComboboxItemTextValue(selectedItem)
    : undefined;
  const previousSelectedId = useRef<Key | null>(null);
  const previousSelectedTextValue = useRef<string>();

  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    const selectionChanged =
      previousSelectedId.current !== selectedId ||
      previousSelectedTextValue.current !== selectedTextValue;

    previousSelectedId.current = selectedId;
    previousSelectedTextValue.current = selectedTextValue;

    if (selectionChanged) {
      if (selectedTextValue !== undefined) {
        updateInputValue(selectedTextValue);
      } else if (preserveInputOnClearRef.current) {
        preserveInputOnClearRef.current = false;
      } else {
        updateInputValue('');
      }
    }
  }, [isEnabled, selectedId, selectedTextValue, updateInputValue]);

  const freshSelectedItem = selectedItem
    ? sourceItemsRef.current.find(item => item.id === selectedItem.id)
    : undefined;
  const isEditing =
    selectedTextValue !== undefined &&
    inputValueRef.current !== selectedTextValue;

  useEffect(() => {
    if (
      isEnabled &&
      !isControlled &&
      !isEditing &&
      freshSelectedItem &&
      freshSelectedItem !== selectedItemRef.current
    ) {
      setUncontrolledValue(freshSelectedItem);
    }
  }, [freshSelectedItem, isControlled, isEditing, isEnabled]);

  const handleChange = useCallback(
    (key: Key | null) => {
      const currentItem = selectedItemRef.current;
      const currentTextValue = currentItem
        ? getAsyncComboboxItemTextValue(currentItem)
        : undefined;

      if (
        key === null &&
        allowsCustomValue &&
        currentTextValue === inputValueRef.current
      ) {
        updateInputValue(currentTextValue);
        return;
      }

      if (key === null && allowsCustomValue && currentItem) {
        preserveInputOnClearRef.current = true;
      }

      if (key === null && !currentItem && !allowsCustomValue) {
        updateInputValue('');
        return;
      }

      const nextItem = resolveNextSelectedItem({
        key,
        currentItem,
        sourceItems: sourceItemsRef.current,
        isControlled,
      });

      if (nextItem) {
        updateInputValue(getAsyncComboboxItemTextValue(nextItem));
      }

      if (!isControlled) {
        setUncontrolledValue(nextItem);
      }

      if (nextItem?.id !== currentItem?.id) {
        onChange?.(nextItem);
      }
    },
    [allowsCustomValue, isControlled, onChange, updateInputValue],
  );

  if (!isEnabled) {
    return undefined;
  }

  return {
    value: selectedItem?.id ?? null,
    inputValue,
    onChange: handleChange,
    onInputChange: updateInputValue,
  };
}

/** @internal */
export function getAsyncComboboxItemTextValue(item: CollectionItem) {
  return getItemTextValue(item as AsyncComboboxItem);
}
