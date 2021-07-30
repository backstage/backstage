/*
 * Copyright 2021 Spotify AB
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

import React, { ChangeEvent } from 'react';
import TextField from '@material-ui/core/TextField';

type Props = {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  isFormInvalid: boolean;
  inputType: string;
  placeholder?: string;
};

export const InputField = ({
  value,
  onChange,
  isFormInvalid,
  inputType,
  placeholder,
}: Props) => {
  const label = inputType.charAt(0).toUpperCase() + inputType.slice(1);
  return (
    <TextField
      data-testid={`inputField-${inputType}`}
      required
      style={{ whiteSpace: 'pre-wrap' }}
      multiline
      margin="dense"
      id="title"
      label={label}
      type="text"
      fullWidth
      placeholder={placeholder}
      error={isFormInvalid && value === ''}
      helperText={
        isFormInvalid && value === '' ? `Please enter a ${inputType}` : ' '
      }
      value={value}
      onChange={onChange}
    />
  );
};
