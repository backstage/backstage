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
  EntityDisplayName,
  EntityRefPresentationSnapshot,
  catalogApiRef,
  entityPresentationApiRef,
} from '@backstage/plugin-catalog-react';
import TextField from '@material-ui/core/TextField';
import Autocomplete, {
  AutocompleteChangeReason,
  createFilterOptions,
} from '@material-ui/lab/Autocomplete';
import {
  type Key,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import useAsync from 'react-use/esm/useAsync';
import {
  EntityPickerFilterQueryValue,
  EntityPickerProps,
  EntityPickerUiOptions,
  EntityPickerFilterQuery,
} from './schema';
import { VirtualizedListbox } from '../VirtualizedListbox';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { scaffolderTranslationRef } from '../../../translation';
import {
  ScaffolderField,
  useScaffolderTheme,
} from '@backstage/plugin-scaffolder-react/alpha';
import { Autocomplete as BuiAutocomplete } from '../Autocomplete';

export { EntityPickerSchema } from './schema';

/**
 * The underlying component that is rendered in the form for the `EntityPicker`
 * field extension.
 *
 * @public
 */
export const EntityPicker = (props: EntityPickerProps) => {
  const theme = useScaffolderTheme();
  const { t } = useTranslationRef(scaffolderTranslationRef);
  const {
    onChange,
    schema: {
      title = t('fields.entityPicker.title'),
      description = t('fields.entityPicker.description'),
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
  const autoSelect = uiSchema?.['ui:options']?.autoSelect ?? true;
  const isDisabled = uiSchema?.['ui:disabled'] ?? false;

  const catalogApi = useApi(catalogApiRef);
  const entityPresentationApi = useApi(entityPresentationApiRef);

  const { value: entities, loading } = useAsync(async () => {
    const fields = [
      'kind',
      'metadata.name',
      'metadata.namespace',
      'metadata.title',
      'metadata.description',
      'spec.profile.displayName',
      'spec.type',
    ];
    const { items } = await catalogApi.getEntities(
      catalogFilter
        ? { filter: catalogFilter, fields }
        : { filter: undefined, fields },
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

    return { catalogEntities: items, entityRefToPresentation };
  });

  const allowArbitraryValues =
    uiSchema['ui:options']?.allowArbitraryValues ?? true;

  const getLabel = useCallback(
    (freeSoloValue: string) => {
      try {
        // Will throw if defaultKind or defaultNamespace are not set
        const parsedRef = parseEntityRef(freeSoloValue, {
          defaultKind,
          defaultNamespace,
        });

        return stringifyEntityRef(parsedRef);
      } catch (err) {
        return freeSoloValue;
      }
    },
    [defaultKind, defaultNamespace],
  );

  const onSelect = useCallback(
    (_: any, ref: string | Entity | null, reason: AutocompleteChangeReason) => {
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

  // Since free solo can be enabled, attempt to parse as a full entity ref first, then
  // fall back to the given value.
  const selectedEntity =
    entities?.catalogEntities.find(e => stringifyEntityRef(e) === formData) ??
    (allowArbitraryValues && formData ? getLabel(formData) : '');

  // BUI: options for autocomplete
  const buiOptions = useMemo(
    () =>
      (entities?.catalogEntities || []).map(entity => {
        const entityRef = stringifyEntityRef(entity);
        const presentation = entities?.entityRefToPresentation.get(entityRef);
        return {
          value: entityRef,
          label: presentation?.primaryTitle || entityRef,
        };
      }),
    [entities],
  );

  // BUI: controlled input value
  const [inputValue, setInputValue] = useState(formData || '');

  useEffect(() => {
    if (formData) {
      const opt = buiOptions.find(o => o.value === formData);
      setInputValue(opt?.label || formData);
    } else {
      setInputValue('');
    }
  }, [formData, buiOptions]);

  const selectedKey =
    formData && buiOptions.some(o => o.value === formData) ? formData : null;

  const lastCommittedRef = useRef(formData);

  useEffect(() => {
    lastCommittedRef.current = formData;
  }, [formData]);

  const handleSelectionChange = useCallback(
    (key: Key | null) => {
      if (key !== null) {
        const value = String(key);
        lastCommittedRef.current = value;
        onChange(value);
      } else if (allowArbitraryValues && inputValue) {
        let entityRef = inputValue;
        try {
          entityRef = stringifyEntityRef(
            parseEntityRef(inputValue, { defaultKind, defaultNamespace }),
          );
        } catch {
          // If the input isn't a valid entity ref, use it as-is
        }
        lastCommittedRef.current = entityRef;
        onChange(entityRef);
      } else {
        lastCommittedRef.current = undefined;
        onChange(undefined);
      }
    },
    [onChange, allowArbitraryValues, inputValue, defaultKind, defaultNamespace],
  );

  const handleBlur = useCallback(() => {
    if (allowArbitraryValues && inputValue) {
      let entityRef = inputValue;
      try {
        entityRef = stringifyEntityRef(
          parseEntityRef(inputValue, { defaultKind, defaultNamespace }),
        );
      } catch {
        // If the input isn't a valid entity ref, use it as-is
      }
      if (lastCommittedRef.current !== entityRef) {
        lastCommittedRef.current = entityRef;
        onChange(entityRef);
      }
    }
  }, [
    allowArbitraryValues,
    inputValue,
    defaultKind,
    defaultNamespace,
    onChange,
  ]);

  // Auto-select when only one entity and required
  useEffect(() => {
    if (theme === 'bui') {
      if (
        required &&
        !allowArbitraryValues &&
        entities?.catalogEntities.length === 1 &&
        !formData
      ) {
        onChange(stringifyEntityRef(entities.catalogEntities[0]));
      }
    } else {
      if (
        required &&
        !allowArbitraryValues &&
        entities?.catalogEntities.length === 1 &&
        selectedEntity === ''
      ) {
        onChange(stringifyEntityRef(entities.catalogEntities[0]));
      }
    }
  }, [
    entities,
    onChange,
    selectedEntity,
    formData,
    required,
    allowArbitraryValues,
    theme,
  ]);

  if (theme === 'bui') {
    const isAutoSelected =
      required &&
      !allowArbitraryValues &&
      entities?.catalogEntities.length === 1;

    return (
      <ScaffolderField
        rawErrors={rawErrors}
        rawDescription={uiSchema['ui:description'] ?? description}
        required={required}
        disabled={isDisabled}
        errors={errors}
      >
        <BuiAutocomplete
          id={idSchema?.$id}
          label={title}
          isRequired={required}
          isDisabled={isDisabled || isAutoSelected}
          selectedKey={selectedKey}
          inputValue={inputValue}
          onInputChange={setInputValue}
          onSelectionChange={handleSelectionChange}
          onBlur={handleBlur}
          isLoading={loading}
          options={buiOptions}
          allowsCustomValue={allowArbitraryValues}
          isInvalid={rawErrors && rawErrors.length > 0}
        />
      </ScaffolderField>
    );
  }

  return (
    <ScaffolderField
      rawErrors={rawErrors}
      rawDescription={uiSchema['ui:description'] ?? description}
      required={required}
      disabled={isDisabled}
      errors={errors}
    >
      <Autocomplete
        disabled={
          isDisabled ||
          (required &&
            !allowArbitraryValues &&
            entities?.catalogEntities.length === 1)
        }
        id={idSchema?.$id}
        value={selectedEntity}
        loading={loading}
        onChange={onSelect}
        options={entities?.catalogEntities || []}
        getOptionLabel={option =>
          // option can be a string due to freeSolo.
          typeof option === 'string'
            ? option
            : entities?.entityRefToPresentation.get(stringifyEntityRef(option))
                ?.entityRef!
        }
        autoSelect={autoSelect}
        freeSolo={allowArbitraryValues}
        renderInput={params => (
          <TextField
            {...params}
            label={title}
            margin="dense"
            variant="outlined"
            required={required}
            disabled={isDisabled}
            InputProps={params.InputProps}
          />
        )}
        renderOption={option => <EntityDisplayName entityRef={option} />}
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
