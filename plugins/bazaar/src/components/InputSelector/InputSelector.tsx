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
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { Controller, Control, FieldError } from 'react-hook-form';
import { FormValues } from '../../util/types';

type Props = {
  options: string[];
  control: Control<FormValues, object>;
  name: 'announcement' | 'status';
  error?: FieldError | undefined;
};

export const InputSelector = ({ name, options, control, error }: Props) => {
  const label = name.charAt(0).toUpperCase() + name.slice(1);

  return (
    <Controller
      name={name}
      control={control}
      rules={{
        required: true,
      }}
      render={({ field }) => (
        <FormControl fullWidth>
          <InputLabel
            htmlFor="demo-simple-select-outlined"
            id="demo-simple-select-outlined-label"
          >
            {label}
          </InputLabel>
          <Select
            {...field}
            required
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            label={label}
            error={!!error}
          >
            {options.map(option => {
              return (
                <MenuItem
                  data-testid="menu-item"
                  button
                  key={option}
                  value={option}
                >
                  {option}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      )}
    />
  );
};
