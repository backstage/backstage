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

import React, { ReactNode, ChangeEvent, useCallback } from 'react';
import {
  Box,
  InputBase,
  MenuItem,
  Select,
  Typography,
  useTheme,
} from '@material-ui/core';
import { useSearch } from '../../context';

/**
 * Props for {@link SearchResultLimiterBase}.
 * @public
 */
export type SearchResultLimiterBaseProps = {
  id?: string;
  className?: string;
  /**
   * A label for the combobox.
   */
  label?: ReactNode;
  /**
   * The combobox labels, defaults to 10, 25, 50 and 100.
   */
  options?: number[];
  /**
   * Combobox selected option, defaults to 25;
   */
  value?: number;
  /**
   * The callback handler called when the selected option changed.
   */
  onChange?: (value: number) => void;
};

const DEFAULT_PAGE_LIMIT = 25;

/**
 * A component for selecting the number of results per page.
 * @param props - See {@link SearchResultLimiterBaseProps}.
 * @public
 */
export const SearchResultLimiterBase = (
  props: SearchResultLimiterBaseProps,
) => {
  const {
    id = 'search-result-limiter',
    className,
    label = 'Results per page:',
    options = [10, 50, 100],
    value = DEFAULT_PAGE_LIMIT,
    onChange = () => {},
  } = props;

  const theme = useTheme();

  const handleChange = useCallback(
    (e: ChangeEvent<{ value: unknown }>) => {
      const newValue = e.target.value;
      if (typeof newValue === 'number') {
        onChange(newValue);
      }
    },
    [onChange],
  );

  return (
    <Box
      className={className}
      display="inline-grid"
      gridGap={theme.spacing(0.5)}
      gridAutoFlow="column"
      alignItems="center"
    >
      <Typography id={`${id}-label`} variant="body2">
        {label}
      </Typography>
      <Select
        id={`${id}-select`}
        labelId={`${id}-label`}
        variant="standard"
        input={<InputBase />}
        value={value}
        onChange={handleChange}
      >
        {[...new Set([DEFAULT_PAGE_LIMIT, ...options])]
          .sort((a, b) => a - b)
          .map(option => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
      </Select>
    </Box>
  );
};

/**
 * Props for {@link SearchResultLimiter}.
 * @public
 */
export type SearchResultLimiterProps = Omit<
  SearchResultLimiterBaseProps,
  'value' | 'onChange'
>;

/**
 * A component for setting the search context page limit.
 * @param props - See {@link SearchResultLimiterProps}.
 * @public
 */
export const SearchResultLimiter = (props: SearchResultLimiterProps) => {
  const { pageLimit, setPageLimit } = useSearch();

  const handleChange = useCallback(
    (newPageLimit: number) => {
      setPageLimit(newPageLimit);
    },
    [setPageLimit],
  );

  return (
    <SearchResultLimiterBase
      {...props}
      value={pageLimit}
      onChange={handleChange}
    />
  );
};
