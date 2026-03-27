/*
 * Copyright 2024 The Backstage Authors
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
  type HTMLAttributes,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { merge } from 'lodash';
import { cn } from '@backstage/core-components';
import { ChevronDown, X, Check } from 'lucide-react';

/**
 * Props for {@link CatalogAutocomplete}
 *
 * @remarks
 * This type preserves the same generic signature as the previous MUI-based
 * implementation while providing a simplified, Tailwind-styled combobox.
 * Consumers can use all standard autocomplete props (options, multiple, value,
 * onChange, getOptionLabel, renderOption, filterOptions, etc.) alongside
 * Backstage-specific props (name, label, LabelProps, TextFieldProps).
 *
 * @public
 */
export type CatalogAutocompleteProps<
  T,
  Multiple extends boolean | undefined = undefined,
  DisableClearable extends boolean | undefined = undefined,
  FreeSolo extends boolean | undefined = undefined,
> = {
  /** Available options to select from */
  options: readonly T[];
  /** The currently selected value(s) — controlled mode */
  value?: Multiple extends true ? T[] : T | null;
  /** Default value for uncontrolled mode */
  defaultValue?: Multiple extends true ? T[] : T | null;
  /** Callback fired when the value changes */
  onChange?: (
    event: React.SyntheticEvent,
    value: Multiple extends true ? T[] : T | null,
  ) => void;
  /** Callback fired when the input text changes */
  onInputChange?: (
    event: React.SyntheticEvent,
    value: string,
    reason: string,
  ) => void;
  /** Controlled input text value */
  inputValue?: string;
  /** Returns the string representation for a given option */
  getOptionLabel?: (option: T) => string;
  /** Determines whether an option matches the selected value (equality check) */
  getOptionSelected?: (option: T, value: T) => boolean;
  /** Custom renderer for each option in the dropdown list */
  renderOption?: (
    option: T,
    state: { selected: boolean; inputValue: string; index: number },
  ) => ReactNode;
  /** Custom filter function applied to options before rendering */
  filterOptions?: (options: T[], state: { inputValue: string }) => T[];
  /** Allow selecting multiple options */
  multiple?: Multiple;
  /** Disable the clear button */
  disableClearable?: DisableClearable;
  /** Allow arbitrary text input that does not match an option */
  freeSolo?: FreeSolo;
  /** Keep the dropdown open after selecting an option */
  disableCloseOnSelect?: boolean;
  /** Disable the entire component */
  disabled?: boolean;
  /** Display a loading state inside the dropdown */
  loading?: boolean;
  /** Content shown while loading */
  loadingText?: ReactNode;
  /** Content shown when no options match the input */
  noOptionsText?: ReactNode;
  /** Controlled open state for the dropdown */
  open?: boolean;
  /** Callback fired when the dropdown requests to open */
  onOpen?: (event: React.SyntheticEvent) => void;
  /** Callback fired when the dropdown requests to close */
  onClose?: (event: React.SyntheticEvent, reason: string) => void;
  /** Component size variant */
  size?: 'small' | 'medium';
  /** Additional CSS class for the root container */
  className?: string;
  /** HTML id attribute for the input element */
  id?: string;
  /** Unique identifier — used in data-testid attributes for testing */
  name: string;
  /** Optional label displayed above the input */
  label?: string;
  /** Props forwarded to the label element */
  LabelProps?: HTMLAttributes<HTMLLabelElement> & { className?: string };
  /** Props forwarded to the underlying input element wrapper */
  TextFieldProps?: {
    required?: boolean;
    helperText?: ReactNode;
    placeholder?: string;
    error?: boolean;
    disabled?: boolean;
    fullWidth?: boolean;
    className?: string;
    [key: string]: any;
  };
  /** Props forwarded to the listbox (dropdown) element */
  ListboxProps?: Record<string, any>;
  /** Override the default input renderer */
  renderInput?: (params: {
    inputProps: Record<string, any>;
    inputRef: React.Ref<HTMLInputElement>;
  }) => ReactNode;
};

/** @public */
export function CatalogAutocomplete<
  T,
  Multiple extends boolean | undefined = undefined,
  DisableClearable extends boolean | undefined = undefined,
  FreeSolo extends boolean | undefined = undefined,
>(props: CatalogAutocompleteProps<T, Multiple, DisableClearable, FreeSolo>) {
  const {
    label,
    name,
    LabelProps,
    TextFieldProps: textFieldProps,
    options,
    value: controlledValue,
    defaultValue,
    onChange,
    onInputChange,
    inputValue: controlledInputValue,
    getOptionLabel = (option: T) => String(option),
    getOptionSelected,
    renderOption: renderOptionProp,
    filterOptions,
    multiple,
    disableClearable,
    disableCloseOnSelect,
    freeSolo: _freeSolo,
    disabled,
    loading,
    loadingText = 'Loading\u2026',
    noOptionsText = 'No options',
    open: controlledOpen,
    onOpen,
    onClose,
    size = 'small',
    className,
    id,
    ListboxProps: listboxProps,
    renderInput,
  } = props;

  /* --------------------------------------------------------------------- */
  /* Internal state                                                         */
  /* --------------------------------------------------------------------- */
  const [isOpen, setIsOpen] = useState(false);
  const [internalInputValue, setInternalInputValue] = useState('');
  const [internalValue, setInternalValue] = useState<T | T[] | null>(
    () =>
      (defaultValue ?? (multiple ? ([] as unknown as T[]) : null)) as
        | T
        | T[]
        | null,
  );
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listboxId = useMemo(() => `${name}-listbox`, [name]);

  /* --------------------------------------------------------------------- */
  /* Derived / resolved values                                              */
  /* --------------------------------------------------------------------- */
  const value = controlledValue !== undefined ? controlledValue : internalValue;
  const inputTextValue = controlledInputValue ?? internalInputValue;
  const open = controlledOpen ?? isOpen;

  const mergedTextFieldProps = useMemo(() => {
    const base: Record<string, any> = {};
    return textFieldProps ? merge(base, textFieldProps) : base;
  }, [textFieldProps]);

  /* --------------------------------------------------------------------- */
  /* Filtered options                                                       */
  /* --------------------------------------------------------------------- */
  const filteredOptions = useMemo(() => {
    const opts = [...options] as T[];
    if (filterOptions) {
      return filterOptions(opts, { inputValue: inputTextValue });
    }
    if (!inputTextValue) return opts;
    return opts.filter(opt =>
      getOptionLabel(opt).toLowerCase().includes(inputTextValue.toLowerCase()),
    );
  }, [options, inputTextValue, filterOptions, getOptionLabel]);

  /* --------------------------------------------------------------------- */
  /* Selection helpers                                                      */
  /* --------------------------------------------------------------------- */
  const isOptionSelected = useCallback(
    (option: T): boolean => {
      if (multiple) {
        const vals = ((value as T[] | null) ?? []) as T[];
        return vals.some(v =>
          getOptionSelected ? getOptionSelected(option, v) : option === v,
        );
      }
      if (value === null || value === undefined) return false;
      return getOptionSelected
        ? getOptionSelected(option, value as T)
        : option === (value as T);
    },
    [value, multiple, getOptionSelected],
  );

  /* --------------------------------------------------------------------- */
  /* Open / close handlers                                                  */
  /* --------------------------------------------------------------------- */
  const handleOpen = useCallback(
    (e: React.SyntheticEvent) => {
      if (!disabled) {
        setIsOpen(true);
        setHighlightedIndex(-1);
        onOpen?.(e);
      }
    },
    [disabled, onOpen],
  );

  const handleClose = useCallback(
    (e: React.SyntheticEvent, reason: string = 'blur') => {
      setIsOpen(false);
      setHighlightedIndex(-1);
      onClose?.(e, reason);
    },
    [onClose],
  );

  /* --------------------------------------------------------------------- */
  /* Option selection handler                                               */
  /* --------------------------------------------------------------------- */
  const handleSelect = useCallback(
    (e: React.SyntheticEvent, option: T) => {
      if (multiple) {
        const currentValues = ((value as T[] | null) ?? []) as T[];
        const alreadySelected = currentValues.some(v =>
          getOptionSelected ? getOptionSelected(option, v) : option === v,
        );
        const newValues = alreadySelected
          ? currentValues.filter(v =>
              getOptionSelected ? !getOptionSelected(option, v) : v !== option,
            )
          : [...currentValues, option];
        setInternalValue(newValues);
        onChange?.(e, newValues as Multiple extends true ? T[] : T | null);
        /* Clear the filter input after multi-select (matches MUI behavior) */
        setInternalInputValue('');
        onInputChange?.(e, '', 'reset');
        if (!disableCloseOnSelect) {
          handleClose(e, 'select-option');
        }
      } else {
        const optionLabel = getOptionLabel(option);
        setInternalValue(option);
        setInternalInputValue(optionLabel);
        onInputChange?.(e, optionLabel, 'reset');
        onChange?.(e, option as Multiple extends true ? T[] : T | null);
        handleClose(e, 'select-option');
      }
    },
    [
      value,
      multiple,
      getOptionSelected,
      onChange,
      onInputChange,
      disableCloseOnSelect,
      handleClose,
      getOptionLabel,
    ],
  );

  /* --------------------------------------------------------------------- */
  /* Input text change handler                                              */
  /* --------------------------------------------------------------------- */
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newText = e.target.value;
      setInternalInputValue(newText);
      onInputChange?.(e, newText, 'input');
      if (!open) {
        handleOpen(e);
      }
    },
    [onInputChange, open, handleOpen],
  );

  /* --------------------------------------------------------------------- */
  /* Clear handler                                                          */
  /* --------------------------------------------------------------------- */
  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setInternalInputValue('');
      setInternalValue(multiple ? ([] as unknown as T[]) : null);
      onChange?.(
        e,
        (multiple ? [] : null) as Multiple extends true ? T[] : T | null,
      );
      onInputChange?.(e, '', 'clear');
      inputRef.current?.focus();
    },
    [multiple, onChange, onInputChange],
  );

  /* --------------------------------------------------------------------- */
  /* Click-outside detection                                                */
  /* --------------------------------------------------------------------- */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node) &&
        open
      ) {
        handleClose(e as unknown as React.SyntheticEvent, 'blur');
        /* Restore displayed value for single-select on blur */
        if (!multiple && value !== null && value !== undefined) {
          setInternalInputValue(getOptionLabel(value as T));
        } else if (!multiple) {
          setInternalInputValue('');
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, handleClose, multiple, value, getOptionLabel]);

  /* --------------------------------------------------------------------- */
  /* Keyboard navigation                                                    */
  /* --------------------------------------------------------------------- */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          if (!open) {
            handleOpen(e);
          } else {
            setHighlightedIndex(prev =>
              prev < filteredOptions.length - 1 ? prev + 1 : 0,
            );
          }
          break;
        case 'ArrowUp':
          e.preventDefault();
          if (open) {
            setHighlightedIndex(prev =>
              prev > 0 ? prev - 1 : filteredOptions.length - 1,
            );
          }
          break;
        case 'Enter':
          e.preventDefault();
          if (
            open &&
            highlightedIndex >= 0 &&
            highlightedIndex < filteredOptions.length
          ) {
            handleSelect(e, filteredOptions[highlightedIndex]);
          }
          break;
        case 'Escape':
          if (open) {
            e.preventDefault();
            handleClose(e, 'escape');
            if (!multiple && value !== null && value !== undefined) {
              setInternalInputValue(getOptionLabel(value as T));
            } else if (!multiple) {
              setInternalInputValue('');
            }
          }
          break;
        default:
          break;
      }
    },
    [
      open,
      handleOpen,
      handleClose,
      highlightedIndex,
      filteredOptions,
      handleSelect,
      multiple,
      value,
      getOptionLabel,
    ],
  );

  /* --------------------------------------------------------------------- */
  /* Scroll highlighted option into view                                    */
  /* --------------------------------------------------------------------- */
  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const items = listRef.current.querySelectorAll('[role="option"]');
      const target = items[highlightedIndex];
      /* Guard: scrollIntoView may not be available in jsdom test environments */
      if (target && typeof target.scrollIntoView === 'function') {
        target.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex]);

  /* --------------------------------------------------------------------- */
  /* Determine clear icon visibility                                        */
  /* --------------------------------------------------------------------- */
  const showClearIcon =
    !disableClearable &&
    !disabled &&
    (multiple
      ? ((value as T[] | null) ?? []).length > 0
      : value !== null && value !== undefined && inputTextValue !== '');

  /* --------------------------------------------------------------------- */
  /* Dropdown renderer                                                      */
  /* --------------------------------------------------------------------- */
  const renderDropdown = () => {
    if (!open) return null;
    return (
      <ul
        ref={listRef}
        id={listboxId}
        role="listbox"
        {...listboxProps}
        className={cn(
          'absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md',
          'border border-border bg-popover p-1 text-popover-foreground shadow-md',
          listboxProps?.className,
        )}
      >
        {loading && (
          <li className="px-2 py-1.5 text-sm text-muted-foreground">
            {loadingText}
          </li>
        )}
        {!loading && filteredOptions.length === 0 && (
          <li className="px-2 py-1.5 text-sm text-muted-foreground">
            {noOptionsText}
          </li>
        )}
        {!loading &&
          filteredOptions.length > 0 &&
          filteredOptions.map((option, index) => {
            const selected = isOptionSelected(option);
            const highlighted = index === highlightedIndex;
            return (
              <li
                key={index}
                id={`${listboxId}-option-${index}`}
                role="option"
                aria-selected={selected}
                className={cn(
                  'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none',
                  highlighted && 'bg-accent text-accent-foreground',
                  selected && !highlighted && 'bg-accent/50',
                  !highlighted &&
                    !selected &&
                    'hover:bg-accent hover:text-accent-foreground',
                )}
                onMouseDown={e => {
                  /* Prevent input blur so the dropdown stays mounted for onClick */
                  e.preventDefault();
                }}
                onClick={e => {
                  handleSelect(e, option);
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSelect(e, option);
                  }
                }}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                {multiple && (
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4 shrink-0',
                      selected ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                )}
                {renderOptionProp ? (
                  renderOptionProp(option, {
                    selected,
                    inputValue: inputTextValue,
                    index,
                  })
                ) : (
                  <span className="truncate">{getOptionLabel(option)}</span>
                )}
              </li>
            );
          })}
      </ul>
    );
  };

  /* --------------------------------------------------------------------- */
  /* Default input renderer                                                 */
  /* --------------------------------------------------------------------- */
  /* --------------------------------------------------------------------- */
  /* Tag removal handler (multi-select chip delete)                         */
  /* --------------------------------------------------------------------- */
  const handleTagRemove = useCallback(
    (e: React.SyntheticEvent, tagValue: T) => {
      e.stopPropagation();
      const currentValues = ((value as T[] | null) ?? []) as T[];
      const newValues = currentValues.filter(v =>
        getOptionSelected ? !getOptionSelected(tagValue, v) : v !== tagValue,
      );
      setInternalValue(newValues);
      onChange?.(e, newValues as Multiple extends true ? T[] : T | null);
      inputRef.current?.focus();
    },
    [value, getOptionSelected, onChange],
  );

  /* --------------------------------------------------------------------- */
  /* Default input renderer                                                 */
  /* --------------------------------------------------------------------- */
  const renderDefaultInput = () => (
    <div className="relative">
      <div
        className={cn(
          'mt-6 flex flex-wrap items-center gap-1 w-full rounded-md border border-input bg-background text-sm',
          'focus-within:border-primary focus-within:ring-1 focus-within:ring-primary',
          'hover:border-muted-foreground/50',
          disabled && 'cursor-not-allowed opacity-50',
          size === 'small' ? 'px-1.5 py-1.5' : 'px-3 py-2',
          mergedTextFieldProps.className,
        )}
      >
        {/* Render selected value tags for multi-select mode */}
        {multiple &&
          Array.isArray(value) &&
          (value as T[]).map((tagVal, tagIdx) => (
            <span
              key={tagIdx}
              role="button"
              tabIndex={0}
              /* Accessible name derived from text content (getOptionLabel) */
              className={cn(
                'inline-flex items-center gap-0.5 rounded-sm bg-secondary',
                'px-1.5 py-0.5 text-xs text-secondary-foreground',
                'max-w-[calc(100%-2rem)] cursor-default',
              )}
              onClick={e => handleTagRemove(e, tagVal)}
              onKeyDown={e => {
                if (e.key === 'Backspace' || e.key === 'Delete') {
                  handleTagRemove(e, tagVal);
                }
              }}
            >
              <span className="truncate">{getOptionLabel(tagVal)}</span>
              <X
                aria-hidden="true"
                className="h-3 w-3 shrink-0 opacity-70 hover:opacity-100"
              />
            </span>
          ))}
        <input
          ref={inputRef}
          role="combobox"
          type="text"
          value={inputTextValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleOpen}
          disabled={disabled}
          required={mergedTextFieldProps.required}
          placeholder={mergedTextFieldProps.placeholder}
          id={id}
          aria-expanded={open}
          aria-controls={open ? listboxId : undefined}
          aria-activedescendant={
            open && highlightedIndex >= 0
              ? `${listboxId}-option-${highlightedIndex}`
              : undefined
          }
          aria-autocomplete="list"
          autoComplete="off"
          className={cn(
            'flex-1 bg-transparent outline-none text-sm text-foreground',
            'placeholder:text-muted-foreground min-w-0',
            'disabled:cursor-not-allowed',
          )}
        />
        <div className="flex items-center shrink-0 gap-0.5">
          {showClearIcon && (
            <button
              type="button"
              onClick={handleClear}
              className="p-0.5 text-muted-foreground hover:text-foreground"
              aria-label="Clear"
              tabIndex={-1}
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            type="button"
            onClick={e => {
              if (open) {
                handleClose(e, 'toggleInput');
              } else {
                handleOpen(e);
                inputRef.current?.focus();
              }
            }}
            className="p-0 m-0 text-muted-foreground hover:bg-transparent"
            tabIndex={-1}
            aria-label="Toggle options"
          >
            <ChevronDown
              data-testid={`${name}-expand`}
              className={cn(
                'h-5 w-5 transition-transform',
                open && 'rotate-180',
              )}
            />
          </button>
        </div>
      </div>
      {mergedTextFieldProps.helperText && (
        <p
          className={cn(
            'mt-1 text-xs',
            mergedTextFieldProps.error
              ? 'text-destructive'
              : 'text-muted-foreground',
          )}
        >
          {mergedTextFieldProps.helperText}
        </p>
      )}
    </div>
  );

  /* --------------------------------------------------------------------- */
  /* Custom renderInput wrapper                                             */
  /* --------------------------------------------------------------------- */
  const renderCustomInput = () => (
    <div className="relative">
      {renderInput!({
        inputProps: {
          role: 'combobox',
          value: inputTextValue,
          onChange: handleInputChange,
          onKeyDown: handleKeyDown,
          onFocus: handleOpen,
          disabled,
          required: mergedTextFieldProps.required,
          placeholder: mergedTextFieldProps.placeholder,
          id,
          'aria-expanded': open,
          'aria-controls': open ? listboxId : undefined,
          'aria-activedescendant':
            open && highlightedIndex >= 0
              ? `${listboxId}-option-${highlightedIndex}`
              : undefined,
          'aria-autocomplete': 'list',
          autoComplete: 'off',
        },
        inputRef,
      })}
    </div>
  );

  const comboboxContent = renderInput
    ? renderCustomInput()
    : renderDefaultInput();

  /* --------------------------------------------------------------------- */
  /* Render — without label                                                 */
  /* --------------------------------------------------------------------- */
  if (!label) {
    return (
      <div ref={containerRef} className={cn('my-2 relative', className)}>
        {comboboxContent}
        {renderDropdown()}
      </div>
    );
  }

  /* --------------------------------------------------------------------- */
  /* Render — with label                                                    */
  /* --------------------------------------------------------------------- */
  /*
   * The dropdown listbox is rendered as a sibling to (not inside) the <label>
   * so that assistive technologies correctly expose listbox option children in
   * the accessibility tree.  Nesting a role="listbox" inside a <label> breaks
   * the parent-child a11y relationship required by ARIA combobox pattern.
   */
  return (
    <div ref={containerRef} className={cn('my-2 relative', className)}>
      <label
        {...LabelProps}
        className={cn(
          'relative block font-bold text-sm text-foreground',
          '[&>span:first-child]:top-0 [&>span:first-child]:inset-inline-start-0 [&>span:first-child]:absolute',
          LabelProps?.className,
        )}
      >
        <span>{label}</span>
        {comboboxContent}
      </label>
      {renderDropdown()}
    </div>
  );
}
