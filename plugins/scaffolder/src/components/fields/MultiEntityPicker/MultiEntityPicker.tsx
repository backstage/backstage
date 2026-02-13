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
  CATALOG_FILTER_CURRENT_USER_REF,
  CATALOG_FILTER_CURRENT_USER_OWNERSHIP_REFS,
  CATALOG_FILTER_EXISTS,
} from '@backstage/catalog-client';
import {
  Entity,
  parseEntityRef,
  RELATION_OWNED_BY,
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
import Autocomplete, {
  AutocompleteChangeReason,
  createFilterOptions,
} from '@material-ui/lab/Autocomplete';
import { useCallback, useEffect, useState } from 'react';
import useAsync from 'react-use/esm/useAsync';
import { FieldValidation } from '@rjsf/utils';
import {
  MultiEntityPickerFilterQueryValue,
  MultiEntityPickerProps,
  MultiEntityPickerUiOptions,
  MultiEntityPickerFilterQuery,
} from './schema';
import { VirtualizedListbox } from '../VirtualizedListbox';
import { ScaffolderField } from '@backstage/plugin-scaffolder-react/alpha';
import { useTranslationRef } from '@backstage/frontend-plugin-api';
import { scaffolderTranslationRef } from '../../../translation';

export { MultiEntityPickerSchema } from './schema';

// AutocompleteChangeReason events that can be triggered when a user inputs a freeSolo option
const FREE_SOLO_EVENTS: readonly AutocompleteChangeReason[] = [
  'blur',
  'create-option',
];

/**
 * The underlying component that is rendered in the form for the `MultiEntityPicker`
 * field extension.
 */
export const MultiEntityPicker = (props: MultiEntityPickerProps) => {
  const { t } = useTranslationRef(scaffolderTranslationRef);
  const {
    onChange,
    schema: {
      title = t('fields.multiEntityPicker.title'),
      description = t('fields.multiEntityPicker.description'),
    },
    required,
    uiSchema,
    rawErrors,
    formData,
    idSchema,
    errors,
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
    const filter = catalogFilter ?? undefined;
    const { items } = await catalogApi.getEntities(
      filter !== undefined ? { filter } : undefined,
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
          // If the ref is not a string, then it was a selected option in the picker
          if (typeof ref !== 'string') {
            // if ref does not exist: pass 'undefined' to trigger validation for required value
            return ref ? stringifyEntityRef(ref as Entity) : undefined;
          }

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
          if (
            // If value already matches what exists in form data, allow it
            formData?.includes(ref) ||
            // If arbitrary values are allowed and the reason is a free solo event, allow it
            (allowArbitraryValues && FREE_SOLO_EVENTS.includes(reason))
          ) {
            return entityRef;
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
    <ScaffolderField
      rawErrors={rawErrors}
      rawDescription={uiSchema['ui:description'] ?? description}
      required={required}
      disabled={isDisabled}
      errors={errors}
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
        filterOptions={createFilterOptions<Entity>({
          stringify: option =>
            entities?.entityRefToPresentation.get(stringifyEntityRef(option))
              ?.primaryTitle!,
        })}
        ListboxComponent={VirtualizedListbox}
      />
    </ScaffolderField>
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

const OWNED_BY_KEY = `relations.${RELATION_OWNED_BY}`;

/**
 * Converts a special `{exists: true}` value to the `CATALOG_FILTER_EXISTS` symbol.
 *
 * For `{ currentUser: true }`, the key decides which constant is used: `relations.ownedBy` → ownership refs, anything else → single ref.
 * @param key - The filter key used to determine which current user constant to apply.
 * @param value - The value to convert.
 * @returns The converted value.
 */
function convertOpsValues(
  key: string,
  value: Exclude<MultiEntityPickerFilterQueryValue, Array<any>>,
): string | symbol {
  if (typeof value === 'object' && value !== null) {
    if ('exists' in value && value.exists) {
      return CATALOG_FILTER_EXISTS;
    }
    if ('currentUser' in value && value.currentUser) {
      return key === OWNED_BY_KEY
        ? CATALOG_FILTER_CURRENT_USER_OWNERSHIP_REFS
        : CATALOG_FILTER_CURRENT_USER_REF;
    }
  }
  return value?.toString();
}

/**
 * Converts schema filters to entity filter query, replacing `{exists:true}` values
 * with the constant `CATALOG_FILTER_EXISTS`.
 * For `{ currentUser: true }`, the key decides which constant is used: `relations.ownedBy` → ownership refs, anything else → single ref.
 *
 * @param schemaFilters - An object containing schema filters with keys as filter names
 * and values as filter values.
 * @returns An object with the same keys as the input object, with special values transformed.
 */
function convertSchemaFiltersToQuery(
  schemaFilters: MultiEntityPickerFilterQuery,
): Exclude<EntityFilterQuery, Array<any>> {
  const query: EntityFilterQuery = {};

  for (const [key, value] of Object.entries(schemaFilters)) {
    if (Array.isArray(value)) {
      query[key] = value;
    } else {
      query[key] = convertOpsValues(key, value);
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
