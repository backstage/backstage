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
import { type Key, useCallback, useEffect, useMemo, useState } from 'react';
import { FieldValidation } from '@rjsf/utils';
import {
  MultiEntityPickerFilterQueryValue,
  MultiEntityPickerProps,
  MultiEntityPickerUiOptions,
  MultiEntityPickerFilterQuery,
} from './schema';
import { VirtualizedListbox } from '../VirtualizedListbox';
import {
  ScaffolderField,
  useScaffolderTheme,
} from '@backstage/plugin-scaffolder-react/alpha';
import { useTranslationRef } from '@backstage/frontend-plugin-api';
import { scaffolderTranslationRef } from '../../../translation';
import { Autocomplete as BuiAutocomplete } from '../Autocomplete';
import { chipStyle, chipRemoveStyle } from '../buiChipStyles';
import { useEntityPickerOptions } from '../useEntityPickerOptions';
import { useEntityPickerPagination } from '../useEntityPickerPagination';

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
  const theme = useScaffolderTheme();
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

  const catalogFilter = useMemo(() => buildCatalogFilter(uiSchema), [uiSchema]);
  const defaultKind = uiSchema['ui:options']?.defaultKind;
  const defaultNamespace =
    uiSchema['ui:options']?.defaultNamespace || undefined;
  const isDisabled = uiSchema?.['ui:disabled'] ?? false;
  const allowArbitraryValues =
    uiSchema['ui:options']?.allowArbitraryValues ?? true;
  const maxItems = props.schema.maxItems;

  const [noOfItemsSelected, setNoOfItemsSelected] = useState(0);

  const selectedValues = useMemo(() => formData || [], [formData]);
  const selectedValueToEntityRef = useMemo(
    () =>
      new Map(
        selectedValues.flatMap(value => {
          try {
            return [
              [
                value,
                stringifyEntityRef(
                  parseEntityRef(value, { defaultKind, defaultNamespace }),
                ),
              ] as const,
            ];
          } catch {
            return [];
          }
        }),
      ),
    [selectedValues, defaultKind, defaultNamespace],
  );
  const selectedEntityRefs = useMemo(
    () => Array.from(new Set(selectedValueToEntityRef.values())),
    [selectedValueToEntityRef],
  );
  const {
    entities,
    selectedEntities,
    entityRefToPresentation,
    loading,
    loadingState,
    setSearchText,
    loadMore,
    initialResultIsOnlyOption,
  } = useEntityPickerOptions({
    catalogFilter,
    selectedEntityRefs,
  });

  const onSelect = useCallback(
    (_: any, refs: (string | Entity)[], reason: AutocompleteChangeReason) => {
      const values = Array.from(
        new Set(
          refs
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
            .filter(ref => ref !== undefined) as string[],
        ),
      );

      setNoOfItemsSelected(values.length);
      setSearchText('');
      onChange(values);
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

  // BUI: options and selection state
  const allOptions = useMemo(
    () =>
      entities.map(entity => {
        const entityRef = stringifyEntityRef(entity);
        const presentation = entityRefToPresentation.get(entityRef);
        return {
          value: entityRef,
          label: presentation?.primaryTitle || entityRef,
        };
      }),
    [entities, entityRefToPresentation],
  );

  const availableOptions = useMemo(
    () => allOptions.filter(o => !selectedEntityRefs.includes(o.value)),
    [allOptions, selectedEntityRefs],
  );

  const muiOptions = useMemo(() => {
    const entityRefs = new Set(entities.map(stringifyEntityRef));
    return [
      ...selectedEntities.filter(
        entity => !entityRefs.has(stringifyEntityRef(entity)),
      ),
      ...entities,
    ];
  }, [entities, selectedEntities]);

  const [inputValue, setInputValue] = useState('');

  const atMaxItems =
    maxItems !== undefined && selectedValues.length >= maxItems;

  const handleSelectionChange = useCallback(
    (key: Key | null) => {
      if (atMaxItems) return;

      if (key !== null) {
        const newValue = String(key);
        if (!selectedEntityRefs.includes(newValue)) {
          onChange([...selectedValues, newValue]);
        }
      } else if (allowArbitraryValues && inputValue) {
        let entityRef = inputValue;
        try {
          entityRef = stringifyEntityRef(
            parseEntityRef(inputValue, { defaultKind, defaultNamespace }),
          );
        } catch {
          // If the input isn't a valid entity ref, use it as-is
        }
        if (
          !selectedValues.includes(entityRef) &&
          !selectedEntityRefs.includes(entityRef)
        ) {
          onChange([...selectedValues, entityRef]);
        }
      }
      setInputValue('');
      setSearchText('');
    },
    [
      atMaxItems,
      selectedEntityRefs,
      selectedValues,
      onChange,
      allowArbitraryValues,
      inputValue,
      defaultKind,
      defaultNamespace,
      setSearchText,
    ],
  );

  const handleRemove = useCallback(
    (value: string) => {
      onChange(selectedValues.filter(v => v !== value));
    },
    [selectedValues, onChange],
  );

  useEffect(() => {
    if (required && !allowArbitraryValues && initialResultIsOnlyOption) {
      onChange([stringifyEntityRef(entities[0])]);
    }
  }, [
    allowArbitraryValues,
    entities,
    initialResultIsOnlyOption,
    onChange,
    required,
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
        <div>
          {selectedValues.length > 0 && (
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 'var(--bui-space-1)',
                marginBottom: 'var(--bui-space-2)',
              }}
            >
              {selectedValues.map(value => {
                const entityRef = selectedValueToEntityRef.get(value) ?? value;
                const label =
                  allOptions.find(o => o.value === entityRef)?.label ||
                  entityRefToPresentation.get(entityRef)?.primaryTitle ||
                  value;
                return (
                  <span key={value} style={chipStyle}>
                    {label}
                    {!isDisabled && !isAutoSelected && (
                      <button
                        type="button"
                        onClick={() => handleRemove(value)}
                        style={chipRemoveStyle}
                        aria-label={`Remove ${label}`}
                      >
                        &times;
                      </button>
                    )}
                  </span>
                );
              })}
            </div>
          )}
          <BuiAutocomplete
            id={idSchema?.$id}
            label={title}
            isRequired={required}
            isDisabled={isDisabled || isAutoSelected || atMaxItems}
            selectedKey={null}
            onSelectionChange={handleSelectionChange}
            options={availableOptions}
            search={{
              mode: 'server',
              inputValue,
              onInputChange: value => {
                setInputValue(value);
                setSearchText(value);
              },
            }}
            loading={{ state: loadingState, onLoadMore: loadMore }}
            allowsCustomValue={allowArbitraryValues}
            isInvalid={rawErrors && rawErrors.length > 0}
          />
        </div>
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
        multiple
        filterSelectedOptions
        disabled={
          isDisabled ||
          (required && !allowArbitraryValues && initialResultIsOnlyOption)
        }
        id={idSchema?.$id}
        defaultValue={formData}
        loading={loading}
        onChange={onSelect}
        options={muiOptions}
        onInputChange={(_event, value, reason) => {
          if (reason === 'input' || reason === 'clear') {
            setSearchText(value);
          }
        }}
        renderOption={option => <EntityDisplayName entityRef={option} />}
        getOptionLabel={option =>
          // option can be a string due to freeSolo.
          typeof option === 'string'
            ? option
            : entityRefToPresentation.get(stringifyEntityRef(option))
                ?.entityRef!
        }
        getOptionSelected={(option, value) => {
          const normalizeRef = (item: string | Entity) => {
            if (typeof item !== 'string') {
              return stringifyEntityRef(item);
            }
            try {
              return stringifyEntityRef(
                parseEntityRef(item, { defaultKind, defaultNamespace }),
              );
            } catch {
              return undefined;
            }
          };
          const optionRef = normalizeRef(option);
          return optionRef !== undefined && optionRef === normalizeRef(value);
        }}
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
        filterOptions={options => options}
        ListboxComponent={VirtualizedListbox}
        {...pagination}
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
