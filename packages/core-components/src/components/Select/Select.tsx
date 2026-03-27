/*
 * Copyright 2020 The Backstage Authors
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

import { useEffect, useState } from 'react';
import { X, ChevronDown, ChevronUp, Check } from 'lucide-react';
import { cn } from '../../lib/utils';
import {
  ShadcnSelect,
  SelectTrigger,
  SelectContent,
  SelectItem as ShadcnSelectItem,
  SelectValue,
} from '../ui/select';
import { Badge } from '../ui/badge';
import { Checkbox } from '../ui/checkbox';
import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover';
import { Label } from '../ui/label';

/**
 * Sentinel value used to represent the "placeholder" option in single-select
 * mode since Radix Select items cannot have an empty string value.
 */
const PLACEHOLDER_SENTINEL = '__backstage_select_placeholder__';

/** @public */
export type SelectInputBaseClassKey = 'root' | 'input';

/** @public */
export type SelectClassKey =
  | 'formControl'
  | 'label'
  | 'chips'
  | 'chip'
  | 'checkbox'
  | 'root';

/** @public */
export type SelectItem = {
  label: string;
  value: string | number;
};

/** @public */
export type SelectedItems = string | string[] | number | number[];

export type SelectProps = {
  multiple?: boolean;
  items: SelectItem[];
  label: string;
  placeholder?: string;
  selected?: SelectedItems;
  onChange: (arg: SelectedItems) => void;
  triggerReset?: boolean;
  native?: boolean;
  disabled?: boolean;
  margin?: 'dense' | 'none';
  'data-testid'?: string;
};

/** @public */
export function SelectComponent(props: SelectProps) {
  const {
    multiple,
    items,
    label,
    placeholder,
    selected,
    onChange,
    triggerReset,
    native = false,
    disabled = false,
    margin,
    'data-testid': dataTestId = 'select',
  } = props;

  const [value, setValue] = useState<SelectedItems>(
    selected || (multiple ? [] : ''),
  );
  const [isOpen, setOpen] = useState(false);

  // Reset value when triggerReset changes
  useEffect(() => {
    setValue(multiple ? [] : '');
  }, [triggerReset, multiple]);

  // Sync value when selected prop changes externally
  useEffect(() => {
    setValue(selected || (multiple ? [] : ''));
  }, [selected, multiple]);

  // Warn when native prop is used — Radix Select does not support native mode
  useEffect(() => {
    if (native) {
      // eslint-disable-next-line no-console
      console.warn(
        'SelectComponent: The "native" prop is deprecated and has no effect with the Radix UI-based Select.',
      );
    }
  }, [native]);

  /**
   * Handler for single-select value change from Radix Select.
   * Receives a string value and resolves it back to the original item's
   * value type (string | number) for backward compatibility.
   */
  const handleSingleChange = (newValue: string) => {
    if (newValue === PLACEHOLDER_SENTINEL) {
      // User clicked the placeholder option — reset to empty
      setValue('');
      onChange('' as SelectedItems);
      return;
    }
    // Find the original item to preserve its value type (string | number)
    const item = items.find(el => String(el.value) === newValue);
    const resolvedValue = item ? item.value : newValue;
    setValue(resolvedValue);
    onChange(resolvedValue);
  };

  /**
   * Handler for toggling a multi-select checkbox option.
   * Adds or removes the item value from the selected array.
   */
  const handleMultiToggle = (itemValue: string | number) => {
    const currentValues = (value as any[]) || [];
    const newValues = currentValues.includes(itemValue)
      ? currentValues.filter((v: any) => v !== itemValue)
      : [...currentValues, itemValue];
    setValue(newValues);
    onChange(newValues);
  };

  /**
   * Handler for removing a badge/chip from multi-select.
   * Returns a click handler that removes the specified value.
   */
  const handleDelete = (selectedValue: string | number) => () => {
    const newValue = (value as any[]).filter((v: any) => v !== selectedValue);
    setValue(newValue);
    onChange(newValue);
  };

  // Compute the Radix-compatible string value for single-select mode.
  // Empty string tells Radix Select to display the placeholder.
  const singleStringValue =
    value === '' || value === undefined ? '' : String(value);

  // Determine root container margin class based on the margin prop
  let marginClass = 'my-2';
  if (margin === 'dense') {
    marginClass = 'my-1';
  } else if (margin === 'none') {
    marginClass = 'my-0';
  }

  return (
    <div className={cn('flex flex-col', marginClass)}>
      <Label className="mb-1.5 text-sm font-bold text-foreground">
        {label}
      </Label>
      {multiple ? (
        /* ------- Multi-select using Popover + Checkbox pattern ------- */
        <Popover open={isOpen} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              aria-label={label}
              data-testid={dataTestId}
              disabled={disabled}
              className={cn(
                'flex min-h-[2.25rem] w-full items-center gap-1 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm ring-offset-background',
                'focus:outline-none focus:ring-1 focus:ring-ring',
                disabled && 'cursor-not-allowed opacity-50',
              )}
            >
              {(value as (string | number)[]).length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {(value as (string | number)[]).map(selectedValue => {
                    const item = items.find(el => el.value === selectedValue);
                    return item ? (
                      <Badge
                        key={String(item.value)}
                        variant="secondary"
                        className="gap-1"
                        data-testid="chip"
                      >
                        {item.label}
                        <span
                          role="button"
                          tabIndex={0}
                          data-testid="cancel-icon"
                          onClick={e => {
                            e.stopPropagation();
                            handleDelete(selectedValue)();
                          }}
                          onKeyDown={e => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              e.stopPropagation();
                              handleDelete(selectedValue)();
                            }
                          }}
                          onMouseDown={e => e.stopPropagation()}
                          className="ml-1 inline-flex cursor-pointer rounded-full hover:bg-muted"
                        >
                          <X className="h-3 w-3" />
                        </span>
                      </Badge>
                    ) : null;
                  })}
                </div>
              ) : (
                <span className="text-muted-foreground">
                  {placeholder || ''}
                </span>
              )}
              {isOpen ? (
                <ChevronUp className="ml-auto h-4 w-4 shrink-0 opacity-50" />
              ) : (
                <ChevronDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent
            className="w-[var(--radix-popover-trigger-width)] p-1"
            align="start"
          >
            {items.map(item => {
              const isSelected = (value as (string | number)[]).includes(
                item.value,
              );
              return (
                <div
                  key={String(item.value)}
                  role="option"
                  tabIndex={0}
                  aria-selected={isSelected}
                  className="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent"
                  onClick={() => handleMultiToggle(item.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleMultiToggle(item.value);
                    }
                  }}
                >
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => handleMultiToggle(item.value)}
                  />
                  <span className="flex-1">{item.label}</span>
                  {isSelected && (
                    <Check className="ml-auto h-4 w-4 text-primary" />
                  )}
                </div>
              );
            })}
          </PopoverContent>
        </Popover>
      ) : (
        /* ------- Single-select using Radix Select ------- */
        <ShadcnSelect
          value={singleStringValue}
          onValueChange={handleSingleChange}
          disabled={disabled}
          open={isOpen}
          onOpenChange={setOpen}
        >
          <SelectTrigger data-testid={dataTestId} aria-label={label}>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {placeholder && (
              <ShadcnSelectItem value={PLACEHOLDER_SENTINEL}>
                {placeholder}
              </ShadcnSelectItem>
            )}
            {items.map(item => (
              <ShadcnSelectItem
                key={String(item.value)}
                value={String(item.value)}
              >
                {item.label}
              </ShadcnSelectItem>
            ))}
          </SelectContent>
        </ShadcnSelect>
      )}
    </div>
  );
}
