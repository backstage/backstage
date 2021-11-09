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
import FormControl from '@material-ui/core/FormControl';
import { Controller, Control, UseFormSetValue } from 'react-hook-form';
import { FormValues } from '../../types';
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import LuxonUtils from '@date-io/luxon';
import { IconButton } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';

type Props = {
  name: 'startDate' | 'endDate';
  control: Control<FormValues, object>;
  setValue: UseFormSetValue<FormValues>;
};

export const DateSelector = ({ name, control, setValue }: Props) => {
  const label = `${
    name.charAt(0).toLocaleUpperCase('en-US') + name.slice(1, name.indexOf('D'))
  } date`;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <FormControl>
          <MuiPickersUtilsProvider utils={LuxonUtils}>
            <KeyboardDatePicker
              disablePast
              disableToolbar
              format="dd-MM-yyyy"
              label={label}
              value={field.value}
              onChange={date => {
                setValue(name, date?.toISO());
              }}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={() => setValue(name, null)}>
                    <ClearIcon />
                  </IconButton>
                ),
              }}
              InputAdornmentProps={{
                position: 'start',
              }}
            />
          </MuiPickersUtilsProvider>
        </FormControl>
      )}
    />
  );
};
