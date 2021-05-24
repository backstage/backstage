/*
 * Copyright 2020 Spotify AB
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
  Card,
  CardContent,
  Checkbox,
  FormControl,
  InputLabel,
  List,
  MenuItem,
  ListItem,
  ListItemText,
  makeStyles,
  Select,
} from '@material-ui/core';
import React from 'react';
import { useSearch } from '../SearchContext';

const useFilterStyles = makeStyles({
  filters: {
    background: 'transparent',
    boxShadow: '0px 0px 0px 0px',
  },
});

const useCheckBoxStyles = makeStyles(theme => ({
  checkbox: {
    padding: theme.spacing(0, 1, 0, 1),
  },
}));

const useSelectStyles = makeStyles({
  select: {
    width: '100%',
  },
});

export type FilterOptions = {
  kind: Array<string>;
  lifecycle: Array<string>;
};

type FiltersProps = {
  children: React.ReactChild;
};

type ValuedFilterProps = {
  fieldName: string;
  values: string[];
};

export enum FilterType {
  CHECKBOX = 'checkbox',
  SELECT = 'select',
}

export type NewFilterDefinition = {
  component: any;
  props: any;
};

export type FilterDefinition = {
  field: string;
  type: FilterType;
  values: string[];
};

export const CheckBoxFilter = ({ fieldName, values }: ValuedFilterProps) => {
  const { filters, setFilters } = useSearch();
  const classes = useCheckBoxStyles();

  const setCheckboxFilter = (filter: string) => {
    const newFilters = filters;
    const currentValues = newFilters[fieldName] as string[];

    if (!filter) return;

    if (!currentValues) {
      setFilters({ ...filters, [fieldName]: [filter] });
    } else if (!currentValues?.includes(filter)) {
      setFilters({
        ...filters,
        [fieldName]: [...currentValues, filter],
      });
    } else {
      const filterToDelete = currentValues.find(value => value === filter);
      if (filterToDelete) {
        currentValues.splice(currentValues.indexOf(filterToDelete), 1);

        setFilters({ ...filters, [fieldName]: currentValues });
      }
    }
  };
  return (
    <CardContent>
      <InputLabel htmlFor="checkboxInput">{fieldName}</InputLabel>
      <List dense>
        {values.map((value: string) => (
          <ListItem
            key={value}
            dense
            button
            onClick={() => setCheckboxFilter(value)}
          >
            <Checkbox
              id="checkboxInput"
              className={classes.checkbox}
              edge="start"
              disableRipple
              color="primary"
              checked={
                filters[fieldName]
                  ? (filters[fieldName] as string[]).includes(value)
                  : false
              }
              tabIndex={-1}
              value={value}
              name={value}
            />
            <ListItemText id={value} primary={value} />
          </ListItem>
        ))}
      </List>
    </CardContent>
  );
};

export const SelectFilter = ({ fieldName, values }: ValuedFilterProps) => {
  const { filters, setFilters } = useSearch();
  const classes = useSelectStyles();

  const setSelectFilter = (filter: string) => {
    const newFilters = filters;
    if (newFilters[fieldName] && filter === '') {
      delete newFilters[fieldName];
      setFilters({ newFilters });
    } else {
      setFilters({ ...filters, [fieldName]: filter as string });
    }
  };

  return (
    <CardContent>
      <FormControl variant="filled" className={classes.select}>
        <InputLabel margin="dense">{fieldName}</InputLabel>
        <Select
          variant="outlined"
          value={filters[fieldName] || ''}
          onChange={(e: React.ChangeEvent<any>) =>
            setSelectFilter(e?.target?.value)
          }
        >
          <MenuItem value="">
            <em>All</em>
          </MenuItem>
          {values.map((value: string) => (
            <MenuItem value={value}>{value}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </CardContent>
  );
};

export const SearchFiltersNext = ({ children }: FiltersProps) => {
  const classes = useFilterStyles();

  return <Card className={classes.filters}>{children}</Card>;
};
