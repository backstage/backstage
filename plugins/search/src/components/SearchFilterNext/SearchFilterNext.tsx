/*
 * Copyright 2021 Spotify AB
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

import React, { ReactElement, ChangeEvent, useEffect } from 'react';
import {
  makeStyles,
  FormControl,
  FormControlLabel,
  InputLabel,
  Checkbox,
  Select,
  MenuItem,
  FormLabel,
} from '@material-ui/core';

import { useSearch } from '../SearchContext';

const useStyles = makeStyles({
  label: {
    textTransform: 'capitalize',
  },
});

export type Component = {
  name: string;
  values?: string[];
  defaultValue?: string[] | string | null;
};

export type Props = Component & {
  component: (props: Component) => ReactElement;
  debug?: boolean;
};

const CheckboxFilter = ({ name, defaultValue, values = [] }: Component) => {
  const classes = useStyles();
  const { filters, setFilters } = useSearch();

  useEffect(() => {
    if (Array.isArray(defaultValue)) {
      setFilters(prevFilters => ({
        ...prevFilters,
        [name]: defaultValue,
      }));
    }
  }, [name, defaultValue, setFilters]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value, checked },
    } = e;

    setFilters(prevFilters => {
      const { [name]: filter, ...others } = prevFilters;
      const rest = ((filter as string[]) || []).filter(i => i !== value);
      const items = checked ? [...rest, value] : rest;
      return items.length ? { ...others, [name]: items } : others;
    });
  };

  return (
    <FormControl>
      <FormLabel className={classes.label}>{name}</FormLabel>
      {values.map((value: string) => (
        <FormControlLabel
          key={value}
          control={
            <Checkbox
              color="primary"
              tabIndex={-1}
              inputProps={{ 'aria-labelledby': value }}
              value={value}
              name={value}
              onChange={handleChange}
              checked={((filters[name] as string[]) ?? []).includes(value)}
            />
          }
          label={value}
        />
      ))}
    </FormControl>
  );
};

const SelectFilter = ({ name, defaultValue, values = [] }: Component) => {
  const classes = useStyles();
  const { filters, setFilters } = useSearch();

  useEffect(() => {
    if (typeof defaultValue === 'string') {
      setFilters(prevFilters => ({
        ...prevFilters,
        [name]: defaultValue,
      }));
    }
  }, [name, defaultValue, setFilters]);

  const handleChange = (e: ChangeEvent<{ value: unknown }>) => {
    const {
      target: { value },
    } = e;

    setFilters(prevFilters => {
      const { [name]: filter, ...others } = prevFilters;
      return value ? { ...others, [name]: value as string } : others;
    });
  };

  return (
    <FormControl variant="filled" fullWidth>
      <InputLabel className={classes.label} margin="dense">
        {name}
      </InputLabel>
      <Select
        variant="outlined"
        value={filters[name] || ''}
        onChange={handleChange}
      >
        <MenuItem value="">
          <em>All</em>
        </MenuItem>
        {values.map((value: string) => (
          <MenuItem key={value} value={value}>
            {value}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

const SearchFilterNext = ({ component: Element, ...props }: Props) => (
  <Element {...props} />
);

SearchFilterNext.Checkbox = (props: Omit<Props, 'component'> & Component) => (
  <SearchFilterNext {...props} component={CheckboxFilter} />
);

SearchFilterNext.Select = (props: Omit<Props, 'component'> & Component) => (
  <SearchFilterNext {...props} component={SelectFilter} />
);

export { SearchFilterNext };
