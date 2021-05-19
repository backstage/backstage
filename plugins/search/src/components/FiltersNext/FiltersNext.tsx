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

import React from 'react';
import {
  makeStyles,
  Typography,
  Card,
  CardContent,
  Select,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  MenuItem,
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  filters: {
    background: 'transparent',
    boxShadow: '0px 0px 0px 0px',
  },
  // checkbox: {
  //   padding: theme.spacing(0, 1, 0, 1),
  // },
  // dropdown: {
  //   width: '100%',
  // },
}));

export type FilterOptions = {
  kind: Array<string>;
  lifecycle: Array<string>;
};

type FiltersProps = {
  definitions: FilterDefinition[];
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

const CheckBoxFilter = ({ fieldName, values }: ValuedFilterProps) => {
  return (
    <CardContent>
      <Typography variant="subtitle2">{fieldName}</Typography>
      <List disablePadding dense>
        {values.map((value: string) => (
          <ListItem key={value} dense button onClick={() => {}}>
            <Checkbox
              edge="start"
              disableRipple
              color="primary"
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

const SelectFilter = ({ fieldName, values }: ValuedFilterProps) => {
  return (
    <CardContent>
      <Typography variant="subtitle2">{fieldName}</Typography>
      <Select id="outlined-select" onChange={() => {}} variant="outlined">
        {values.map((value: string) => (
          <MenuItem selected={value === ''} dense key={value} value={value}>
            {value}
          </MenuItem>
        ))}
      </Select>
    </CardContent>
  );
};

export const FiltersNext = ({ definitions }: FiltersProps) => {
  const classes = useStyles();

  return (
    <Card className={classes.filters}>
      {definitions.map(definition => {
        switch (definition.type) {
          case 'checkbox':
            return (
              <CheckBoxFilter
                fieldName={definition.field}
                values={definition.values}
              />
            );
          case 'select':
            return (
              <SelectFilter
                fieldName={definition.field}
                values={definition.values}
              />
            );
          default:
            return null;
        }
      })}
    </Card>
  );
};
