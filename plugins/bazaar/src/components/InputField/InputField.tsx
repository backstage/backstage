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
import { Controller, Control, FieldError } from 'react-hook-form';
import { TextField } from '@material-ui/core';
import { FormValues } from '../../types';

type Props = {
  inputType: string;
  error: FieldError | undefined;
  control: Control<FormValues, object>;
  name: 'announcement' | 'status';
  helperText: string;
  placeholder?: string;
};

export const InputField = ({
  inputType,
  error,
  control,
  name,
  helperText,
  placeholder,
}: Props) => {
  const label = inputType.charAt(0).toUpperCase() + inputType.slice(1);

  return (
    <Controller
      name={name}
      control={control}
      rules={{
        required: true,
      }}
      render={({ field }) => (
        <TextField
          {...field}
          margin="dense"
          multiline
          id="title"
          type="text"
          fullWidth
          label={label}
          placeholder={placeholder}
          error={!!error}
          helperText={error && helperText}
        />
      )}
    />
  );
};
