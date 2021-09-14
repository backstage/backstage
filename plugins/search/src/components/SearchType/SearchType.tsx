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
  InputLabel,
  ListItemText,
  makeStyles,
  MenuItem,
  Select,
} from '@material-ui/core';
import React, { ChangeEvent } from 'react';
import { useEffectOnce } from 'react-use';
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

export type SearchTypeProps = {
  className?: string;
  name: string;
  values?: string[];
  defaultValue?: string[] | string | null;
};

const SearchType = ({
  values = [],
  className,
  name,
  defaultValue,
}: SearchTypeProps) => {
  const classes = useStyles();
  const { types, setTypes } = useSearch();

  useEffectOnce(() => {
    if (!types.length) {
      if (defaultValue && Array.isArray(defaultValue)) {
        setTypes(defaultValue);
      } else if (defaultValue) {
        setTypes([defaultValue]);
      }
    }
  });

  const handleChange = (e: ChangeEvent<{ value: unknown }>) => {
    const value = e.target.value as string[];
    setTypes(value as string[]);
  };

  return (
    <FormControl
      className={className}
      variant="filled"
      fullWidth
      data-testid="search-typefilter-next"
    >
      <InputLabel className={classes.label} margin="dense">
        {name}
      </InputLabel>
      <Select
        multiple
        variant="outlined"
        value={types}
        onChange={handleChange}
        placeholder="All Results"
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
      >
        {values.map((value: string) => (
          <MenuItem key={value} value={value}>
            <Checkbox checked={types.indexOf(value) > -1} />
            <ListItemText primary={value} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export { SearchType };
