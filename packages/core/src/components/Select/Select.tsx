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

import React, { useState } from 'react';
import {
  createStyles,
  makeStyles,
  withStyles,
  Theme,
} from '@material-ui/core/styles';

import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputBase,
} from '@material-ui/core';

import ClosedDropdown from './static/ClosedDropdown';
import OpenedDropdown from './static/OpenedDropdown';

const BootstrapInput = withStyles((theme: Theme) =>
  createStyles({
    root: {
      'label + &': {
        marginTop: theme.spacing(3),
      },
    },
    input: {
      borderRadius: 4,
      position: 'relative',
      backgroundColor: theme.palette.background.paper,
      border: '1px solid #ced4da',
      fontSize: 16,
      padding: '10px 26px 10px 12px',
      transition: theme.transitions.create(['border-color', 'box-shadow']),
      fontFamily: 'Helvetica Neue',
      '&:focus': {
        background: theme.palette.background.paper,
        borderRadius: 4,
      },
    },
  }),
)(InputBase);

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 315,
    },
    label: {
      transform: 'initial',
      fontWeight: 'bold',
      fontSize: 14,
      fontFamily: theme.typography.fontFamily,
      color: theme.palette.text.primary,
      '&.Mui-focused': {
        color: theme.palette.text.primary,
      },
    },
  }),
);

type Item = {
  label: string;
  value: string | number;
};

type Props = {
  multiple?: boolean;
  items: Item[];
  label: string;
};

export const SelectComponent = (props: Props) => {
  const { multiple, items, label } = props;
  const classes = useStyles();
  const [value, setValue] = useState('');
  const [isOpen, setOpening] = useState(true);

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setValue(event.target.value as string);
  };

  return (
    <FormControl className={classes.formControl}>
      <InputLabel className={classes.label} disableAnimation id="select-label">
        {label}
      </InputLabel>
      <Select
        id="select"
        value={value}
        multiple={multiple}
        onChange={handleChange}
        onOpen={() => setOpening(false)}
        onClose={() => setOpening(true)}
        input={<BootstrapInput />}
        IconComponent={() => (
            isOpen ? <ClosedDropdown /> : <OpenedDropdown />
        )}
        MenuProps={{
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'left',
          },
          transformOrigin: {
            vertical: 'top',
            horizontal: 'left',
          },
          getContentAnchorEl: null,
        }}
      >
        {items &&
          items.map(item => (
            <MenuItem key={item.value} value={item.value}>
              {item.label}
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  );
};
