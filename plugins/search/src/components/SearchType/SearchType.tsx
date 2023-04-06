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
import useEffectOnce from 'react-use/lib/useEffectOnce';
import {
  SearchTypeAccordion,
  SearchTypeAccordionProps,
} from './SearchType.Accordion';
import { SearchTypeTabs, SearchTypeTabsProps } from './SearchType.Tabs';
import { useSearch } from '@backstage/plugin-search-react';

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

/**
 * Props for {@link SearchType}.
 *
 * @public
 */
export type SearchTypeProps = {
  className?: string;
  name: string;
  values?: string[];
  defaultValue?: string[] | string | null;
};

/**
 * @public
 */
const SearchType = (props: SearchTypeProps) => {
  const { className, defaultValue, name, values = [] } = props;
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

/**
 * A control surface for the search query's "types" property, displayed as a
 * single-select collapsible accordion suitable for use in faceted search UIs.
 * @public
 */
SearchType.Accordion = (props: SearchTypeAccordionProps) => {
  return <SearchTypeAccordion {...props} />;
};

/**
 * A control surface for the search query's "types" property, displayed as a
 * tabs suitable for use in faceted search UIs.
 * @public
 */
SearchType.Tabs = (props: SearchTypeTabsProps) => {
  return <SearchTypeTabs {...props} />;
};

export { SearchType };
export type { SearchTypeAccordionProps, SearchTypeTabsProps };
