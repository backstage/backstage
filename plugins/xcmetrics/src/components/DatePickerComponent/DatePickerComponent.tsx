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
import React from 'react';
import {
  createStyles,
  InputBase,
  InputProps,
  Theme,
  Typography,
  withStyles,
} from '@material-ui/core';

const BootstrapInput = withStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: `${theme.spacing(1)} 0px`,
      maxWidth: 300,
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
      height: 25,
      '&:focus': {
        background: theme.palette.background.paper,
        borderRadius: 4,
      },
    },
  }),
)(InputBase);

interface DatePickerProps {
  label: string;
  onDateChange?: (date: string) => void;
}

export const DatePickerComponent = ({
  label,
  onDateChange,
  ...inputProps
}: InputProps & DatePickerProps) => (
  <>
    <Typography variant="button">{label}</Typography>
    <br />
    <BootstrapInput
      inputProps={{ 'aria-label': label }}
      type="date"
      fullWidth
      onChange={event => onDateChange?.(event.target.value)}
      {...inputProps}
    />
  </>
);
