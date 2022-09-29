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
import { FieldExtensionComponentProps } from '../../../extensions';
import { TextField } from '@material-ui/core';

/**
 * EntityName Picker
 */
export const EntityNamePicker = (
  props: FieldExtensionComponentProps<string>,
) => {
  const {
    onChange,
    required,
    schema: { title = 'Name', description = 'Unique name of the component' },
    rawErrors,
    formData,
    uiSchema: { 'ui:autofocus': autoFocus },
    idSchema,
    placeholder,
  } = props;

  return (
    <TextField
      id={idSchema?.$id}
      label={title}
      placeholder={placeholder}
      helperText={description}
      required={required}
      value={formData ?? ''}
      onChange={({ target: { value } }) => onChange(value)}
      margin="normal"
      error={rawErrors?.length > 0 && !formData}
      inputProps={{ autoFocus }}
    />
  );
};
