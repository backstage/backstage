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
import { EntityDisplayName } from '@backstage/plugin-catalog-react';
import TextField from '@material-ui/core/TextField';
import Autocomplete, {
  AutocompleteChangeReason,
} from '@material-ui/lab/Autocomplete';
import {
  type Key,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
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
import { useEntityPickerOptions } from '../useEntityPickerOptions';
import { useEntityPickerPagination } from '../useEntityPickerPagination';

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
  const catalogFilter = useMemo(() => buildCatalogFilter(uiSchema), [uiSchema]);
  const defaultKind = uiSchema['ui:options']?.defaultKind;
  const defaultNamespace =
    uiSchema['ui:options']?.defaultNamespace || undefined;
  const autoSelect = uiSchema?.['ui:options']?.autoSelect ?? true;
  const isDisabled = uiSchema?.['ui:disabled'] ?? false;

  const allowArbitraryValues =
    uiSchema['ui:options']?.allowArbitraryValues ?? true;
  const selectedEntityRefs = useMemo(() => {
    if (!formData) {
      return [];
    }

    try {
      return [
        stringifyEntityRef(
          parseEntityRef(formData, { defaultKind, defaultNamespace }),
        ),
      ];
    } catch {
      return [];
    }
  }, [formData, defaultKind, defaultNamespace]);
  const normalizedFormData = selectedEntityRefs[0] ?? formData;
  const {
    entities,
    selectedEntities,
    entityRefToPresentation,
    loading,
    loadingState,
    setSearchText,
    loadMore,
    initialResultIsOnlyOption,
  } = useEntityPickerOptions({ catalogFilter, selectedEntityRefs });

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
      setSearchText('');
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
    [
      onChange,
      formData,
      defaultKind,
      defaultNamespace,
      allowArbitraryValues,
      setSearchText,
    ],
  );

  // Since free solo can be enabled, attempt to parse as a full entity ref first, then
  // fall back to the given value.
  const selectedEntity =
    entities.find(e => stringifyEntityRef(e) === normalizedFormData) ??
    selectedEntities.find(e => stringifyEntityRef(e) === normalizedFormData) ??
    (allowArbitraryValues && formData ? getLabel(formData) : '');
  const muiOptions = useMemo(() => {
    if (
      typeof selectedEntity !== 'string' &&
      selectedEntity &&
      !entities.includes(selectedEntity)
    ) {
      return [selectedEntity, ...entities];
    }
    return entities;
  }, [entities, selectedEntity]);

  // BUI: options for autocomplete
  const buiOptions = useMemo(() => {
    const options = muiOptions.map(entity => {
      const entityRef = stringifyEntityRef(entity);
      const presentation = entityRefToPresentation.get(entityRef);
      return {
        value: entityRef,
        label: presentation?.primaryTitle || entityRef,
      };
    });
    const selectedEntityRef = selectedEntityRefs[0];
    if (
      selectedEntityRef &&
      !options.some(option => option.value === selectedEntityRef)
    ) {
      options.unshift({
        value: selectedEntityRef,
        label:
          entityRefToPresentation.get(selectedEntityRef)?.primaryTitle ||
          formData ||
          selectedEntityRef,
      });
    }
    return options;
  }, [entityRefToPresentation, formData, muiOptions, selectedEntityRefs]);

  // Keep input independent of refreshed entity objects in the search results.
  const [inputValue, setInputValue] = useState(formData || '');
  const inputIsDirtyRef = useRef(false);
  const previousFormDataRef = useRef(formData);
  const selectedPresentationTitle = formData
    ? entityRefToPresentation.get(normalizedFormData)?.primaryTitle
    : undefined;
  const muiInputValue =
    typeof selectedEntity === 'string'
      ? selectedEntity
      : stringifyEntityRef(selectedEntity);
  const selectedInputValue =
    theme === 'bui'
      ? selectedPresentationTitle || formData || ''
      : muiInputValue;

  useEffect(() => {
    if (previousFormDataRef.current !== formData) {
      previousFormDataRef.current = formData;
      inputIsDirtyRef.current = false;
    }
    if (!inputIsDirtyRef.current) {
      setInputValue(selectedInputValue);
    }
  }, [formData, selectedInputValue]);

  const selectedKey =
    normalizedFormData && buiOptions.some(o => o.value === normalizedFormData)
      ? normalizedFormData
      : null;

  const lastCommittedRef = useRef(formData);

  useEffect(() => {
    lastCommittedRef.current = formData;
  }, [formData]);

  const handleSelectionChange = useCallback(
    (key: Key | null) => {
      inputIsDirtyRef.current = false;
      setSearchText('');
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
        if (lastCommittedRef.current !== entityRef) {
          lastCommittedRef.current = entityRef;
          onChange(entityRef);
        }
      } else {
        lastCommittedRef.current = undefined;
        onChange(undefined);
      }
    },
    [
      onChange,
      allowArbitraryValues,
      inputValue,
      defaultKind,
      defaultNamespace,
      setSearchText,
    ],
  );

  const handleBlur = useCallback(() => {
    if (allowArbitraryValues && inputIsDirtyRef.current && inputValue) {
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
        inputIsDirtyRef.current = false;
        setSearchText('');
        onChange(entityRef);
      }
    }
  }, [
    allowArbitraryValues,
    inputValue,
    defaultKind,
    defaultNamespace,
    onChange,
    setSearchText,
  ]);

  // Auto-select when only one entity and required
  useEffect(() => {
    if (theme === 'bui') {
      if (
        required &&
        !allowArbitraryValues &&
        initialResultIsOnlyOption &&
        !formData
      ) {
        onChange(stringifyEntityRef(entities[0]));
      }
    } else {
      if (
        required &&
        !allowArbitraryValues &&
        initialResultIsOnlyOption &&
        selectedEntity === ''
      ) {
        onChange(stringifyEntityRef(entities[0]));
      }
    }
  }, [
    entities,
    initialResultIsOnlyOption,
    onChange,
    selectedEntity,
    formData,
    required,
    allowArbitraryValues,
    theme,
  ]);

  const pagination = useEntityPickerPagination({
    entities,
    selectedEntityRefs,
    loading,
    loadMore,
  });

  if (theme === 'bui') {
    const isAutoSelected =
      required && !allowArbitraryValues && initialResultIsOnlyOption;

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
          onSelectionChange={handleSelectionChange}
          onBlur={handleBlur}
          options={buiOptions}
          search={{
            mode: 'server',
            inputValue,
            onInputChange: value => {
              inputIsDirtyRef.current = true;
              setInputValue(value);
              setSearchText(value);
            },
          }}
          loading={{ state: loadingState, onLoadMore: loadMore }}
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
          (required && !allowArbitraryValues && initialResultIsOnlyOption)
        }
        id={idSchema?.$id}
        value={selectedEntity}
        inputValue={inputValue}
        loading={loading}
        onChange={onSelect}
        options={muiOptions}
        onInputChange={(event, value, reason) => {
          // MUI resets the input when the selected entity object is refreshed.
          // Only user actions or a changed form value should replace an edit.
          if (reason === 'reset' && !event && inputIsDirtyRef.current) return;
          inputIsDirtyRef.current = reason === 'input';
          setInputValue(value);
          if (reason === 'input' || reason === 'clear') {
            setSearchText(value);
          }
        }}
        getOptionLabel={option =>
          // option can be a string due to freeSolo.
          typeof option === 'string'
            ? option
            : entityRefToPresentation.get(stringifyEntityRef(option))
                ?.entityRef!
        }
        getOptionSelected={(option, value) =>
          typeof value !== 'string' &&
          stringifyEntityRef(option) === stringifyEntityRef(value)
        }
        filterSelectedOptions
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
        filterOptions={options => options}
        ListboxComponent={VirtualizedListbox}
        {...pagination}
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
