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
import { type EntityFilterQuery } from '@backstage/catalog-client';
import { useApi } from '@backstage/core-plugin-api';
import {
  catalogApiRef,
  humanizeEntityRef,
} from '@backstage/plugin-catalog-react';
import { TextField } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import Autocomplete from '@material-ui/lab/Autocomplete';
import React, { useCallback, useEffect } from 'react';
import useAsync from 'react-use/lib/useAsync';
import { EntityPickerProps } from './schema';

export { EntityPickerSchema } from './schema';

/**
 * The underlying component that is rendered in the form for the `EntityPicker`
 * field extension.
 *
 * @public
 */
export const EntityPicker = (props: EntityPickerProps) => {
  const {
    onChange,
    schema: { title = 'Entity', description = 'An entity from the catalog' },
    required,
    uiSchema,
    rawErrors,
    formData,
    idSchema,
  } = props;
  const allowedKinds = uiSchema['ui:options']?.allowedKinds;

  const catalogFilter: EntityFilterQuery | undefined =
    uiSchema['ui:options']?.catalogFilter ||
    (allowedKinds && { kind: allowedKinds });

  const defaultKind = uiSchema['ui:options']?.defaultKind;
  const defaultNamespace = uiSchema['ui:options']?.defaultNamespace;

  const catalogApi = useApi(catalogApiRef);

  const { value: entities, loading } = useAsync(() =>
    catalogApi.getEntities(
      catalogFilter ? { filter: catalogFilter } : undefined,
    ),
  );

  const entityRefs = entities?.items.map(e =>
    humanizeEntityRef(e, { defaultKind, defaultNamespace }),
  );

  const onSelect = useCallback(
    (_: any, value: string | null) => {
      onChange(value ?? undefined);
    },
    [onChange],
  );

  useEffect(() => {
    if (entityRefs?.length === 1) {
      onChange(entityRefs[0]);
    }
  }, [entityRefs, onChange]);

  return (
    <FormControl
      margin="normal"
      required={required}
      error={rawErrors?.length > 0 && !formData}
    >
      <Autocomplete
        disabled={entityRefs?.length === 1}
        id={idSchema?.$id}
        value={(formData as string) || ''}
        loading={loading}
        onChange={onSelect}
        options={entityRefs || []}
        autoSelect
        freeSolo={uiSchema['ui:options']?.allowArbitraryValues ?? true}
        renderInput={params => (
          <TextField
            {...params}
            label={title}
            margin="dense"
            helperText={description}
            FormHelperTextProps={{ margin: 'dense', style: { marginLeft: 0 } }}
            variant="outlined"
            required={required}
            InputProps={params.InputProps}
          />
        )}
      />
    </FormControl>
  );
};
