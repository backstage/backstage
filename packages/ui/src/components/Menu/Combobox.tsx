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
  forwardRef,
  useState,
  useMemo,
  useCallback,
  ChangeEvent,
  KeyboardEvent,
  useRef,
  useEffect,
} from 'react';
import clsx from 'clsx';
import { MenuComboboxOption, MenuComboboxProps } from './types';
import { Icon } from '../..';
import { useId } from 'react-aria';

const getListboxItemId = (listboxId: string, optionValue: string): string =>
  `${listboxId}-option-${optionValue}`;

// Internal component for rendering individual items
function ComboboxItem({
  option,
  optionIndex,
  value,
  activeOptionIndex,
  onItemActive,
  onItemSelect,
  listboxId,
}: {
  option: MenuComboboxOption;
  optionIndex: number;
  value?: string[];
  activeOptionIndex: number;
  onItemActive: (index: number) => void;
  onItemSelect: (value: string) => void;
  listboxId: string;
}) {
  const isSelected = value?.includes(option.value) ?? false;
  const isHighlighted = optionIndex === activeOptionIndex;
  const itemId = getListboxItemId(listboxId, option.value);

  const itemRef = useRef<HTMLDivElement>(null);

  // Scroll the item into view when it becomes highlighted
  useEffect(() => {
    if (isHighlighted && itemRef.current) {
      itemRef.current.scrollIntoView({ block: 'nearest' });
    }
  }, [isHighlighted]);

  return (
    <div
      ref={itemRef}
      className="bui-SubmenuComboboxItem"
      id={itemId}
      role="option"
      aria-selected={isSelected}
      data-highlighted={isHighlighted ? true : undefined}
      data-selected={isSelected ? true : undefined}
      data-disabled={option.disabled ? true : undefined}
      onMouseOver={() => !option.disabled && onItemActive(optionIndex)}
      onClick={() => !option.disabled && onItemSelect(option.value)}
    >
      <div className="bui-SubmenuComboboxItemCheckbox">
        {isSelected && <Icon aria-hidden="true" name="check" size={12} />}
      </div>
      <div className="bui-SubmenuComboboxItemLabel">{option.label}</div>
    </div>
  );
}

/** @public */
export const Combobox = forwardRef<HTMLDivElement, MenuComboboxProps>(
  (props, ref) => {
    const {
      options,
      value,
      onValueChange,
      multiselect = false,
      className,
      ...rest
    } = props;

    const triggerId = useId();
    const listboxId = `${triggerId}-listbox`;

    // State management
    const [filterString, setFilterString] = useState<string>('');
    const [activeOptionIndex, setActiveOptionIndex] = useState<number>(0);

    // Filter options based on input
    const filteredOptions = useMemo(() => {
      if (!filterString) return options;
      const lowerFilterString = filterString.toLocaleLowerCase('en-US');
      return options.filter(option =>
        option.label.toLocaleLowerCase('en-US').includes(lowerFilterString),
      );
    }, [filterString, options]);

    // Get the active descendant ID for accessibility
    const activeDescendantId =
      activeOptionIndex >= 0 && filteredOptions.length > 0
        ? getListboxItemId(listboxId, filteredOptions[activeOptionIndex].value)
        : undefined;

    const handleValueChange = useCallback(
      (toggledValue: string) => {
        let newValue: string[];
        if (multiselect) {
          newValue = value?.includes(toggledValue)
            ? value.filter(v => v !== toggledValue)
            : [...(value ?? []), toggledValue];
        } else {
          newValue = value?.includes(toggledValue) ? [] : [toggledValue];
        }

        onValueChange?.(newValue);
      },
      [multiselect, onValueChange, value],
    );

    const handleSearchChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        setFilterString(e.target.value);
        setActiveOptionIndex(0);
        e.preventDefault();
      },
      [],
    );

    const handleKeyDown = useCallback(
      (e: KeyboardEvent) => {
        let wasEscapeKey = false;
        switch (e.key) {
          case 'ArrowDown':
            e.preventDefault();
            setActiveOptionIndex(prev =>
              Math.min(prev + 1, filteredOptions.length - 1),
            );
            break;
          case 'ArrowUp':
            e.preventDefault();
            setActiveOptionIndex(prev => Math.max(prev - 1, 0));
            break;
          case 'Home':
            e.preventDefault();
            setActiveOptionIndex(0);
            break;
          case 'End':
            e.preventDefault();
            setActiveOptionIndex(Math.max(filteredOptions.length - 1, 0));
            break;
          case 'Enter':
            e.preventDefault();
            if (
              activeOptionIndex >= 0 &&
              !filteredOptions[activeOptionIndex].disabled
            ) {
              handleValueChange(filteredOptions[activeOptionIndex].value);
            }
            break;
          case 'Escape':
            // The Menu component should handle this
            wasEscapeKey = true;
            break;
          default:
            break;
        }

        if (!wasEscapeKey) {
          // Stop propagation so Menu components don't prevent the input from updating
          e.stopPropagation();
        }
      },
      [filteredOptions, activeOptionIndex, handleValueChange],
    );

    return (
      <div
        ref={ref}
        role="combobox"
        className={clsx('bui-MenuCombobox', className)}
        {...rest}
      >
        <input
          className="bui-SubmenuComboboxSearch"
          type="text"
          role="combobox"
          placeholder="Filter..."
          aria-labelledby={triggerId}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={activeDescendantId}
          aria-expanded="true"
          aria-haspopup="listbox"
          value={filterString}
          onKeyDown={handleKeyDown}
          onChange={handleSearchChange}
        />
        <div
          role="listbox"
          id={listboxId}
          tabIndex={-1}
          aria-multiselectable={multiselect ? true : undefined}
          className="bui-SubmenuComboboxItems"
        >
          {filteredOptions.length === 0 ? (
            <div className="bui-SubmenuComboboxNoResults">No results found</div>
          ) : (
            filteredOptions.map((option, index) => (
              <ComboboxItem
                key={option.value}
                option={option}
                optionIndex={index}
                value={value}
                activeOptionIndex={activeOptionIndex}
                onItemActive={setActiveOptionIndex}
                onItemSelect={handleValueChange}
                listboxId={listboxId}
              />
            ))
          )}
        </div>
      </div>
    );
  },
);
Combobox.displayName = 'Combobox';
