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
import { useCallback, useEffect, useState } from 'react';
import useAsync from 'react-use/esm/useAsync';
import { FieldValidation } from '@rjsf/utils';
import {
  MultiEntityPickerFilterQueryValue,
  MultiEntityPickerProps,
  MultiEntityPickerUiOptions,
  MultiEntityPickerFilterQuery,
} from './schema';
import { ScaffolderField } from '@backstage/plugin-scaffolder-react/alpha';
import { useTranslationRef } from '@backstage/frontend-plugin-api';
import { scaffolderTranslationRef } from '../../../translation';
import {
  cn,
  ShadcnButton as Button,
  Badge,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@backstage/core-components';
import { X, ChevronsUpDown, Check } from 'lucide-react';

export { MultiEntityPickerSchema } from './schema';

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

  // Internal selected values state — mirrors formData but enables uncontrolled
  // accumulation (like MUI Autocomplete's defaultValue pattern) so that
  // multi-select toggling works even when the parent doesn't immediately
  // update formData in response to onChange.
  const [selectedValues, setSelectedValues] = useState<string[]>(
    formData ?? [],
  );
  // Sync internal state when formData changes externally
  useEffect(() => {
    setSelectedValues(formData ?? []);
  }, [formData]);

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

  // Popover open state and search input state for the Command combobox
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  /**
   * Toggles an entity in/out of the selected values list.
   * Replaces the MUI Autocomplete onChange handler with explicit toggle logic.
   */
  const onToggleEntity = useCallback(
    (entityOrRef: string | Entity) => {
      let entityRef: string;
      if (typeof entityOrRef !== 'string') {
        entityRef = entityOrRef
          ? stringifyEntityRef(entityOrRef as Entity)
          : '';
      } else {
        try {
          entityRef = stringifyEntityRef(
            parseEntityRef(entityOrRef, { defaultKind, defaultNamespace }),
          );
        } catch {
          entityRef = entityOrRef;
        }
      }

      if (!entityRef) return;

      // Toggle: if already selected, remove it; if not, add it
      const isSelected = selectedValues.includes(entityRef);
      let newValues: string[];

      if (isSelected) {
        newValues = selectedValues.filter((v: string) => v !== entityRef);
      } else {
        // Enforce maxItems
        if (maxItems && selectedValues.length >= maxItems) return;
        newValues = [...selectedValues, entityRef];
      }

      setSelectedValues(newValues);
      setNoOfItemsSelected(newValues.length);
      onChange(newValues);
    },
    [onChange, selectedValues, defaultKind, defaultNamespace, maxItems],
  );

  /**
   * Removes a specific entity ref from the selected values.
   * Used by the dismiss (X) button on Badge components.
   */
  const onRemoveEntity = useCallback(
    (entityRef: string) => {
      const newValues = selectedValues.filter((v: string) => v !== entityRef);
      setSelectedValues(newValues);
      setNoOfItemsSelected(newValues.length);
      onChange(newValues);
    },
    [onChange, selectedValues],
  );

  /**
   * Adds a free-text entity reference when allowArbitraryValues is enabled.
   * Triggered by pressing Enter in the CommandInput field.
   */
  const onAddFreeText = useCallback(
    (value: string) => {
      if (!value.trim()) return;

      let entityRef = value;
      try {
        entityRef = stringifyEntityRef(
          parseEntityRef(value, { defaultKind, defaultNamespace }),
        );
      } catch {
        // If parsing fails and arbitrary values are not allowed, ignore
        if (!allowArbitraryValues) return;
      }

      if (maxItems && selectedValues.length >= maxItems) return;
      if (selectedValues.includes(entityRef)) return;

      const newValues = [...selectedValues, entityRef];
      setSelectedValues(newValues);
      setNoOfItemsSelected(newValues.length);
      onChange(newValues);
      setInputValue('');
    },
    [
      onChange,
      selectedValues,
      defaultKind,
      defaultNamespace,
      allowArbitraryValues,
      maxItems,
    ],
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
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={idSchema?.$id}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={
              isDisabled ||
              (required &&
                !allowArbitraryValues &&
                entities?.entities?.length === 1)
            }
            className={cn(
              'w-full justify-between min-h-[2.5rem] h-auto',
              !selectedValues.length && 'text-muted-foreground',
            )}
          >
            <div className="flex flex-wrap gap-1 items-center">
              {selectedValues.length > 0 ? (
                selectedValues.map((ref: string) => (
                  <Badge key={ref} variant="secondary" className="mr-1">
                    {entities?.entityRefToPresentation?.get(ref)
                      ?.primaryTitle ?? ref}
                    <button
                      type="button"
                      className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      onClick={e => {
                        e.stopPropagation();
                        onRemoveEntity(ref);
                      }}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))
              ) : (
                <span>{title}</span>
              )}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command shouldFilter>
            <CommandInput
              placeholder={`Search ${title?.toLowerCase() ?? 'entities'}...`}
              value={inputValue}
              onValueChange={setInputValue}
              onKeyDown={e => {
                if (e.key === 'Enter' && allowArbitraryValues && inputValue) {
                  e.preventDefault();
                  onAddFreeText(inputValue);
                }
              }}
            />
            <CommandList>
              <CommandEmpty>
                {loading ? 'Loading...' : 'No entities found.'}
              </CommandEmpty>
              <CommandGroup>
                {(entities?.entities ?? []).map(entity => {
                  const ref = stringifyEntityRef(entity);
                  const presentation =
                    entities?.entityRefToPresentation?.get(ref);
                  const isSelected = selectedValues.includes(ref);
                  const isMaxReached = maxItems
                    ? noOfItemsSelected >= maxItems
                    : false;

                  return (
                    <CommandItem
                      key={ref}
                      value={presentation?.primaryTitle ?? ref}
                      disabled={!isSelected && isMaxReached}
                      onSelect={() => onToggleEntity(entity)}
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          isSelected ? 'opacity-100' : 'opacity-0',
                        )}
                      />
                      <EntityDisplayName entityRef={entity} />
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
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
