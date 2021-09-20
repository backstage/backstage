/*
 * Copyright 2021 The Backstage Authors
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
  Checkbox,
  Chip,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  ListItemText,
  makeStyles,
  MenuItem,
  Select,
} from '@material-ui/core';
import React, { ChangeEvent, ReactElement, useEffect } from 'react';
import { useSearch } from '../SearchContext';

const useStyles = makeStyles(theme => ({
  label: {
    textTransform: 'capitalize',
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
    marginTop: theme.spacing(1),
  },
  chip: {
    margin: 2,
  },
}));

export type Component = {
  className?: string;
  name: string;
  values?: string[];
  defaultValue?: string[] | string | null;
};

export type Props = Component & {
  component: (props: Component) => ReactElement;
  debug?: boolean;
};

const CheckboxFilter = ({
  className,
  name,
  defaultValue,
  values = [],
}: Component) => {
  const classes = useStyles();
  const { filters, setFilters } = useSearch();

  useEffect(() => {
    if (Array.isArray(defaultValue)) {
      setFilters(prevFilters => ({
        ...prevFilters,
        [name]: defaultValue,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    <FormControl
      className={className}
      fullWidth
      data-testid="search-checkboxfilter-next"
    >
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

const SelectFilter = ({
  className,
  name,
  defaultValue,
  values = [],
}: Component) => {
  const classes = useStyles();
  const { filters, setFilters } = useSearch();

  useEffect(() => {
    if (typeof defaultValue === 'string') {
      setFilters(prevFilters => ({
        ...prevFilters,
        [name]: defaultValue,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    <FormControl
      className={className}
      variant="filled"
      fullWidth
      data-testid="search-selectfilter-next"
    >
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

const SelectMultipleFilter = ({
  className,
  name,
  defaultValue,
  values = [],
}: Component) => {
  const classes = useStyles();
  const { filters, setFilters } = useSearch();

  const currentFilter = (filters[name] as string[]) ?? [];

  useEffect(() => {
    let value: string[] | undefined;

    if (Array.isArray(defaultValue)) {
      value = defaultValue;
    } else if (typeof defaultValue === 'string') {
      value = [defaultValue];
    }

    if (value) {
      setFilters(prevFilters => ({
        ...prevFilters,
        [name]: value,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e: ChangeEvent<{ value: unknown }>) => {
    const {
      target: { value },
    } = e;

    setFilters(prevFilters => {
      const { [name]: filter, ...others } = prevFilters;
      return value ? { ...others, [name]: value as string[] } : others;
    });
  };

  return (
    <FormControl
      className={className}
      variant="filled"
      fullWidth
      data-testid="search-selectmultiplefilter-next"
    >
      <InputLabel className={classes.label} margin="dense">
        {name}
      </InputLabel>
      <Select
        multiple
        variant="outlined"
        value={currentFilter}
        placeholder="All"
        renderValue={selected => (
          <div className={classes.chips}>
            {(selected as string[]).map(value => (
              <Chip
                key={value}
                label={value}
                className={classes.chip}
                size="small"
              />
            ))}
          </div>
        )}
        onChange={handleChange}
      >
        {values.map((value: string) => (
          <MenuItem key={value} value={value}>
            <Checkbox checked={currentFilter.indexOf(value) > -1} />
            <ListItemText primary={value} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

const SearchFilter = ({ component: Element, ...props }: Props) => (
  <Element {...props} />
);

SearchFilter.Checkbox = (props: Omit<Props, 'component'>) => (
  <SearchFilter {...props} component={CheckboxFilter} />
);

SearchFilter.Select = (props: Omit<Props, 'component'>) => (
  <SearchFilter {...props} component={SelectFilter} />
);

SearchFilter.SelectMultiple = (props: Omit<Props, 'component'>) => (
  <SearchFilter {...props} component={SelectMultipleFilter} />
);

/**
 * @deprecated This component was used for rapid prototyping of the Backstage
 * Search platform. Now that the API has stabilized, you should use the
 * <SearchFilter /> component instead. This component will be removed in an
 * upcoming release.
 */
const SearchFilterNext = SearchFilter;

export { SearchFilter, SearchFilterNext };
