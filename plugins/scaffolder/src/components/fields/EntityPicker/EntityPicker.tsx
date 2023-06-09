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
import { TextField } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import Autocomplete, {
  AutocompleteChangeReason,
} from '@material-ui/lab/Autocomplete';
import React, { useCallback, useEffect, useMemo } from 'react';
import useAsync from 'react-use/lib/useAsync';
import {
  EntityPickerFilterQuery,
  EntityPickerFilterQueryValue,
  EntityPickerProps,
  EntityPickerUiOptions,
} from './schema';

export { EntityPickerSchema } from './schema';

/**
 * @param string the string to interpolate
 * @param params values to used as replacements
 */
const interpolate = (string: string, params: object): string => {
  return string.replace(/\$\{\{([^}]+)}}/g, (_, param) => {
    let obj: unknown = params;
    for (let i = 0, path = param.split('.'), len = path.length; i < len; i++) {
      if (typeof obj !== 'object' || obj === null) {
        return '';
      }
      obj = (obj as Record<string, unknown>)[path[i]];
    }
    return typeof obj === 'string' ? obj : '';
  });
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
  const catalogFilter = useMemo(() => buildCatalogFilter(uiSchema), [uiSchema]);
  const uiOptions = uiSchema['ui:options'];
  const defaultKind = uiOptions?.defaultKind;
  const defaultNamespace = uiOptions?.defaultNamespace || undefined;

  const catalogApi = useApi(catalogApiRef);

  const allowArbitraryValues = uiOptions?.allowArbitraryValues ?? true;
  const nameTemplate = allowArbitraryValues
    ? undefined
    : uiOptions?.nameTemplate;

  const getLabel = useCallback(
    (refOrEntity: string | Entity) => {
      if (typeof refOrEntity !== 'string') {
        return nameTemplate
          ? interpolate(nameTemplate, { entity: refOrEntity })
          : humanizeEntityRef(refOrEntity, { defaultKind, defaultNamespace });
      }
      try {
        return humanizeEntityRef(
          parseEntityRef(refOrEntity, { defaultKind, defaultNamespace }),
          {
            defaultKind,
            defaultNamespace,
          },
        );
      } catch (err) {
        return refOrEntity;
      }
    },
    [nameTemplate, defaultKind, defaultNamespace],
  );

  const { value: entities, loading } = useAsync(async () => {
    const { items } = await catalogApi.getEntities(
      catalogFilter ? { filter: catalogFilter } : undefined,
    );
    return items?.sort((a, b) => getLabel(a).localeCompare(getLabel(b)));
  }, [catalogApi, catalogFilter, getLabel]);

  const onSelect = useCallback(
    (_, ref: string | Entity | null, reason: AutocompleteChangeReason) => {
      // ref can either be a string from free solo entry or
      if (typeof ref !== 'string') {
        // if ref does not exist: pass 'undefined' to trigger validation for required value
        onChange(ref ? stringifyEntityRef(ref as Entity) : undefined);
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
  // Since free solo can be enabled, attempt to parse as a full entity ref first, then fall
  //  back to the given value.
  let value: Entity | string | null | undefined = entities?.find(
    e => stringifyEntityRef(e) === formData,
  );
  if (value === undefined) {
    if (allowArbitraryValues) {
      value = formData ? getLabel(formData) : '';
    } else {
      value = null;
    }
  }
  return (
    <FormControl
      margin="normal"
      required={required}
      error={rawErrors?.length > 0 && !formData}
    >
      <Autocomplete
        disabled={entities?.length === 1}
        id={idSchema?.$id}
        value={value}
        loading={loading}
        onChange={onSelect}
        options={entities || []}
        getOptionLabel={option =>
          // option can be a string due to freeSolo.
          typeof option === 'string' ? option : getLabel(option)
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
