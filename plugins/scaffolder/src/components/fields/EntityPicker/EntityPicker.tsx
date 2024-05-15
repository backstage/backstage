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
  CATALOG_FILTER_EXISTS,
  type EntityFilterQuery,
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
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Autocomplete, {
  AutocompleteChangeReason,
} from '@material-ui/lab/Autocomplete';
import React, { useCallback, useEffect } from 'react';
import useAsync from 'react-use/esm/useAsync';
import {
  EntityPickerFilterQuery,
  EntityPickerFilterQueryValue,
  EntityPickerProps,
  EntityPickerUiOptions,
} from './schema';
import lodash from 'lodash';

export { EntityPickerSchema } from './schema';

const getOptionLabelFields = (optionLabelSchema?: string): string[] => {
  if (!optionLabelSchema) {
    return [];
  }
  const matches = optionLabelSchema.match(/@{{([^}]+)}}/g);
  if (!matches) {
    return [];
  }
  return matches.map(res =>
    res
      .trim()
      .replace(/@{{|}}/g, '')
      .trim(),
  );
};

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
  const defaultNamespace =
    uiSchema['ui:options']?.defaultNamespace || undefined;
  const allowArbitraryValues =
    uiSchema['ui:options']?.allowArbitraryValues ?? true;
  const optionLabelSchema =
    allowArbitraryValues !== true
      ? uiSchema['ui:options']?.optionLabelSchema
      : undefined;
  const additionalFields = getOptionLabelFields(optionLabelSchema);

  const catalogApi = useApi(catalogApiRef);

  const { value: entities, loading } = useAsync(async () => {
    const fields = [
      ...new Set([
        'metadata.name',
        'metadata.namespace',
        'kind',
        ...additionalFields,
      ]),
    ];
    const { items } = await catalogApi.getEntities(
      catalogFilter
        ? { filter: catalogFilter, fields }
        : { filter: undefined, fields },
    );
    return items;
  });

  const getOptionLabel = (option: Entity | string) => {
    if (typeof option === 'string') {
      try {
        return humanizeEntityRef(
          parseEntityRef(option, { defaultKind, defaultNamespace }),
          {
            defaultKind,
            defaultNamespace,
          },
        );
      } catch (err) {
        return option;
      }
    }

    if (optionLabelSchema && additionalFields.length > 0) {
      let out = optionLabelSchema;
      for (const field of additionalFields) {
        out = out.replace(`@{{${field}}}`, lodash.get(option, field));
      }
      return out;
    }

    return humanizeEntityRef(option, { defaultKind, defaultNamespace })!;
  };

  const onSelect = useCallback(
    (_: any, ref: string | Entity | null, reason: AutocompleteChangeReason) => {
      // ref can either be a string from free solo entry or
      if (typeof ref !== 'string') {
        // if ref does not exist: pass 'undefined' to trigger validation for required value
        onChange(ref ? stringifyEntityRef(ref as Entity) : undefined);
      } else if (!optionLabelSchema) {
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
    [
      onChange,
      formData,
      defaultKind,
      defaultNamespace,
      allowArbitraryValues,
      optionLabelSchema,
    ],
  );

  // Since free solo can be enabled, attempt to parse as a full entity ref first, then fall
  // back to the given value.
  const selectedEntity =
    entities?.find(e => stringifyEntityRef(e) === formData) ??
    (allowArbitraryValues && formData ? getOptionLabel(formData) : '');

  useEffect(() => {
    if (entities?.length === 1 && selectedEntity === '') {
      onChange(stringifyEntityRef(entities[0]));
    }
  }, [entities, onChange, selectedEntity]);

  return (
    <FormControl
      margin="normal"
      required={required}
      error={rawErrors?.length > 0 && !formData}
    >
      <Autocomplete
        disabled={entities?.length === 1}
        id={idSchema?.$id}
        value={selectedEntity}
        loading={loading}
        onChange={onSelect}
        options={entities || []}
        getOptionLabel={getOptionLabel}
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

/**
 * Converts a especial `{exists: true}` value to the `CATALOG_FILTER_EXISTS` symbol.
 *
 * @param value - The value to convert.
 * @returns The converted value.
 */
function convertOpsValues(
  value: Exclude<EntityPickerFilterQueryValue, Array<any>>,
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
  schemaFilters: EntityPickerFilterQuery,
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
