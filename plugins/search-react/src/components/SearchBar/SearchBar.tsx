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

import {
  AnalyticsContext,
  configApiRef,
  useApi,
  useApp,
} from '@backstage/core-plugin-api';
import { ShadcnButton as Button, Input } from '@backstage/core-components';
import { Search } from 'lucide-react';
import {
  ReactNode,
  ChangeEvent,
  forwardRef,
  KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import useDebounce from 'react-use/esm/useDebounce';
import { SearchContextProvider, useSearch } from '../../context';
import { useTranslationRef } from '@backstage/frontend-plugin-api';
import { searchReactTranslationRef } from '../../translation';

/**
 * Props for {@link SearchBarBase}.
 *
 * @public
 */
export type SearchBarBaseProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'onChange'
> & {
  debounceTime?: number;
  clearButton?: boolean;
  onClear?: () => void;
  onSubmit?: () => void;
  onChange: (value: string) => void;
  endAdornment?: ReactNode;
  label?: string;
  fullWidth?: boolean;
  className?: string;
};

/**
 * All search boxes exported by the search plugin are based on the <SearchBarBase />,
 * and this one is based on the shadcn/ui Input component styled with Tailwind CSS.
 * Recommended if you don't use Search Provider or Search Context.
 *
 * @public
 */
export const SearchBarBase = forwardRef<HTMLInputElement, SearchBarBaseProps>(
  (props, ref) => {
    const {
      onChange,
      onKeyDown = () => {},
      onClear = () => {},
      onSubmit = () => {},
      debounceTime = 200,
      clearButton = true,
      fullWidth = true,
      value: defaultValue,
      label,
      placeholder,
      endAdornment,
      className,
      ...rest
    } = props;

    const configApi = useApi(configApiRef);
    const [value, setValue] = useState<string>('');
    const forwardedValueRef = useRef<string>('');
    const { t } = useTranslationRef(searchReactTranslationRef);

    useEffect(() => {
      setValue(prevValue => {
        // We only update the value if our current value is the same as it was
        // for the most recent onChange call. Otherwise it means that the users
        // has continued typing and we should not replace their input.
        if (prevValue === forwardedValueRef.current) {
          return String(defaultValue);
        }
        return prevValue;
      });
    }, [defaultValue, forwardedValueRef]);

    useDebounce(
      () => {
        forwardedValueRef.current = value;
        onChange(value);
      },
      debounceTime,
      [value],
    );

    const handleChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
      },
      [setValue],
    );

    const handleKeyDown = useCallback(
      (e: KeyboardEvent<HTMLInputElement>) => {
        if (onKeyDown) onKeyDown(e);
        if (onSubmit && e.key === 'Enter') {
          onSubmit();
        }
      },
      [onKeyDown, onSubmit],
    );

    const handleClear = useCallback(() => {
      forwardedValueRef.current = '';
      onChange('');
      setValue('');
      if (onClear) {
        onClear();
      }
    }, [onChange, onClear]);

    const ariaLabel: string = label ?? t('searchBar.title');

    const inputPlaceholder =
      placeholder ??
      t('searchBar.placeholder', {
        org: configApi.getOptionalString('app.title') || 'Backstage',
      });
    const SearchIcon = useApp().getSystemIcon('search') || Search;

    return (
      <SearchContextProvider inheritParentContextIfAvailable>
        <div
          className={`relative flex items-center${fullWidth ? ' w-full' : ''}`}
          data-testid="search-bar-next"
        >
          <span
            className="absolute left-3 flex items-center pointer-events-none"
            aria-label="Query"
          >
            <SearchIcon className="h-4 w-4 text-muted-foreground" />
          </span>
          <Input
            id="search-bar-text-field"
            ref={ref}
            value={value}
            placeholder={inputPlaceholder}
            aria-label={ariaLabel}
            className={`pl-10${clearButton && value ? ' pr-20' : ' pr-3'}${
              className ? ` ${className}` : ''
            }`}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            {...rest}
          />
          {clearButton && value ? (
            <Button
              variant="ghost"
              size="sm"
              aria-label={t('searchBar.clearButtonTitle')}
              className="absolute right-1"
              onClick={handleClear}
              onKeyDown={event => {
                if (event.key === 'Enter') {
                  event.stopPropagation();
                }
              }}
            >
              {t('searchBar.clearButtonTitle')}
            </Button>
          ) : (
            endAdornment && (
              <span className="absolute right-3 flex items-center">
                {endAdornment}
              </span>
            )
          )}
        </div>
      </SearchContextProvider>
    );
  },
);

/**
 * Props for {@link SearchBar}.
 *
 * @public
 */
export type SearchBarProps = Partial<SearchBarBaseProps>;

/**
 * Recommended search bar when you use the Search Provider or Search Context.
 *
 * @public
 */
export const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
  (props, ref) => {
    const { value: initialValue = '', onChange, ...rest } = props;

    const { term, setTerm } = useSearch();

    useEffect(() => {
      if (initialValue) {
        setTerm(String(initialValue));
      }
    }, [initialValue, setTerm]);

    const handleChange = useCallback(
      (newValue: string) => {
        if (onChange) {
          onChange(newValue);
        } else {
          setTerm(newValue);
        }
      },
      [onChange, setTerm],
    );

    return (
      <SearchContextProvider inheritParentContextIfAvailable>
        <AnalyticsContext
          attributes={{ pluginId: 'search', extension: 'SearchBar' }}
        >
          <SearchBarBase
            {...rest}
            ref={ref}
            value={term}
            onChange={handleChange}
          />
        </AnalyticsContext>
      </SearchContextProvider>
    );
  },
);
