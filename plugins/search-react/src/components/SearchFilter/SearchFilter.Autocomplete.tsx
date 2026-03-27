/*
 * Copyright 2022 The Backstage Authors
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

import { useState, useMemo } from 'react';
import { X, Check } from 'lucide-react';
import {
  Badge,
  ShadcnButton,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Command,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  cn,
} from '@backstage/core-components';

import { useSearch } from '../../context';
import { useAsyncFilterValues, useDefaultFilterValue } from './hooks';
import { SearchFilterComponentProps } from './SearchFilter';
import { ensureFilterValueWithLabel, FilterValueWithLabel } from './types';

/**
 * @public
 */
export type SearchAutocompleteFilterProps = SearchFilterComponentProps & {
  filterSelectedOptions?: boolean;
  limitTags?: number;
  multiple?: boolean;
};

/**
 * @public
 */
export const AutocompleteFilter = (props: SearchAutocompleteFilterProps) => {
  const {
    className,
    defaultValue,
    name,
    values: givenValues,
    valuesDebounceMs,
    label,
    filterSelectedOptions,
    limitTags,
    multiple,
  } = props;
  const [inputValue, setInputValue] = useState<string>('');
  const [open, setOpen] = useState(false);
  useDefaultFilterValue(name, defaultValue);
  const asyncValues =
    typeof givenValues === 'function' ? givenValues : undefined;
  const defaultValues =
    typeof givenValues === 'function'
      ? undefined
      : givenValues?.map(v => ensureFilterValueWithLabel(v));
  const { value: values, loading } = useAsyncFilterValues(
    asyncValues,
    inputValue,
    defaultValues,
    valuesDebounceMs,
  );
  const { filters, setFilters } = useSearch();
  const filterValueWithLabel = ensureFilterValueWithLabel(
    filters[name] as string | string[] | undefined,
  );
  const filterValue = useMemo(
    () => filterValueWithLabel || (multiple ? [] : null),
    [filterValueWithLabel, multiple],
  );

  // Set new filter values on change.
  const handleChange = (
    newValue: FilterValueWithLabel | FilterValueWithLabel[] | null,
  ) => {
    setFilters(prevState => {
      const { [name]: filter, ...others } = prevState;

      if (newValue && (!Array.isArray(newValue) || newValue.length > 0)) {
        return {
          ...others,
          [name]: Array.isArray(newValue)
            ? newValue.map(v => v.value)
            : newValue.value,
        };
      }
      return { ...others };
    });
  };

  // Handle clearing all selected values.
  const handleClear = () => {
    handleChange(null);
    setInputValue('');
  };

  // Optionally filter already-selected options from the dropdown list.
  const displayOptions = useMemo(() => {
    let opts = values || [];
    if (filterSelectedOptions && multiple && Array.isArray(filterValue)) {
      const selectedValues = new Set(filterValue.map(v => v.value));
      opts = opts.filter(option => !selectedValues.has(option.value));
    }
    return opts;
  }, [values, filterSelectedOptions, multiple, filterValue]);

  // Determine displayed input value: show selected label when closed (single),
  // otherwise reflect the user's typed search text.
  const displayInputValue = useMemo(() => {
    if (!multiple && filterValue && !Array.isArray(filterValue) && !open) {
      return filterValue.label;
    }
    return inputValue;
  }, [multiple, filterValue, open, inputValue]);

  // Determine which tags to render based on open state and limitTags prop.
  // When the combobox is not open, honour limitTags to reduce visual clutter.
  const multiTags = useMemo(() => {
    if (!multiple || !Array.isArray(filterValue)) return [];
    if (!open && limitTags !== undefined && filterValue.length > limitTags) {
      return filterValue.slice(0, limitTags);
    }
    return filterValue;
  }, [multiple, filterValue, open, limitTags]);

  const hiddenTagCount = useMemo(() => {
    if (
      !multiple ||
      !Array.isArray(filterValue) ||
      limitTags === undefined ||
      open
    ) {
      return 0;
    }
    return Math.max(0, filterValue.length - limitTags);
  }, [multiple, filterValue, limitTags, open]);

  // Whether there is any selection that can be cleared.
  const hasSelection = multiple
    ? Array.isArray(filterValue) && filterValue.length > 0
    : filterValue !== null && filterValue !== undefined;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          role="combobox"
          aria-expanded={open}
          aria-controls={`${
            multiple ? 'multi-' : ''
          }select-filter-${name}--listbox`}
          aria-haspopup="listbox"
          className={cn(
            'flex min-h-[2.25rem] w-full flex-wrap items-center gap-1 rounded-md border border-input bg-transparent px-3 py-1 text-sm ring-offset-background',
            'focus-within:ring-1 focus-within:ring-ring',
            className,
          )}
          id={`${multiple ? 'multi-' : ''}select-filter-${name}--select`}
          onBlur={e => {
            const relatedTarget = e.relatedTarget as HTMLElement | null;
            // Keep the popover open when focus moves to the dropdown content.
            if (
              e.currentTarget.contains(relatedTarget) ||
              relatedTarget?.closest('[data-slot="popover-content"]')
            ) {
              return;
            }
            setOpen(false);
          }}
        >
          {/* Render selected value tags for multi-select mode */}
          {multiple &&
            multiTags.map(item => (
              <Badge
                key={item.value}
                variant="secondary"
                role="button"
                tabIndex={-1}
                className="gap-1 pr-1 cursor-pointer"
                onClick={e => {
                  e.stopPropagation();
                  if (!Array.isArray(filterValue)) return;
                  const newValue = filterValue.filter(
                    v => v.value !== item.value,
                  );
                  handleChange(newValue.length > 0 ? newValue : null);
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!Array.isArray(filterValue)) return;
                    const newValue = filterValue.filter(
                      v => v.value !== item.value,
                    );
                    handleChange(newValue.length > 0 ? newValue : null);
                  }
                }}
              >
                {item.label}
                <X className="h-3 w-3" aria-hidden="true" />
              </Badge>
            ))}
          {hiddenTagCount > 0 && (
            <Badge variant="outline" className="pointer-events-none">
              +{hiddenTagCount}
            </Badge>
          )}
          {/* Editable search input inside the combobox trigger */}
          <input
            className="min-w-[4rem] flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            value={displayInputValue}
            onChange={e => {
              setInputValue(e.target.value);
              if (!open) setOpen(true);
            }}
            onClick={e => e.stopPropagation()}
            onFocus={() => {
              if (!open) setOpen(true);
            }}
            onKeyDown={e => {
              // Close the dropdown on Tab or Escape, matching native
              // autocomplete behaviour and allowing focus to leave.
              if (e.key === 'Tab' || e.key === 'Escape') {
                setOpen(false);
              }
            }}
            placeholder={label ?? name}
            aria-label={label ?? name}
          />
          {/* Clear selection button */}
          {hasSelection && (
            <ShadcnButton
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Clear"
              tabIndex={-1}
              className="ml-1 h-5 w-5 shrink-0 rounded-full p-0 opacity-50 transition-opacity hover:opacity-100"
              onClick={e => {
                e.stopPropagation();
                handleClear();
              }}
            >
              <X className="h-4 w-4" />
            </ShadcnButton>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="w-[--radix-popover-trigger-width] p-0"
        align="start"
        onOpenAutoFocus={e => e.preventDefault()}
        onCloseAutoFocus={e => e.preventDefault()}
        onKeyDown={e => {
          // Close the popover when Tab or Escape is pressed while focus is
          // inside the dropdown content.  This complements the identical
          // handler on the <input> and ensures the limitTags / blur
          // behaviour works regardless of which child element holds focus.
          if (e.key === 'Tab' || e.key === 'Escape') {
            setOpen(false);
          }
        }}
      >
        <Command shouldFilter={false}>
          {/* Only render the listbox once options are available so that
              role="listbox" does not appear prematurely during async loading */}
          {loading && displayOptions.length === 0 ? (
            <div className="py-6 text-center text-sm text-muted-foreground">
              Loading...
            </div>
          ) : (
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {displayOptions.map(option => {
                  const isSelected = multiple
                    ? Array.isArray(filterValue) &&
                      filterValue.some(v => v.value === option.value)
                    : filterValue !== null &&
                      !Array.isArray(filterValue) &&
                      filterValue.value === option.value;
                  return (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={() => {
                        if (multiple) {
                          const current = Array.isArray(filterValue)
                            ? filterValue
                            : [];
                          const newValue = isSelected
                            ? current.filter(v => v.value !== option.value)
                            : [...current, option];
                          handleChange(newValue.length > 0 ? newValue : null);
                        } else {
                          handleChange(isSelected ? null : option);
                          setInputValue('');
                          setOpen(false);
                        }
                      }}
                    >
                      {/* Checkbox indicator for multi-select items */}
                      {multiple && (
                        <div
                          className={cn(
                            'mr-2 flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border border-primary',
                            isSelected
                              ? 'bg-primary text-primary-foreground'
                              : 'opacity-50',
                          )}
                        >
                          {isSelected && (
                            <Check className="h-3 w-3" aria-hidden="true" />
                          )}
                        </div>
                      )}
                      {option.label}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
};
