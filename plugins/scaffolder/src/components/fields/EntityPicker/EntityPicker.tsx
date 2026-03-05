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
import { parseEntityRef, stringifyEntityRef } from '@backstage/catalog-model';
import { useApi } from '@backstage/core-plugin-api';
import {
  EntityDisplayName,
  EntityRefPresentationSnapshot,
  catalogApiRef,
  entityPresentationApiRef,
} from '@backstage/plugin-catalog-react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  ShadcnButton as Button,
  cn,
} from '@backstage/core-components';
import { ChevronsUpDown, Check } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import useAsync from 'react-use/esm/useAsync';
import {
  EntityPickerFilterQueryValue,
  EntityPickerProps,
  EntityPickerUiOptions,
  EntityPickerFilterQuery,
} from './schema';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { scaffolderTranslationRef } from '../../../translation';
import { ScaffolderField } from '@backstage/plugin-scaffolder-react/alpha';

export { EntityPickerSchema } from './schema';

/**
 * Maximum number of entity items rendered in the Command list at once.
 * Prevents performance degradation for catalogs with thousands of entities.
 * Users can narrow results using the search/filter input. The cmdk library
 * handles filtering efficiently, but rendering thousands of DOM nodes
 * simultaneously causes layout thrashing. This limit ensures smooth
 * interaction even for very large catalogs.
 */
const MAX_RENDERED_ITEMS = 200;

/**
 * The underlying component that is rendered in the form for the `EntityPicker`
 * field extension.
 *
 * @public
 */
export const EntityPicker = (props: EntityPickerProps) => {
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
  const autoSelect = uiSchema['ui:options']?.autoSelect ?? false;
  const isDisabled = uiSchema?.['ui:disabled'] ?? false;
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const autoSelectApplied = useRef(false);

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

  const onSelectEntity = useCallback(
    (entityRef: string) => {
      // Find the actual entity from the catalog results
      const entity = entities?.catalogEntities.find(
        e => stringifyEntityRef(e) === entityRef,
      );
      if (entity) {
        onChange(stringifyEntityRef(entity));
      } else if (allowArbitraryValues) {
        // Free solo: user typed a value that doesn't match an entity
        let resolvedRef = entityRef;
        try {
          resolvedRef = stringifyEntityRef(
            parseEntityRef(entityRef, { defaultKind, defaultNamespace }),
          );
        } catch (err) {
          // If not a valid entity ref, use as-is
        }
        onChange(resolvedRef);
      }
      setOpen(false);
    },
    [onChange, entities, defaultKind, defaultNamespace, allowArbitraryValues],
  );

  const onClear = useCallback(() => {
    onChange(undefined);
    setOpen(false);
  }, [onChange]);

  // Handle free-solo submission when user types a value not in the entity list
  const handleFreeSoloSubmit = useCallback(
    (value: string) => {
      if (!value) return;
      let entityRef = value;
      try {
        entityRef = stringifyEntityRef(
          parseEntityRef(value, { defaultKind, defaultNamespace }),
        );
      } catch (err) {
        // Not a valid entity ref, use as-is
      }
      if (formData !== value || allowArbitraryValues) {
        onChange(entityRef);
      }
      setOpen(false);
    },
    [onChange, formData, defaultKind, defaultNamespace, allowArbitraryValues],
  );

  // Since free solo can be enabled, attempt to parse as a full entity ref first, then fall
  // back to the given value.
  const selectedEntity =
    entities?.catalogEntities.find(e => stringifyEntityRef(e) === formData) ??
    (allowArbitraryValues && formData ? getLabel(formData) : '');

  useEffect(() => {
    if (
      required &&
      !allowArbitraryValues &&
      entities?.catalogEntities.length === 1 &&
      selectedEntity === ''
    ) {
      onChange(stringifyEntityRef(entities.catalogEntities[0]));
    }
  }, [entities, onChange, selectedEntity, required, allowArbitraryValues]);

  // autoSelect support: automatically selects the first matching entity when
  // the entity list loads and the field has no current value. This restores
  // the behavior of MUI Autocomplete's autoSelect option for the cmdk combobox.
  useEffect(() => {
    if (
      autoSelect &&
      !autoSelectApplied.current &&
      !formData &&
      entities?.catalogEntities &&
      entities.catalogEntities.length > 0
    ) {
      autoSelectApplied.current = true;
      onChange(stringifyEntityRef(entities.catalogEntities[0]));
    }
  }, [autoSelect, formData, entities, onChange]);

  // Limit the rendered items to MAX_RENDERED_ITEMS to prevent performance
  // degradation for very large catalogs. The cmdk search filter still operates
  // over the full dataset — only DOM rendering is capped.
  const catalogEntities = useMemo(
    () => entities?.catalogEntities ?? [],
    [entities?.catalogEntities],
  );
  const renderedEntities = useMemo(
    () => catalogEntities.slice(0, MAX_RENDERED_ITEMS),
    [catalogEntities],
  );
  const isTruncated = catalogEntities.length > MAX_RENDERED_ITEMS;

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
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label={title}
            disabled={
              isDisabled ||
              (required &&
                !allowArbitraryValues &&
                entities?.catalogEntities.length === 1)
            }
            className={cn(
              'w-full justify-between font-normal',
              !formData && 'text-muted-foreground',
            )}
            id={idSchema?.$id}
          >
            {formData
              ? entities?.entityRefToPresentation.get(formData)?.entityRef ??
                formData
              : title}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[--radix-popover-trigger-width] p-0"
          align="start"
        >
          <Command
            filter={(value, search) => {
              // Use entity presentation title for filtering
              const presentation = entities?.entityRefToPresentation.get(value);
              const label = presentation?.primaryTitle ?? value;
              return label.toLowerCase().includes(search.toLowerCase()) ? 1 : 0;
            }}
          >
            <CommandInput
              placeholder={`Search ${title?.toLowerCase() ?? 'entities'}...`}
              value={inputValue}
              onValueChange={setInputValue}
            />
            <CommandList>
              <CommandEmpty>
                {loading ? 'Loading...' : 'No entities found.'}
              </CommandEmpty>
              <CommandGroup>
                {renderedEntities.map(entity => {
                  const ref = stringifyEntityRef(entity);
                  return (
                    <CommandItem
                      key={ref}
                      value={ref}
                      onSelect={onSelectEntity}
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          formData === ref ? 'opacity-100' : 'opacity-0',
                        )}
                      />
                      <EntityDisplayName entityRef={entity} />
                    </CommandItem>
                  );
                })}
                {isTruncated && (
                  <div className="px-2 py-1.5 text-xs text-muted-foreground">
                    Showing {MAX_RENDERED_ITEMS} of {catalogEntities.length}{' '}
                    entities — type to filter
                  </div>
                )}
              </CommandGroup>
            </CommandList>
            {/* Free solo submission: if allowArbitraryValues and inputValue doesn't match any entity */}
            {allowArbitraryValues && inputValue && (
              <div className="border-t border-border p-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start font-normal"
                  onClick={() => handleFreeSoloSubmit(inputValue)}
                >
                  Use &quot;{inputValue}&quot;
                </Button>
              </div>
            )}
          </Command>
        </PopoverContent>
      </Popover>
      {/* Clear button when value is set */}
      {formData && !isDisabled && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          aria-label="Clear"
          onClick={onClear}
          className="mt-1 h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
        >
          Clear
        </Button>
      )}
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
