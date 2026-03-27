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

import React, { useCallback, useEffect, useMemo, useState } from 'react';

import {
  Command,
  CommandList,
  CommandItem,
  CommandEmpty,
  CommandGroup,
  Popover,
  PopoverTrigger,
  PopoverContent,
  cn,
} from '@backstage/core-components';

import { SearchContextProvider, useSearch } from '../../context';
import { SearchBar, SearchBarProps } from '../SearchBar';

/**
 * Props for {@link SearchAutocomplete}.
 *
 * Replaces the former MUI AutocompleteProps-based type with a standalone
 * interface that preserves all public-facing prop names while removing
 * the Material UI dependency.
 *
 * @public
 */
export type SearchAutocompleteProps<Option> = {
  /** Options to display in the dropdown */
  options?: Option[];
  /** Whether options are currently loading */
  loading?: boolean;
  /** Allow free-form text entry (not restricted to options) */
  freeSolo?: boolean;
  /** Control the full width of the input */
  fullWidth?: boolean;
  /** Whether to clear input on blur */
  clearOnBlur?: boolean;
  /** Currently selected value */
  value?: Option | string | null;
  /** Extract a display label from an option */
  getOptionLabel?: (option: Option) => string;
  /** Custom render function for each option in the dropdown */
  renderOption?: (option: Option) => React.ReactNode;
  /** Filter options client-side */
  filterOptions?: (
    options: Option[],
    state: { inputValue: string },
  ) => Option[];
  /** Called when the input value changes (typing) */
  onInputChange?: (
    event: React.SyntheticEvent,
    value: string,
    reason: string,
  ) => void;
  /** Called when a selection is made or cleared */
  onChange?: (
    event: React.SyntheticEvent,
    value: Option | string | null,
    reason: string,
    details?: { option: Option },
  ) => void;
  /** Open state of dropdown (controlled) */
  open?: boolean;
  /** Callback when open state changes */
  onOpen?: (event: React.SyntheticEvent) => void;
  /** Callback when closed */
  onClose?: (event: React.SyntheticEvent, reason: string) => void;
  /** Test ID for the component root */
  'data-testid'?: string;
  /** Placeholder text for the search input */
  inputPlaceholder?: SearchBarProps['placeholder'];
  /** Debounce time for input changes */
  inputDebounceTime?: SearchBarProps['debounceTime'];
  /** Additional className for the container */
  className?: string;
};

/**
 * Type for {@link SearchAutocomplete}.
 *
 * @public
 */
export type SearchAutocompleteComponent = <Option>(
  props: SearchAutocompleteProps<Option>,
) => JSX.Element;

const withContext = (
  Component: SearchAutocompleteComponent,
): SearchAutocompleteComponent => {
  return props => (
    <SearchContextProvider inheritParentContextIfAvailable>
      <Component {...props} />
    </SearchContextProvider>
  );
};

/**
 * Loading indicator rendered as a spinning ring, replacing MUI CircularProgress.
 * Uses Tailwind CSS animation utilities for the spin effect.
 */
const SearchAutocompleteLoadingAdornment = () => {
  return (
    <div
      className="absolute right-2 top-1/2 -translate-y-1/2"
      data-testid="search-autocomplete-progressbar"
    >
      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
};

/**
 * Recommended search autocomplete when you use the Search Provider or Search Context.
 *
 * Renders a combobox-style search input backed by a shadcn/ui Command palette
 * inside a Radix Popover. Keyboard navigation, option filtering, and dropdown
 * positioning are handled automatically. The component integrates with the
 * Backstage search context to update the search term on value changes.
 *
 * @public
 */
export const SearchAutocomplete = withContext(
  function SearchAutocompleteComponent<Option>(
    props: SearchAutocompleteProps<Option>,
  ) {
    const {
      loading,
      value,
      onChange = () => {},
      options = [],
      getOptionLabel = (option: Option) => String(option),
      renderOption,
      filterOptions,
      inputPlaceholder,
      inputDebounceTime,
      // freeSolo is accepted for API compat but the Command-based combobox
      // always allows free-form input via the underlying SearchBar.
      freeSolo: _freeSolo = true,
      fullWidth = true,
      clearOnBlur = false,
      'data-testid': dataTestId = 'search-autocomplete',
      className,
    } = props;

    const { setTerm } = useSearch();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [internalInputValue, setInternalInputValue] = useState('');

    /** Convert an option (or string, or null) to a display string. */
    const getInputValue = useCallback(
      (option?: null | string | Option) => {
        if (!option) return '';
        if (typeof option === 'string') return option;
        return getOptionLabel(option);
      },
      [getOptionLabel],
    );

    /** Memoised display string derived from the external value prop. */
    const inputValue = useMemo(
      () => getInputValue(value),
      [value, getInputValue],
    );

    /** Keep the local input state in sync with the external value prop. */
    useEffect(() => {
      setInternalInputValue(inputValue);
    }, [inputValue]);

    /**
     * Called when a dropdown option is selected via click or keyboard.
     * Updates the input value, search term, and closes the dropdown.
     */
    const handleSelect = useCallback(
      (option: Option) => {
        const label = getOptionLabel(option);
        setInternalInputValue(label);
        setTerm(label);
        setDropdownOpen(false);
        onChange({} as React.SyntheticEvent, option, 'select-option', {
          option,
        });
      },
      [getOptionLabel, setTerm, onChange],
    );

    /**
     * Client-side option filtering. Respects the consumer's filterOptions
     * function if provided; otherwise performs a case-insensitive substring
     * match on the option label. Returns all options when the input is empty.
     */
    const filteredOptions = useMemo(() => {
      if (filterOptions) {
        return filterOptions(options as Option[], {
          inputValue: internalInputValue,
        });
      }
      if (!internalInputValue) return options as Option[];
      return (options as Option[]).filter(option =>
        getOptionLabel(option)
          .toLowerCase()
          .includes(internalInputValue.toLowerCase()),
      );
    }, [options, internalInputValue, filterOptions, getOptionLabel]);

    /** Whether the dropdown should be visible. */
    const showDropdown = dropdownOpen && filteredOptions.length > 0;

    /** Open the dropdown when the search input receives focus. */
    const handleFocus = useCallback(() => {
      setDropdownOpen(true);
    }, []);

    /**
     * Close the dropdown after a short delay when the search input loses focus.
     * The delay allows a pending option click or clear-button click to
     * register before the dropdown is removed from the DOM.
     */
    const handleBlur = useCallback(() => {
      setTimeout(() => {
        setDropdownOpen(false);
        if (clearOnBlur) {
          setInternalInputValue('');
        }
      }, 200);
    }, [clearOnBlur]);

    return (
      <div
        data-testid={dataTestId}
        className={cn('relative', fullWidth && 'w-full', className)}
      >
        <Popover open={showDropdown}>
          <PopoverTrigger asChild>
            <div className="relative w-full">
              <SearchBar
                value={internalInputValue}
                placeholder={inputPlaceholder}
                debounceTime={inputDebounceTime}
                onChange={(newValue: string) => {
                  setInternalInputValue(newValue);
                  setTerm(newValue);
                  if (newValue && !dropdownOpen) setDropdownOpen(true);
                }}
                onFocus={handleFocus}
                onBlur={handleBlur}
                endAdornment={
                  loading ? <SearchAutocompleteLoadingAdornment /> : undefined
                }
              />
            </div>
          </PopoverTrigger>
          <PopoverContent
            className="p-0 w-[var(--radix-popover-trigger-width)]"
            align="start"
            sideOffset={4}
            onOpenAutoFocus={e => e.preventDefault()}
            onInteractOutside={e => e.preventDefault()}
          >
            <Command shouldFilter={false}>
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                  {filteredOptions.map((option, index) => (
                    <CommandItem
                      key={index}
                      onSelect={() => handleSelect(option)}
                      className="cursor-pointer"
                    >
                      {renderOption
                        ? renderOption(option)
                        : getOptionLabel(option)}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    );
  },
);
