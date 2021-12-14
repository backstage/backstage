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
  formatEntityRefTitle,
  useOwnedEntities,
} from '@backstage/plugin-catalog-react';
import { TextField } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { FieldProps } from '@rjsf/core';
import React from 'react';

export const OwnedEntityPicker = ({
  onChange,
  schema: { title = 'Entity', description = 'An entity from the catalog' },
  required,
  uiSchema,
  rawErrors,
  formData,
  idSchema,
}: FieldProps<string>) => {
  const allowedKinds = uiSchema['ui:options']?.allowedKinds as string[];
  const defaultKind = uiSchema['ui:options']?.defaultKind as string | undefined;
  const { ownedEntities, loading } = useOwnedEntities(allowedKinds);

  const entityRefs = ownedEntities?.items
    .map(e => formatEntityRefTitle(e, { defaultKind }))
    .filter(n => n);

  const onSelect = (_: any, value: string | null) => {
    onChange(value || '');
  };

  return (
    <FormControl
      margin="normal"
      required={required}
      error={rawErrors?.length > 0 && !formData}
    >
      <Autocomplete
        id={idSchema?.$id}
        value={(formData as string) || ''}
        loading={loading}
        onChange={onSelect}
        options={entityRefs || []}
        autoSelect
        freeSolo
        renderInput={params => (
          <TextField
            {...params}
            label={title}
            margin="normal"
            helperText={description}
            variant="outlined"
            required={required}
            InputProps={params.InputProps}
          />
        )}
      />
    </FormControl>
  );
};
