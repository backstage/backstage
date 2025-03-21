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

import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import { TextFieldProps } from '@material-ui/core/TextField/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import React from 'react';
import { Controller, FieldErrors } from 'react-hook-form';

/**
 * Props for {@link AutocompleteTextField}.
 *
 * @public
 */
export interface AutocompleteTextFieldProps<TFieldValue extends string> {
  name: TFieldValue;
  options: string[];
  required?: boolean;

  errors?: FieldErrors;
  rules?: React.ComponentProps<typeof Controller>['rules'];

  loading?: boolean;
  loadingText?: string;

  helperText?: React.ReactNode;
  errorHelperText?: string;

  textFieldProps?: Omit<TextFieldProps, 'required' | 'fullWidth'>;
}

/**
 * An autocompletion text field for the catalog import flows.
 *
 * @public
 */
export const AutocompleteTextField = <TFieldValue extends string>(
  props: AutocompleteTextFieldProps<TFieldValue>,
) => {
  const {
    name,
    options,
    required,
    errors,
    rules,
    loading = false,
    loadingText,
    helperText,
    errorHelperText,
    textFieldProps = {},
  } = props;

  return (
    <Controller
      name={name}
      rules={rules}
      render={({ field: { onChange } }) => (
        <Autocomplete
          loading={loading}
          loadingText={loadingText}
          options={options || []}
          autoSelect
          freeSolo
          onChange={(_event: React.ChangeEvent<{}>, value: string | null) =>
            onChange(value)
          }
          renderInput={params => (
            <TextField
              {...params}
              helperText={(errors?.[name] && errorHelperText) || helperText}
              error={Boolean(errors?.[name])}
              margin="normal"
              variant="outlined"
              required={required}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <React.Fragment>
                    {loading ? (
                      <CircularProgress color="inherit" size="1em" />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                ),
              }}
              {...textFieldProps}
            />
          )}
        />
      )}
    />
  );
};
