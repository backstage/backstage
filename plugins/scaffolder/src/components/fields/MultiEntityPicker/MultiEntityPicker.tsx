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
import { FieldValidation } from '@rjsf/utils';
import {
  MultiEntityPickerFilterQueryValue,
  MultiEntityPickerProps,
  MultiEntityPickerUiOptions,
  MultiEntityPickerFilterQuery,
} from './schema';

export { MultiEntityPickerSchema } from './schema';

/**
 * The underlying component that is rendered in the form for the `MultiEntityPicker`
 * field extension.
 */
export const MultiEntityPicker = (props: MultiEntityPickerProps) => {
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
    (_: any, refs: (string | Entity)[], reason: AutocompleteChangeReason) => {
      const values = refs
        .map(ref => {
          if (typeof ref !== 'string') {
            // if ref does not exist: pass 'undefined' to trigger validation for required value
            return ref ? stringifyEntityRef(ref as Entity) : undefined;
          }
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
            if (formData.includes(ref) || allowArbitraryValues) {
              return entityRef;
            }
          }

          return undefined;
        })
        .filter(ref => ref !== undefined) as string[];

      onChange(values);
    },
    [onChange, formData, defaultKind, defaultNamespace, allowArbitraryValues],
  );

  useEffect(() => {
    if (entities?.length === 1) {
      onChange([stringifyEntityRef(entities[0])]);
    }
  }, [entities, onChange]);

  return (
    <FormControl
      margin="normal"
      required={required}
      error={rawErrors?.length > 0 && !formData}
    >
      <Autocomplete
        multiple
        filterSelectedOptions
        disabled={entities?.length === 1}
        id={idSchema?.$id}
        value={
          // Since free solo can be enabled, attempt to parse as a full entity ref first, then fall
          //  back to the given value.
          entities?.filter(
            e => formData && formData.includes(stringifyEntityRef(e)),
          ) ?? (allowArbitraryValues && formData ? formData.map(getLabel) : [])
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

export const validateMultiEntityPickerValidation = (
  values: string[],
  validation: FieldValidation,
) => {
  values.forEach(value => {
    try {
      parseEntityRef(value);
    } catch {
      validation.addError(`${value} is not a valid entity ref`);
    }
  });
};

/**
 * Converts a special `{exists: true}` value to the `CATALOG_FILTER_EXISTS` symbol.
 *
 * @param value - The value to convert.
 * @returns The converted value.
 */
function convertOpsValues(
  value: Exclude<MultiEntityPickerFilterQueryValue, Array<any>>,
): string | symbol {
  if (typeof value === 'object' && value.exists) {
    return CATALOG_FILTER_EXISTS;
  }
  return value?.toString();
}

/**
 * Converts schema filters to entity filter query, replacing `{exists:true}` values
 * with the constant `CATALOG_FILTER_EXISTS`.
 *
 * @param schemaFilters - An object containing schema filters with keys as filter names
 * and values as filter values.
 * @returns An object with the same keys as the input object, but with `{exists:true}` values
 * transformed to `CATALOG_FILTER_EXISTS` symbol.
 */
function convertSchemaFiltersToQuery(
  schemaFilters: MultiEntityPickerFilterQuery,
): Exclude<EntityFilterQuery, Array<any>> {
  const query: EntityFilterQuery = {};

  for (const [key, value] of Object.entries(schemaFilters)) {
    if (Array.isArray(value)) {
      query[key] = value;
    } else {
      query[key] = convertOpsValues(value);
    }
  }

  return query;
}

/**
 * Builds an `EntityFilterQuery` based on the `uiSchema` passed in.
 * If `catalogFilter` is specified in the `uiSchema`, it is converted to a `EntityFilterQuery`.
 *
 * @param uiSchema The `uiSchema` of an `EntityPicker` component.
 * @returns An `EntityFilterQuery` based on the `uiSchema`, or `undefined` if `catalogFilter` is not specified in the `uiSchema`.
 */
function buildCatalogFilter(
  uiSchema: MultiEntityPickerProps['uiSchema'],
): EntityFilterQuery | undefined {
  const catalogFilter: MultiEntityPickerUiOptions['catalogFilter'] | undefined =
    uiSchema['ui:options']?.catalogFilter;

  if (!catalogFilter) {
    return undefined;
  }

  if (Array.isArray(catalogFilter)) {
    return catalogFilter.map(convertSchemaFiltersToQuery);
  }

  return convertSchemaFiltersToQuery(catalogFilter);
}
