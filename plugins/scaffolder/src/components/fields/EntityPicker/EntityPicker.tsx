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
  type EntityFilterQuery,
  CATALOG_FILTER_EXISTS,
} from '@backstage/catalog-client';
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
import { EntityPickerProps, EntityPickerUiOptions } from './schema';

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
  const catalogFilter = buildCatalogFilter(uiSchema);
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

/**
 * Converts a boolean value `true` to `CATALOG_FILTER_EXISTS`.
 * Returns the input value if it is not a boolean `true`.
 *
 * @param value - The value to convert.
 * @returns The converted value.
 */
function convertTrueToExists(value: string | boolean): string | symbol {
  if (value === true) {
    return CATALOG_FILTER_EXISTS;
  }
  return value?.toString();
}

/**
 * Converts schema filters to entity filter query, replacing boolean `true` values
 * with the constant `CATALOG_FILTER_EXISTS`.
 *
 * @param schemaFilters - An object containing schema filters with keys as filter names
 * and values as filter values.
 * @returns An object with the same keys as the input object, but with `true` boolean values
 * transformed to `CATALOG_FILTER_EXISTS` symbol.
 */
function convertSchemaFiltersToQuery(
  schemaFilters: Record<string, string | boolean | (string | boolean)[]>,
): Record<string, string | symbol | (string | symbol)[]> {
  const query: EntityFilterQuery = {};

  for (const [key, value] of Object.entries(schemaFilters)) {
    if (Array.isArray(value)) {
      query[key] = value.map(convertTrueToExists) as string[];
    } else {
      query[key] = convertTrueToExists(value) as string;
    }
  }

  return query;
}

/**
 * Builds an `EntityFilterQuery` based on the `uiSchema` passed in.
 * If `catalogFilter` is specified in the `uiSchema`, it is converted to a `EntityFilterQuery`.
 * If `allowedKinds` is specified in the `uiSchema` will support the legacy `allowedKinds` option.
 *
 * @param uiSchema The `uiSchema` of an `EntityPicker` component.
 * @returns An `EntityFilterQuery` based on the `uiSchema`, or `undefined` if `catalogFilter` is not specified in the `uiSchema`.
 */
function buildCatalogFilter(
  uiSchema: EntityPickerProps['uiSchema'],
): EntityFilterQuery | undefined {
  const allowedKinds = uiSchema['ui:options']?.allowedKinds;

  const catalogFilter: EntityPickerUiOptions['catalogFilter'] | undefined =
    uiSchema['ui:options']?.catalogFilter ||
    (allowedKinds && { kind: allowedKinds });

  if (!catalogFilter) {
    return undefined;
  }

  if (Array.isArray(catalogFilter)) {
    return catalogFilter.map(convertSchemaFiltersToQuery);
  }

  return convertSchemaFiltersToQuery(catalogFilter);
}
