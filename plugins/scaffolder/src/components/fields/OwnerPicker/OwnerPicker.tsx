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
import React from 'react';
import { Field } from '@rjsf/core';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { useApi } from '@backstage/core';
import { useAsync } from 'react-use';
import Autocomplete from '@material-ui/lab/Autocomplete';
import FormControl from '@material-ui/core/FormControl';
import { Entity } from '@backstage/catalog-model';
import { TextField } from '@material-ui/core';

const entityRef = (entity: Entity | undefined): string => {
  if (!entity) {
    return '';
  }
  const {
    kind,
    metadata: { namespace, name },
  } = entity;

  const namespacePart =
    !namespace || namespace === 'default' ? '' : `${namespace}/`;
  const kindPart = kind.toLowerCase() === 'group' ? '' : `${kind}:`;

  return `${kindPart}${namespacePart}${name}`;
};

export const OwnerPicker: Field = ({
  onChange,
  schema: { title = 'Owner', description = 'The owner of the component' },
  required,
  uiSchema,
  rawErrors,
  formData,
}) => {
  const allowedKinds = (uiSchema['ui:options']?.allowedKinds || [
    'Group',
    'User',
  ]) as string[];
  const catalogApi = useApi(catalogApiRef);

  const { value: owners, loading } = useAsync(() =>
    catalogApi.getEntities({ filter: { kind: allowedKinds } }),
  );

  const ownerRefs = owners?.items.map(entityRef);

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
        value={(formData as string) || ''}
        loading={loading}
        onChange={onSelect}
        options={ownerRefs || []}
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
