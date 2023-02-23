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
import {
  Entity,
  parseEntityRef,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import { useApi } from '@backstage/core-plugin-api';
import {
  catalogApiRef,
  humanizeEntityRef,
} from '@backstage/plugin-catalog-react';
import { TextField } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import Autocomplete, {
  AutocompleteChangeReason,
} from '@material-ui/lab/Autocomplete';
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
  const defaultNamespace =
    uiSchema['ui:options']?.defaultNamespace || undefined;

  const catalogApi = useApi(catalogApiRef);

  const { value: entities, loading } = useAsync(async () => {
    const { items } = await catalogApi.getEntities(
      catalogFilter ? { filter: catalogFilter } : undefined,
    );
    return items;
  });
  const allowArbitraryValues =
    uiSchema['ui:options']?.allowArbitraryValues ?? true;

  const getLabel = useCallback(
    (ref: string) => {
      try {
        return humanizeEntityRef(
          parseEntityRef(ref, { defaultKind, defaultNamespace }),
          {
            defaultKind,
            defaultNamespace,
          },
        );
      } catch (err) {
        return ref;
      }
    },
    [defaultKind, defaultNamespace],
  );

  const onSelect = useCallback(
    (_: any, ref: string | Entity | null, reason: AutocompleteChangeReason) => {
      // ref can either be a string from free solo entry or
      if (typeof ref !== 'string') {
        onChange(ref ? stringifyEntityRef(ref as Entity) : '');
      } else {
        if (reason === 'blur' || reason === 'create-option') {
          // Add in default namespace, etc.
          let entityRef = ref;
          try {
            // Attempt to parse the entity ref into it's full form.
            entityRef = stringifyEntityRef(
              parseEntityRef(ref as string, {
                defaultKind,
                defaultNamespace,
              }),
            );
          } catch (err) {
            // If the passed in value isn't an entity ref, do nothing.
          }
          // We need to check against formData here as that's the previous value for this field.
          if (formData !== ref || allowArbitraryValues) {
            onChange(entityRef);
          }
        }
      }
    },
    [onChange, formData, defaultKind, defaultNamespace, allowArbitraryValues],
  );

  useEffect(() => {
    if (entities?.length === 1) {
      onChange(stringifyEntityRef(entities[0]));
    }
  }, [entities, onChange]);

  return (
    <FormControl
      margin="normal"
      required={required}
      error={rawErrors?.length > 0 && !formData}
    >
      <Autocomplete
        disabled={entities?.length === 1}
        id={idSchema?.$id}
        value={
          // Since free solo can be enabled, attempt to parse as a full entity ref first, then fall
          //  back to the given value.
          entities?.find(e => stringifyEntityRef(e) === formData) ??
          (allowArbitraryValues && formData ? getLabel(formData) : '')
        }
        loading={loading}
        onChange={onSelect}
        options={entities || []}
        getOptionLabel={option =>
          // option can be a string due to freeSolo.
          typeof option === 'string'
            ? option
            : humanizeEntityRef(option, { defaultKind, defaultNamespace })!
        }
        autoSelect
        freeSolo={allowArbitraryValues}
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
