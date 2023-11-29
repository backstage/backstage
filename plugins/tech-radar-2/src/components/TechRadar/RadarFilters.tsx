/*
 * Copyright 2023 The Backstage Authors
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
import React, { ChangeEventHandler, FC, useState } from 'react';

import { TextField, Select, MenuItem, InputAdornment, makeStyles, Typography } from '@material-ui/core';
import Search from '@material-ui/icons/Search';
import { useDebounce } from 'react-use';

import { Category, Discipline, Lifecycle, Quadrant } from '../../types';

import DisciplineFilter from './DisciplineFilter';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },

  select: {
    flexGrow: 1,
  },

  search: {
    width: '45%',
  },

  label: {
    textTransform: 'uppercase',
    fontWeight: 700,
    marginBottom: theme.spacing(1),
  },

  category: {
    textTransform: 'capitalize',
  },
}));

export interface EntryFilter {
  lifecycle?: Lifecycle;
  category?: Category;
  searchTerm?: string;
  discipline?: Discipline;
}

interface RadarFiltersProps {
  activeQuadrant?: Quadrant;
  value: EntryFilter;
  onChange: (e: EntryFilter) => void;
}

type SelectEventHandler = ChangeEventHandler<{ name?: string; value: unknown }>;

const RadarFilters: FC<RadarFiltersProps> = ({ activeQuadrant, value, onChange }) => {
  const classes = useStyles();
  const [searchTerm, setSearchTerm] = useState(value.searchTerm);

  useDebounce(
    () => {
      onChange({
        ...value,
        searchTerm,
      });
    },
    400,
    [searchTerm],
  );

  const handleLifecycleChange: SelectEventHandler = e => {
    e.preventDefault();
    onChange({
      ...value,
      lifecycle: e.target.value as Lifecycle,
    });
  };

  const handleCategoryChange: SelectEventHandler = e => {
    e.preventDefault();
    onChange({
      ...value,
      category: e.target.value as Category,
    });
  };

  const handleDisciplineChange = (discipline?: Discipline) => {
    onChange({
      ...value,
      discipline,
    });
  };

  return (
    <>
      <DisciplineFilter value={value.discipline} onChange={handleDisciplineChange} />
      <div className={classes.container}>
        <div className={classes.search}>
          <Typography className={classes.label}>Search</Typography>
          <TextField
            fullWidth
            placeholder="Search for languages, frameworks, infrastructure, techniques and vendors"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </div>
        <div className={classes.select}>
          <Typography className={classes.label}>Stage</Typography>
          <Select fullWidth value={value.lifecycle || 0} onChange={handleLifecycleChange} variant="outlined">
            <MenuItem value={0}>All Results</MenuItem>
            <MenuItem value={Lifecycle.Use}>Use</MenuItem>
            <MenuItem value={Lifecycle.Trial}>Trial</MenuItem>
            <MenuItem value={Lifecycle.Assess}>Assess</MenuItem>
            <MenuItem value={Lifecycle.Hold}>Hold</MenuItem>
          </Select>
        </div>
        <div className={classes.select}>
          <Typography className={classes.label}>Category</Typography>
          <Select fullWidth value={value.category || 0} onChange={handleCategoryChange} variant="outlined">
            <MenuItem value={0} disabled={!!activeQuadrant}>
              All Results
            </MenuItem>
            {[Category.Languages, Category.Techniques, Category.Frameworks, Category.Infrastructure].map(category => (
              <MenuItem key={category} value={category} disabled={activeQuadrant && activeQuadrant.id !== category}>
                <span className={classes.category}>{category}</span>
              </MenuItem>
            ))}
          </Select>
        </div>
      </div>
    </>
  );
};

export default RadarFilters;
