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
  entityPresentationApiRef,
  EntityDisplayName,
  EntityRefPresentationSnapshot,
} from '@backstage/plugin-catalog-react';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Autocomplete, {
  AutocompleteChangeReason,
} from '@material-ui/lab/Autocomplete';
import React, { useCallback, useEffect, useState } from 'react';
import useAsync from 'react-use/esm/useAsync';
import { FieldValidation } from '@rjsf/utils';
import {
  MultiEntityPickerFilterQueryValue,
  MultiEntityPickerProps,
  MultiEntityPickerUiOptions,
  MultiEntityPickerFilterQuery,
} from './schema';
import { VirtualizedListbox } from '../VirtualizedListbox';

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
  const isDisabled = uiSchema?.['ui:disabled'] ?? false;
  const [noOfItemsSelected, setNoOfItemsSelected] = useState(0);

  const catalogApi = useApi(catalogApiRef);
  const entityPresentationApi = useApi(entityPresentationApiRef);
  const { value: entities, loading } = useAsync(async () => {
    const { items } = await catalogApi.getEntities(
      catalogFilter ? { filter: catalogFilter } : undefined,
    );
    const entityRefToPresentation = new Map<
      string,
      EntityRefPresentationSnapshot
    >(
      await Promise.all(
        items.map(async item => {
          const presentation = await entityPresentationApi.forEntity(item)
            .promise;
          return [stringifyEntityRef(item), presentation] as [
            string,
            EntityRefPresentationSnapshot,
          ];
        }),
      ),
    );
    return { entities: items, entityRefToPresentation };
  });
  const allowArbitraryValues =
    uiSchema['ui:options']?.allowArbitraryValues ?? true;

  // if not specified, maxItems defaults to undefined
  const maxItems = props.schema.maxItems;

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
            if (formData?.includes(ref) || allowArbitraryValues) {
              return entityRef;
            }
          }

          return undefined;
        })
        .filter(ref => ref !== undefined) as string[];

      setNoOfItemsSelected(values.length);
      onChange(values);
    },
    [onChange, formData, defaultKind, defaultNamespace, allowArbitraryValues],
  );

  useEffect(() => {
    if (required && !allowArbitraryValues && entities?.entities?.length === 1) {
      onChange([stringifyEntityRef(entities?.entities[0])]);
    }
  }, [entities, onChange, required, allowArbitraryValues]);

  return (
    <FormControl
      margin="normal"
      required={required}
      error={rawErrors?.length > 0 && !formData}
    >
      <Autocomplete
        multiple
        filterSelectedOptions
        disabled={
          isDisabled ||
          (required &&
            !allowArbitraryValues &&
            entities?.entities?.length === 1)
        }
        id={idSchema?.$id}
        defaultValue={formData}
        loading={loading}
        onChange={onSelect}
        options={entities?.entities || []}
        renderOption={option => <EntityDisplayName entityRef={option} />}
        getOptionLabel={option =>
          // option can be a string due to freeSolo.
          typeof option === 'string'
            ? option
            : entities?.entityRefToPresentation.get(stringifyEntityRef(option))
                ?.entityRef!
        }
        getOptionDisabled={_options =>
          maxItems ? noOfItemsSelected >= maxItems : false
        }
        autoSelect
        freeSolo={allowArbitraryValues}
        renderInput={params => (
          <TextField
            {...params}
            label={title}
            disabled={isDisabled}
            margin="dense"
            helperText={description}
            FormHelperTextProps={{
              margin: 'dense',
              style: { marginLeft: 0 },
            }}
            variant="outlined"
            required={required}
            InputProps={{
              ...params.InputProps,
              required: formData?.length === 0 && required,
            }}
          />
        )}
        ListboxComponent={VirtualizedListbox}
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
